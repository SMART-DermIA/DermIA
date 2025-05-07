import torch
import torch.nn as nn
from torchvision import models

# 🔥 Vérifier si GPU disponible
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 📦 Charger un modèle pré-entraîné ResNet18
model = models.resnet18(pretrained=False)  # On n'utilise pas d'internet dans le conteneur
model.fc = nn.Linear(model.fc.in_features, 2)

# 🚀 Envoyer sur GPU ou CPU
model = model.to(device)

print("✅ Le modèle ResNet18 est prêt et fonctionne sur", device)