import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

# 1) Config device et chemin du modèle
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join(os.getcwd(), "melanoma_cnn.pth")

# 2) Noms des classes (correspondent à l'ordre dans ImageFolder)
class_names = ["benign", "malignant"]  
# → Attention à l’ordre : ici on suppose que 0 = benign, 1 = malignant

# 3) Transforms exactement comme en validation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# 4) Charger le modèle
model = models.resnet18(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

def predict_image(image_path: str):
    """
    Charge une image, la transforme, fait la prédiction et
    renvoie (label, confiance).
    """
    # Charger et convertir en RGB
    img = Image.open(image_path).convert("RGB")

    # Appliquer les transforms + ajouter batch dim
    input_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)               # logits [1,2]
        probs = torch.softmax(outputs, dim=1)[0]    # proba shape [2]
        pred = probs.argmax().item()                # indice 0 ou 1
        conf = probs[pred].item()

    label = class_names[pred]
    return label, conf

if __name__ == "__main__":
    # ← Remplace par le chemin vers TON image de test
    test_image = "/Users/morganenaibo/Downloads/ew1.jpg"

    if not os.path.exists(test_image):
        print(f" Le fichier n'existe pas : {test_image}")
        exit(1)

    label, confidence = predict_image(test_image)
    print(f"Résultat : {label} ({confidence*100:.1f} % de confiance)")
