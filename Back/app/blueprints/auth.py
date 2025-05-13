from flask import Blueprint, request, jsonify
from ..models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies


bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__) # Crée un groupe de routes pour la connexion
# (register, login)

# ====================
# Routes d'authentification
# ====================

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    age = data.get('age')

    doc_name = data.get('doctor_name')
    doc_phone = data.get('doctor_phone')
    doc_email = data.get('doctor_email')

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password, age=age, doctor_name=doc_name, doctor_phone=doc_phone, doctor_email=doc_email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        print(f"User found with username={user.username}: id={user.id}")
    else:
        print(f"No user found with username={username}")

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    resp = jsonify({"msg": "Login successful"})
    set_access_cookies(resp, access_token)

    return resp, 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "doctor_name" : user.doctor_name,
        "doctor_phone" : user.doctor_phone,
        "doctor_email" : user.doctor_email,
    }), 200

# ====================
# Routes de gestion de compte
# ====================
@auth_bp.route('/delete_account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted successfully"}), 200