from flask import Flask
from models import db
from auth import auth_bp, bcrypt
from analyze import analyze_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os


app = Flask(__name__)
CORS(app,
     origins=["http://localhost:5173"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Authorization"])


# Base de données
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/mydb'
app.config['JWT_SECRET_KEY']       = 'super-secret-key'
app.config['MAX_CONTENT_LENGTH']   = 16 * 1024 * 1024    # 16 Mo max
app.config['UPLOAD_EXTENSIONS']    = ['.jpg', '.jpeg', '.png']
app.config['UPLOAD_PATH']          = os.path.join(os.getcwd(), 'uploads')

db.init_app(app)
with app.app_context():
    db.create_all()

bcrypt.init_app(app)
jwt = JWTManager(app)

<<<<<<< HEAD
# Blueprints
app.register_blueprint(auth_bp,    url_prefix='/auth')
app.register_blueprint(analyze_bp, url_prefix='/')
=======
with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(analyze_bp)
>>>>>>> origin/back

@app.route('/')
def home():
    return {"message": "Backend Flask is running"}

if __name__ == "__main__":
    # Créer dossier d’uploads si besoin
    os.makedirs(app.config['UPLOAD_PATH'], exist_ok=True)
    app.run(host="0.0.0.0", port=8000)

