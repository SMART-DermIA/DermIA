import os
import cv2
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from skimage.feature import graycomatrix, graycoprops
from sklearn.model_selection import train_test_split



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

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image non trouvée : {image_path}")
    resized_image = cv2.resize(image, (224, 224))
    normalized_image = resized_image / 255.0
    normalized_image = (normalized_image - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    return normalized_image

def extract_features(image_path):
    processed_image = preprocess_image(image_path)
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

# Dossiers contenant les images (à adapter selon ton projet)
image_folder_mel = "data/label_MEL"
image_folder_nv = "data/label_NV"

data = []
labels = []

def process_images(image_folder, label):
    for file in os.listdir(image_folder):
        if file.endswith(".jpg"):
            image_path = os.path.join(image_folder, file)
            try:
                features = extract_features(image_path)
                if features:
                    data.append(list(features.values()))
                    labels.append(label)
            except Exception as e:
                print(f"Erreur avec {file} : {e}")


columns = ["diameter", "irregularity", "asymmetry_score", "color_variation",
           "circularity", "dominant_colors", "contrast", "homogeneity"]
df = pd.DataFrame(data, columns=columns)
df['label'] = labels

# Sauvegarde CSV
df.to_csv("manual_features.csv", index=False)
print("Fichier manual_features.csv généré avec succès.")



def extract_features_from_array(image_np):
    # ton traitement ici avec OpenCV (image déjà en mémoire)
    return {
        "irregularity": 0.6,
        "asymmetry_score": 0.4,
        "diameter": 15.0,
        "color_variation": 22.3
    }

    # Save to CSV or do other tests...

if __name__ == "__main__":
    process_images(image_folder_mel, 1)
    process_images(image_folder_nv, 0)

