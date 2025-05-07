import os
import zipfile
import matplotlib.pyplot as plt
import seaborn as sns
from kaggle.api.kaggle_api_extended import KaggleApi
from PIL import Image
from collections import Counter

DATA_DIR = "data"

# Exploration du dossier
print("\nExploration du contenu du dataset...")
for root, dirs, files in os.walk(DATA_DIR):
    print(f"Répertoire: {root}, Fichiers: {len(files)}")

# Compter les images dans chaque classe
def count_images(data_path):
    label_counts = {}
    for label in os.listdir(data_path):
        class_dir = os.path.join(data_path, label)
        if os.path.isdir(class_dir):
            count = len([f for f in os.listdir(class_dir) if f.endswith(('.jpg', '.png', '.jpeg'))])
            label_counts[label] = count
    return label_counts

label_counts = count_images(DATA_DIR)
print("\nNombre d'images par classe :", label_counts)

# Visualisation simple
sns.barplot(x=list(label_counts.keys()), y=list(label_counts.values()))
plt.title("Nombre d'images par classe")
plt.xlabel("Classe")
plt.ylabel("Nombre d'images")
plt.show()

# Afficher quelques images aléatoires par classe
def show_sample_images(data_path, samples_per_class=3):
    fig, axes = plt.subplots(len(label_counts), samples_per_class, figsize=(samples_per_class * 3, len(label_counts) * 3))
    for i, label in enumerate(label_counts):
        img_dir = os.path.join(data_path, label)
        img_files = [f for f in os.listdir(img_dir) if f.endswith(('.jpg', '.png', '.jpeg'))][:samples_per_class]
        for j, img_name in enumerate(img_files):
            img_path = os.path.join(img_dir, img_name)
            img = Image.open(img_path)
            axes[i, j].imshow(img)
            axes[i, j].axis('off')
            if j == 0:
                axes[i, j].set_title(label, fontsize=12)
    plt.tight_layout()
    plt.show()

show_sample_images(DATA_DIR)
