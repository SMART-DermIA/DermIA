from flask import Flask
from models import db
from auth import auth_bp, bcrypt
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/mydb'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # à mettre dans .env plus tard

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/')
def home():
    return {"message": "Backend Flask is running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)