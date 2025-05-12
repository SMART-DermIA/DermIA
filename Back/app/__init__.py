from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .blueprints.album import album_bp
from .blueprints.analyze import analyze_bp
from .blueprints.auth import bcrypt, auth_bp
from .models import db


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/mydb'
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
    app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.jpeg', '.png', '.gif']
    app.config['UPLOAD_PATH'] = 'uploads'

    # Extensions
    CORS(app, supports_credentials=True)
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(album_bp, url_prefix='/album')
    app.register_blueprint(analyze_bp, url_prefix='/analyze')

    @app.route('/')
    def home():
        return {"message": "Backend Flask is running"}

    with app.app_context():
        db.create_all()

    return app