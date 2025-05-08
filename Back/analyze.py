from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

analyze_bp = Blueprint('analyze', __name__)

@analyze_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_image():
    print(request.files)
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']

    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400

    return jsonify({
        "message": "Image reçue avec succès",
        "filename": filename
    }), 200
