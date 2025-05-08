import os
import zipfile
from kaggle.api.kaggle_api_extended import KaggleApi

# Authentification Kaggle
api = KaggleApi()
api.authenticate()

# Crée un dossier pour les données
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# Téléchargement et extraction
print("Téléchargement du dataset...")
api.dataset_download_files(
    'adisongoh/skin-moles-benign-vs-malignant-melanoma-isic19',
    path=DATA_DIR,
    unzip=True
)
print("Extraction terminée.")