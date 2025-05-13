from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from .blueprints.album import album_bp
from .blueprints.analyze import analyze_bp
from .blueprints.doctor import user_bp
from .blueprints.auth import bcrypt, auth_bp
from .models import db

def create_app():
    app = Flask(__name__)

    # ——— 1) CONFIG
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/mydb'
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 Mo max
    app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.jpeg', '.png']
    app.config['UPLOAD_PATH'] = os.path.join(os.getcwd(), 'uploads')


    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False  # True in production (only over HTTPS)
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"  # Or "Strict" / "None" for cross-site
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # Optional but recommended
    app.config["JWT_ACCESS_COOKIE_NAME"] = "token"

    # Extensions
    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "*"])
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)

    # ——— 4) ENREGISTREMENT DES BLUEPRINTS
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(album_bp, url_prefix='/album')
    app.register_blueprint(analyze_bp, url_prefix='/analyze')
    app.register_blueprint(user_bp, url_prefix='/user')

    @app.route('/')
    def home():
        return {"message": "Backend Flask is running"}

    # ——— 6) CRÉER LES tables si besoin
    with app.app_context():
        db.create_all()

    return app








