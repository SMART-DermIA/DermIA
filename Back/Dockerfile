# Utilise une image officielle Python
FROM python:3.11-slim

# Variables d'environnement pour éviter que Python ne génère des fichiers inutiles
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers requirements pour installer les dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copier tout le code source dans le conteneur
COPY . .

# Exposer le port sur lequel l'app Flask va tourner
EXPOSE 8000

# Démarrer l'application Flask
CMD ["python", "app.py"]