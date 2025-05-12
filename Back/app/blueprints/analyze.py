import io
import sys
import os
import numpy as np

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from PIL import Image
import torch
from torchvision import transforms, models

from IA.extract_criteria import extract_features


analyze_bp = Blueprint('analyze', __name__)

# 1) Préparer le device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 2) Charger le modèle (ResNet18 adapté) et ses poids
model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, 2)

# Assure-toi que le fichier .pth est bien à la racine de l’app (ou ajuste ce chemin)
model_path = os.path.join(os.getcwd(), "melanoma_cnn.pth")
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

# 3) Définir les transforms identiques à l’entraînement
IMG_SIZE = 224
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])

# 4) La route d’API
@analyze_bp.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_image():
    if request.method == "OPTIONS":
        return "", 204  # Empty response for pre-flight

    jwt_required()(lambda: None)()  # Apply JWT check for POST

    # → Verif présence et nom de fichier
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 422

    file = request.files['image']
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 422

    # → Verif extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in current_app.config['UPLOAD_EXTENSIONS']:
        return jsonify({"error": f"Invalid extension {ext}"}), 422

    # → Lire l’image avec PIL
    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image data"}), 422

    # → Appliquer les transforms + batch dimension
    input_tensor = transform(img).unsqueeze(0).to(device)

    # → Inference
    with torch.no_grad():
        outputs = model(input_tensor)            # shape [1,2]
        probs = torch.softmax(outputs, dim=1)[0]  # Probabilities for each class
        pred = probs.argmax().item()             # Predicted class index (0 or 1)
        conf = probs[pred].item()                # Confidence of predicted class
        danger = probs[1].item()                 # Probability of being malignant

    label = "malignant" if pred == 1 else "benign"  # Add this line
    temp_path = "temp_image.jpg"
    img.save(temp_path)

    try:
        features = extract_features(temp_path)
        os.remove(temp_path)
    except:
        return jsonify({"error": "Feature extraction failed"}), 500

    if features is None:
        return jsonify({"error": "No lesion detected"}), 422

    # Pondérations
    weights = {
        "irregularity": 0.3,
        "asymmetry_score": 0.5,
        "diameter": 0.2,
        "color_variation": 0.1
    }

    # Normalisation manuelle des valeurs brutes si besoin
    def normalize(val, min_val, max_val):
        return np.clip((val - min_val) / (max_val - min_val), 0, 1)

    scores = {
        "irregularity": normalize(features["irregularity"], 0, 1) * 100,
        "asymmetry_score": normalize(features["asymmetry_score"], 0, 1) * 100,
        "diameter": normalize(features["diameter"], 0, 40) * 100,  # ex: max 40 mm
        "color_variation": normalize(features["color_variation"], 0, 100) * 100
    }

    return jsonify({
        "result": label,
        "confidence": round(conf, 3),
        "danger_rate": round(danger * 100, 1),
        "scores": {
            "irregularity": round(scores["irregularity"], 1),
            "asymmetry": round(scores["asymmetry_score"], 1),
            "size": round(scores["diameter"], 1),
            "color": round(scores["color_variation"], 1)
        }
    }), 200