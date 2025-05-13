import os
import cv2
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix, ConfusionMatrixDisplay
import joblib
from torchvision import transforms


# Fonction d'extraction des caractéristiques
def compute_asymmetry(mask_roi):
    h_flip = cv2.flip(mask_roi, 1)
    v_flip = cv2.flip(mask_roi, 0)

    h_diff = np.sum(np.abs(mask_roi - h_flip))
    v_diff = np.sum(np.abs(mask_roi - v_flip))

    area = np.sum(mask_roi > 0) * 255  # Normalisation par l’aire réelle
    return (h_diff + v_diff) / (2 * area + 1e-6)

# Fonction de prétraitement (redimensionnement et normalisation)
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image non trouvée : {image_path}")

    # Redimensionnement pour uniformiser les tailles (comme pour le CNN)
    resized_image = cv2.resize(image, (224, 224))

    # Normalisation pour correspondre aux transformations du CNN (moyennes/écarts types d'ImageNet)
    normalized_image = resized_image / 255.0
    normalized_image = (normalized_image - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    
    return normalized_image

# Fonction pour extraire les caractéristiques
def extract_features(image_path):
    # Applique le prétraitement avant l'extraction des caractéristiques
    processed_image = preprocess_image(image_path)

    # Extraire des caractéristiques à partir de l'image prétraitée
    image = cv2.imread(image_path)
    original = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Prétraitement
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(blurred, 255,
                                   cv2.ADAPTIVE_THRESH_MEAN_C,
                                   cv2.THRESH_BINARY_INV, 31, 5)

    # Suppression des petits bruits
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN,
                              cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))

    # Contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None

    c = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(c)
    perimeter = cv2.arcLength(c, True)

    # Masque et découpage
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [c], -1, 255, -1)
    x, y, w, h = cv2.boundingRect(c)
    roi_mask = mask[y:y+h, x:x+w]

    # Asymétrie
    resized_mask = cv2.resize(roi_mask, (256, 256))
    asymmetry_score = compute_asymmetry(resized_mask)

    # Irrégularité (écart à une ellipse parfaite)
    try:
        ellipse = cv2.fitEllipse(c)
        ellipse_mask = np.zeros_like(gray)
        cv2.ellipse(ellipse_mask, ellipse, 255, -1)
        diff_mask = cv2.absdiff(mask, ellipse_mask)
        irregularity = np.sum(diff_mask) / (np.sum(mask) + 1e-6)
    except:
        irregularity = 1  # cas d'échec d'ajustement

    # Variation de couleurs
    grain_pixels = cv2.bitwise_and(original, original, mask=mask)
    lab = cv2.cvtColor(grain_pixels, cv2.COLOR_BGR2LAB)
    _, a, b = cv2.split(lab)
    color_std = np.std(a[mask == 255]) + np.std(b[mask == 255])

    return {
        "irregularity": irregularity,
        "asymmetry_score": asymmetry_score,
        "color_variation": color_std
    }

# Dossier contenant les sous-dossiers des labels
image_folder_mel = "data/label_MEL"
image_folder_nv = "data/label_NV"

# Liste pour stocker les données et labels
data = []
labels = []

# Fonction pour extraire les images et leurs labels
def process_images(image_folder, label):
    for file in os.listdir(image_folder):
        if file.endswith(".jpg"):
            # Chemin de l'image
            image_path = os.path.join(image_folder, file)
            
            # Extraire les caractéristiques
            features = extract_features(image_path)
            if features:
                data.append(list(features.values()))
                labels.append(label)

# Traiter les images des deux sous-dossiers
process_images(image_folder_mel, 1)  # 1 pour 'malignant'
process_images(image_folder_nv, 0)   # 0 pour 'benign'

# Créer un DataFrame avec les features et labels
df = pd.DataFrame(data, columns=[ "irregularity", "asymmetry_score", "color_variation"])
df['label'] = labels

# Afficher un échantillon des données
print(df.head())

# Séparer les features (X) et les labels (y)
# X = df.drop(columns=['label'])
X = df.drop(columns=['label'])
y = df['label']

# Séparer les données en train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalisation des données
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Entraînement du modèle
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X_train_scaled, y_train)

# Prédictions sur le test
y_pred = model.predict(X_test_scaled)

# Évaluation du modèle
print(classification_report(y_test, y_pred))
print(f"AUC: {roc_auc_score(y_test, model.predict_proba(X_test_scaled)[:, 1]):.2f}")

import matplotlib.pyplot as plt

# Importance des features
importances = model.feature_importances_
features = X.columns

plt.barh(features, importances)
plt.xlabel("Importance")
plt.title("Importance des Features")
plt.show()

cm = confusion_matrix(y_test, y_pred)
ConfusionMatrixDisplay(cm).plot()
plt.title("Matrice de confusion")
plt.show()

# Sauvegarde du modèle
joblib.dump(model, "random_forest.pkl")
joblib.dump(scaler, "scaler.pkl")
