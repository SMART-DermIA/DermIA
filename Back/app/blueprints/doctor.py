# auth.py (ou un autre blueprint user_bp)

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route('/add_medecin', methods=['POST'])
@jwt_required()
def add_medecin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    # Récupère les champs, ou laisse à None s’ils ne sont pas fournis
    user.doctor_name  = data.get('doctor_name')
    user.doctor_phone = data.get('doctor_phone')
    user.doctor_email = data.get('doctor_email')

    db.session.commit()
    return jsonify({
        "message": "Médecin traitant ajouté avec succès",
        "doctor": {
          "name":  user.doctor_name,
          "phone": user.doctor_phone,
          "email": user.doctor_email
        }
    }), 201

@user_bp.route('/update_medecin', methods=['PUT'])
@jwt_required()
def update_medecin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    # Pour chaque champ, on ne met à jour QUE s’il est présent dans la requête
    if 'doctor_name' in data:
        user.doctor_name = data['doctor_name']
    if 'doctor_phone' in data:
        user.doctor_phone = data['doctor_phone']
    if 'doctor_email' in data:
        user.doctor_email = data['doctor_email']

    db.session.commit()
    return jsonify({
        "message": "Médecin traitant mis à jour avec succès",
        "doctor": {
          "name":  user.doctor_name,
          "phone": user.doctor_phone,
          "email": user.doctor_email
        }
    }), 200
