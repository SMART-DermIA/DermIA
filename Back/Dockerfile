# Utilise une image officielle Python
FROM python:3.11-slim

# Variables d'environnement pour éviter que Python ne génère des fichiers inutiles
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Définir le répertoire de travail dans le conteneur
WORKDIR /app
ENV PYTHONPATH=/app

# Copier les fichiers requirements pour installer les dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Copier tout le code source dans le conteneur
COPY . .

# Exposer le port sur lequel l'app Flask va tourner
EXPOSE 8000

COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh
# Démarrer l'application Flask
CMD ["/wait-for-postgres.sh", "python", "run.py"]