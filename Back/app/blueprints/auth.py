from flask import Blueprint, request, jsonify
from ..models import User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies
from ..extensions import db, mail, bcrypt


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

# --- 1) LOGIN avec email-2FA conditionnel ---
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username et mot de passe requis"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Identifiants invalides"}), 401

    # Si l’utilisateur a activé la 2FA par email, on renvoie un temp_token
    if user.is_2fa_email_enabled:
        temp_token = create_access_token(
            identity=str(user.id),
            additional_claims={"email_2fa_pending": True},
            expires_delta=timedelta(minutes=5)
        )
        return jsonify({
            "2fa_email_required": True,
            "temp_token": temp_token
        }), 200

    # Sinon, on lui donne directement le token final
    access_token = create_access_token(identity=str(user.id))

    resp = jsonify({"msg": "Login successful"})
    set_access_cookies(resp, access_token)

    return resp, 200


# --- 2) Envoi du code par email (utilise temp_token) ---
@auth_bp.route('/2fa/email/send', methods=['POST'])
@jwt_required()  # lit temp_token
def send_2fa_email():
    claims = get_jwt()
    # Vérifie qu’on est en session 2FA
    if not claims.get("email_2fa_pending"):
        return jsonify({"error": "Session 2FA invalide"}), 401

    user = User.query.get(get_jwt_identity())
    if not user or not user.email:
        return jsonify({"error": "Email non défini"}), 400

    # Génère un code 6 chiffres
    code = ''.join(random.choices(string.digits, k=6))
    user.twofa_email_code   = code
    user.twofa_email_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    # Envoi de l’email
    msg = Message("Votre code de connexion DermIA", recipients=[user.email])
    msg.body = (
        f"Votre code de connexion à DermIA est : {code}\n"
        "Ce code expire dans 10 minutes."
    )
    mail.send(msg)

    return jsonify({"msg": "Code envoyé par email"}), 200


# --- 3) Vérification du code et émission du vrai access_token ---
@auth_bp.route('/2fa/email/verify', methods=['POST'])
@jwt_required()  # lit toujours temp_token
def verify_2fa_email():
    claims = get_jwt()
    if not claims.get("email_2fa_pending"):
        return jsonify({"error": "Session 2FA invalide"}), 401

    data = request.get_json() or {}
    code = data.get('code', "")

    user = User.query.get(get_jwt_identity())
    # Vérifie le code et la validité temporelle
    if (
        user.twofa_email_code != code or
        not user.twofa_email_expiry or
        datetime.utcnow() > user.twofa_email_expiry
    ):
        return jsonify({"error": "Code invalide ou expiré"}), 401

    # Tout est OK → émettre le token final
    access_token = create_access_token(identity=str(user.id))
    # On nettoie les champs pour plus de sécurité
    user.twofa_email_code   = None
    user.twofa_email_expiry = None
    db.session.commit()

    return jsonify({"access_token": access_token}), 200

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