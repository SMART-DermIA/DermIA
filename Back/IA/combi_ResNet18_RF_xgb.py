import os
import cv2
import torch
import torch.nn as nn
import numpy as np
import joblib
from PIL import Image
from torchvision import models, transforms
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from skimage.feature import graycomatrix, graycoprops
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd
from tqdm import tqdm
import matplotlib.pyplot as plt
import seaborn as sns

# Classes (dans l'ordre de ImageFolder, donc vérifier si besoin)
class_names = ["malignant", "benign"]

# Configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# Chargement des modèles
cnn_model = models.resnet18()
cnn_model.fc = nn.Linear(cnn_model.fc.in_features, 2)
cnn_model.load_state_dict(torch.load("melanoma_cnn.pth", map_location=device))
cnn_model = cnn_model.to(device)
cnn_model.eval()

xgb_model = joblib.load("xgboost.pkl")
rf_model = joblib.load("random_forest.pkl")
scaler_rf = joblib.load("scaler.pkl")
scaler_xgb=joblib.load("scalerxgb.pkl")

def getPredCNN(image_path):
    # Charger et transformer l'image
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)  # [1, 3, 224, 224]

    # Prédiction
    with torch.no_grad():
        output = cnn_model(image)
        probabilities = torch.softmax(output, dim=1)
        confidence, predicted_class = torch.max(probabilities, dim=1)

    predicted_label = class_names[predicted_class.item()]
    confidence_score = confidence.item()

    return predicted_label, confidence_score


# Fonction d'asymétrie (identique à l'entraînement)
def compute_asymmetry(mask_roi):
    h_flip = cv2.flip(mask_roi, 1)
    v_flip = cv2.flip(mask_roi, 0)
    h_diff = np.sum(np.abs(mask_roi - h_flip))
    v_diff = np.sum(np.abs(mask_roi - v_flip))
    area = np.sum(mask_roi > 0) * 255
    return (h_diff + v_diff) / (2 * area + 1e-6)


def dominant_colors(image, mask, k=3):
    pixels = image[mask == 255].reshape(-1, 3)
    if len(pixels) < k:
        return 0
    kmeans = KMeans(n_clusters=k, random_state=42).fit(pixels)
    return kmeans.inertia_

def texture_features(gray_image, mask):
    masked = gray_image.copy()
    masked[mask == 0] = 0
    glcm = graycomatrix(masked, distances=[5], angles=[0], levels=256, symmetric=True, normed=True)
    contrast = graycoprops(glcm, 'contrast')[0, 0]
    homogeneity = graycoprops(glcm, 'homogeneity')[0, 0]
    return contrast, homogeneity

# Fonction de prétraitement
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image non trouvée : {image_path}")
    resized_image = cv2.resize(image, (224, 224))
    normalized_image = resized_image / 255.0
    normalized_image = (normalized_image - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    return normalized_image

# Extraction des caractéristiques
def extract_features_RF(image_path):
    preprocess_image(image_path)  # Pour uniformité avec entraînement (pas utilisé ici)
    image = cv2.imread(image_path)
    original = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(blurred, 255,
                                   cv2.ADAPTIVE_THRESH_MEAN_C,
                                   cv2.THRESH_BINARY_INV, 31, 5)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN,
                              cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None

    c = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(c)
    perimeter = cv2.arcLength(c, True)

    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [c], -1, 255, -1)
    x, y, w, h = cv2.boundingRect(c)
    roi_mask = mask[y:y+h, x:x+w]
    resized_mask = cv2.resize(roi_mask, (256, 256))
    asymmetry_score = compute_asymmetry(resized_mask)

    try:
        ellipse = cv2.fitEllipse(c)
        ellipse_mask = np.zeros_like(gray)
        cv2.ellipse(ellipse_mask, ellipse, 255, -1)
        diff_mask = cv2.absdiff(mask, ellipse_mask)
        irregularity = np.sum(diff_mask) / (np.sum(mask) + 1e-6)
    except:
        irregularity = 1

    diameter = np.sqrt(4 * area / np.pi)

    grain_pixels = cv2.bitwise_and(original, original, mask=mask)
    lab = cv2.cvtColor(grain_pixels, cv2.COLOR_BGR2LAB)
    _, a, b = cv2.split(lab)
    color_std = np.std(a[mask == 255]) + np.std(b[mask == 255])

    return {
        "diameter": diameter,
        "irregularity": irregularity,
        "asymmetry_score": asymmetry_score,
        "color_variation": color_std
    }

def getPredRF(image_path):
    features = extract_features_RF(image_path)
    if features is None:
        return "Aucune caractéristique détectée (contour manquant)", None

    # Convertir en vecteur dans le même ordre que l'entraînement (diameter exclu si c'est le cas)
    input_features = np.array([
        features["irregularity"],
        features["asymmetry_score"],
        features["color_variation"]
    ]).reshape(1, -1)

    input_scaled = scaler_rf.transform(input_features)
    proba = rf_model.predict_proba(input_scaled)[0]
    predicted_label = int(np.argmax(proba))
    confidence = proba[predicted_label]

    label_name = "malignant" if predicted_label == 1 else "benign"
    return label_name, confidence


# Extraction des features
def extract_features_xgb(image_path):
    preprocess_image(image_path)  # Uniformisation du pipeline
    image = cv2.imread(image_path)
    original = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    dilated_edges = cv2.dilate(edges, None)
    contours, _ = cv2.findContours(dilated_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    c = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(c)
    perimeter = cv2.arcLength(c, True)
    circularity = 4 * np.pi * area / (perimeter ** 2 + 1e-6)
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [c], -1, 255, -1)
    x, y, w, h = cv2.boundingRect(c)
    roi_mask = mask[y:y+h, x:x+w]
    resized_mask = cv2.resize(roi_mask, (256, 256))
    asymmetry_score = compute_asymmetry(resized_mask)
    try:
        ellipse = cv2.fitEllipse(c)
        ellipse_mask = np.zeros_like(gray)
        cv2.ellipse(ellipse_mask, ellipse, 255, -1)
        diff_mask = cv2.absdiff(mask, ellipse_mask)
        irregularity = np.sum(diff_mask) / (np.sum(mask) + 1e-6)
    except:
        irregularity = 1
    diameter = np.sqrt(4 * area / np.pi)
    grain_pixels = cv2.bitwise_and(original, original, mask=mask)
    lab = cv2.cvtColor(grain_pixels, cv2.COLOR_BGR2LAB)
    _, a, b = cv2.split(lab)
    color_std = np.std(a[mask == 255]) + np.std(b[mask == 255])
    n_colors = dominant_colors(original, mask, k=3)
    contrast, homogeneity = texture_features(gray, mask)
    return {
        "diameter": diameter,
        "irregularity": irregularity,
        "asymmetry_score": asymmetry_score,
        "color_variation": color_std,
        "circularity": circularity,
        "dominant_colors": n_colors,
        "contrast": contrast,
        "homogeneity": homogeneity
    }

# Prédiction avec XGBoost
def getPredXGB(image_path):
    features = extract_features_xgb(image_path)
    if features is None:
        return "Aucune caractéristique détectée (contour manquant)", None

    # Ordre des features attendu par le modèle (diameter exclu ici)
    feature_vector = np.array([
        features["irregularity"],
        features["asymmetry_score"],
        features["color_variation"],
        features["circularity"],
        features["dominant_colors"],
        features["contrast"],
        features["homogeneity"]
    ]).reshape(1, -1)

    feature_vector_scaled = scaler_xgb.transform(feature_vector)
    proba = xgb_model.predict_proba(feature_vector_scaled)[0]
    predicted_label = int(np.argmax(proba))
    confidence = proba[predicted_label]

    label_name = "malignant" if predicted_label == 1 else "benign"
    return label_name, confidence



# Dossier contenant les images
data_dir = "data"
subfolders = [("label_MEL", "malignant"), ("label_NV", "benign")]

# Résultats
true_labels = []
preds_cnn = []
preds_rf = []
preds_xgb = []
preds_ensemble = []

# Pondérations des modèles (à ajuster si besoin)
weights = {
    "cnn": 1.0,
    "rf": 1.0,
    "xgb": 1.0
}

# Traitement
for folder_name, label in subfolders:
    folder_path = os.path.join(data_dir, folder_name)
    image_files = sorted([f for f in os.listdir(folder_path) if f.endswith((".jpg", ".png", ".jpeg"))])[:500]
    
    for file_name in tqdm(image_files, desc=f"Traitement de {folder_name}"):
        image_path = os.path.join(folder_path, file_name)
        true_labels.append(label)

        # Prédictions individuelles
        pred_cnn, conf_cnn = getPredCNN(image_path)
        pred_rf, conf_rf = getPredRF(image_path)
        pred_xgb, conf_xgb = getPredXGB(image_path)

        preds_cnn.append(pred_cnn)
        preds_rf.append(pred_rf)
        preds_xgb.append(pred_xgb)

        # Prédiction pondérée combinée (probabilité "malignant" = 1, "benign" = 0)
        prob_cnn = conf_cnn if pred_cnn == "malignant" else 1 - conf_cnn
        prob_rf = conf_rf if pred_rf == "malignant" else 1 - conf_rf
        print("pred =", pred_xgb)
        print("xgb =", conf_xgb)
        if (conf_xgb==None):
            conf_xgb=0.5
        prob_xgb = conf_xgb if pred_xgb == "malignant" else 1 - conf_xgb

        weighted_sum = (weights["cnn"] * prob_cnn +
                        weights["rf"] * prob_rf +
                        weights["xgb"] * prob_xgb)
        total_weight = sum(weights.values())
        avg_prob = weighted_sum / total_weight
        final_pred = "malignant" if avg_prob >= 0.5 else "benign"

        preds_ensemble.append(final_pred)

# Évaluation
def evaluate_model(name, y_true, y_pred):
    print(f"\n=== {name.upper()} ===")
    acc = accuracy_score(y_true, y_pred)
    cm = confusion_matrix(y_true, y_pred, labels=["malignant", "benign"])
    print("Accuracy:", acc)
    print("Classification Report:")
    print(classification_report(y_true, y_pred, target_names=["malignant", "benign"]))
    
    # Affichage matrice de confusion
    sns.heatmap(cm, annot=True, fmt='d', cmap="Blues",
                xticklabels=["malignant", "benign"],
                yticklabels=["malignant", "benign"])
    plt.title(f"Confusion Matrix - {name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.show()

# Résultats pour chaque modèle
evaluate_model("CNN", true_labels, preds_cnn)
evaluate_model("Random Forest", true_labels, preds_rf)
#evaluate_model("XGBoost", true_labels, preds_xgb)
acc = accuracy_score(true_labels, preds_xgb)
evaluate_model("Modèle combiné", true_labels, preds_ensemble)
