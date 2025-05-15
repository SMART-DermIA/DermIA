from flask import Blueprint, request, jsonify, current_app
from ..models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, set_access_cookies, get_jwt, jwt_required, get_jwt_identity, unset_jwt_cookies, decode_token


bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__) # Crée un groupe de routes pour la connexion
# (register, login)

# ====================
# Routes d'authentification
# ====================

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    nom = data.get('nom')
    prenom = data.get('prenom')

    doc_name = data.get('doctor_name')
    doc_phone = data.get('doctor_phone')
    doc_email = data.get('doctor_email')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        email=email,
        password=hashed_password,
        nom=nom,
        prenom=prenom,
        doctor_name=doc_name,
        doctor_phone=doc_phone,
        doctor_email=doc_email
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        current_app.logger.debug(f"Failed login attempt for email={email}")
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    # Decode token to get expiry timestamp
    decoded = decode_token(access_token)
    exp = decoded['exp']  # Unix timestamp

    resp = jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id,
        "exp": exp
    })
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
        "email": user.email,
        "nom": user.nom,
        "prenom": user.prenom,
        "doctor_name": user.doctor_name,
        "doctor_phone": user.doctor_phone,
        "doctor_email": user.doctor_email,
    }), 200

@auth_bp.route('/token-info', methods=['GET'])
@jwt_required()
def token_info():
    try:
        # The token is already verified by @jwt_required
        # Get raw JWT from the request context
        token_data = get_jwt()

        exp = token_data.get("exp")
        if not exp:
            return jsonify({"error": "Expiry not found in token"}), 400

        return jsonify({"exp": exp}), 200

    except Exception as e:
        current_app.logger.exception("Error fetching token info")
        return jsonify({"error": "Could not parse token"}), 500

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
