
import io
import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from PIL import Image
import torch
from torchvision import transforms, models

analyze_bp = Blueprint('analyze', __name__)

# ———— 1) Préparer le device et **charger le modèle** —————
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# On part du principe que ton melanoma_cnn.pth est copié dans /app du conteneur
model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, 2)
model_path = os.path.join(os.getcwd(), "melanoma_cnn.pth")
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

# ———— 2) Définir les transforms que tu as utilisés à l’entraînement —————
IMG_SIZE = 224
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    # si toi tu normalisais avec ImageNet, remets les mêmes valeurs :
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])


@analyze_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_image():
    if 'image' not in request.files:
        print("DEBUG: pas de champ 'image' dans request.files → form-data mal envoyé")
        return jsonify({"error": "No image uploaded"}), 422

    file = request.files['image']
    if file.filename == '':
        print("DEBUG: filename vide")
        return jsonify({"error": "No selected file"}), 422

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in current_app.config['UPLOAD_EXTENSIONS']:
        print(f"DEBUG: extension invalide: {ext}")
        return jsonify({"error": "Invalid image extension"}), 422

    try:
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
    except Exception as e:
        print("DEBUG: erreur PIL:", e)
        return jsonify({"error": "Invalid image data"}), 422

  
    # 4) Appliquer les transforms et ajouter la batch dim
    input_tensor = transform(img).unsqueeze(0).to(device)

    # 5) Faire la prédiction

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        pred = probs.argmax().item()
        conf = probs[pred].item()

    label = 'malignant' if pred == 1 else 'benign'
    return jsonify({
        'result': label,
        'confidence': round(conf, 3)
    })

    # 6) Renvoyer la réponse
    return jsonify({
        "result": label
    }), 200