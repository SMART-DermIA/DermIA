import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# 1) Configuration du device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 2) Classe (ordre de ImageFolder)
class_names = ["benign", "malignant"]

# 3) Transform identique au serveur
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# 4) Chemin vers le .pth – modifier ici selon où vous avez votre fichier
MODEL_PATH = os.path.join(os.getcwd(), "/Users/morganenaibo/4IF/SMART/DermIA/Back/melanoma_cnn.pth")

# 5) Charger le modèle synchronisé avec le training
model = models.resnet18(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

def predict_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img_t = transform(img).unsqueeze(0).to(device)  # 1x3x224x224

    with torch.no_grad():
        out = model(img_t)
        probs = torch.softmax(out, dim=1)
        conf, idx = torch.max(probs, dim=1)

    label  = class_names[idx.item()]
    score  = conf.item()
    return label, score

if __name__ == "__main__":
    test_path = "/Users/morganenaibo/Downloads/ew1.jpg"
    lbl, sc = predict_image(test_path)
    print(f"Résultat : {lbl} ({sc*100:.2f}%)")
