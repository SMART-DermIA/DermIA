import os
import torch
from torchvision import transforms, datasets
from torch.utils.data import DataLoader, random_split

# 🔢 Taille d’entrée pour CNN pré-entraîné
IMG_SIZE = 224

# 📁 Chemin vers les images (doit contenir /benign/ et /malignant/)
DATA_DIR = "data"

# 🎨 Transforms — étape clé !
train_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),      # Uniformise la taille
    transforms.RandomHorizontalFlip(),            # Flip horizontal aléatoire
    transforms.RandomRotation(15),                # Petite rotation
    transforms.ColorJitter(brightness=0.1, contrast=0.1),  # Variation légère
    transforms.ToTensor(),                        # Convertit en tenseur [0,1]
    transforms.Normalize([0.485, 0.456, 0.406],    # Moyennes/écarts types ImageNet
                         [0.229, 0.224, 0.225])
])

val_test_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),      
    transforms.ToTensor(),                        
    transforms.Normalize([0.485, 0.456, 0.406],    
                         [0.229, 0.224, 0.225])
])

# Charge les images avec leur label depuis les dossiers
full_dataset = datasets.ImageFolder(DATA_DIR)

# Fractionne en train / val / test
total_size = len(full_dataset)
train_size = int(0.7 * total_size)
val_size = int(0.15 * total_size)
test_size = total_size - train_size - val_size

train_dataset, val_dataset, test_dataset = random_split(full_dataset, [train_size, val_size, test_size])

# Applique les bons transforms
train_dataset.dataset.transform = train_transforms
val_dataset.dataset.transform = val_test_transforms
test_dataset.dataset.transform = val_test_transforms

# Dataloaders pour l’entraînement
BATCH_SIZE = 32

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE)

