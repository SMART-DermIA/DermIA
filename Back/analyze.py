# analyze.py
import io
import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from PIL import Image
import torch
from torchvision import transforms, models

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
@analyze_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_image():
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
        outputs = model(input_tensor)               # logits shape [1, 2]
        probs = torch.softmax(outputs, dim=1)[0]    # softmax sur les 2 classes
        pred = probs.argmax().item()                # 0 ou 1
        conf = probs[pred].item()                   # probabilité associée

    # → Préparer le label texte
    label = "malignant" if pred == 1 else "benign"

    # → Retourner le JSON
    return jsonify({
        "result":     label,
        "confidence": round(conf, 3)
    }), 200
