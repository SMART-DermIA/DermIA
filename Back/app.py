from flask import Flask
from models import db
from auth import auth_bp, bcrypt
from analyze import analyze_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/mydb'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.jpeg', '.png', '.gif']
app.config['UPLOAD_PATH'] = 'uploads'

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(analyze_bp)

@app.route('/')
def home():
    return {"message": "Backend Flask is running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)