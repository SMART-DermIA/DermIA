from flask import Blueprint, request, jsonify
from models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__) # Crée un groupe de routes pour la connexion
# (register, login)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    age = data.get('age')

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password, age=age)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({"access_token": access_token}), 200