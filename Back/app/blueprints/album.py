import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from ..models import db, User, Album, Analysis
from ..backend_lib.image import process_image

album_bp = Blueprint('album', __name__)


# 2.1 Création “body‐map” de l’album (sans image)
@album_bp.route('/create', methods=['POST'])
@jwt_required()
def create_album():
    data = request.get_json() or {}
    title = data.get('title') or 'Nouvel album'
    x     = data.get('x')
    y     = data.get('y')
    view  = data.get('view')  # 'front' / 'back'

    if x is None or y is None or view not in ('front','back'):
        return jsonify({"error": "Coordinates (x,y) and view are required"}), 400

    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404

    album = Album(
      title=title,
      user_id=user.id,
      x=x,
      y=y,
      view=view
    )
    db.session.add(album)
    db.session.commit()

    return jsonify({
      "message": "Album créé",
      "album": {
        "id":    album.id,
        "title": album.title,
        "x":     album.x,
        "y":     album.y,
        "view":  album.view
      }
    }), 201


# 2.2 Upload d’image(s) et création d’Analysis dans un album existant
@album_bp.route('/<int:album_id>/upload', methods=['POST'])
@jwt_required()
def upload_photo(album_id):
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404

    album = Album.query.get(album_id)
    if not album or album.user_id != user.id:
        return jsonify({"error": "Album not found"}), 404

    # Vérification du form-data
    if 'image' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    result = request.form.get('result')
    if result is None:
        return jsonify({"error": "No result provided"}), 400

    # Traitement image
    try:
        ok = process_image(image)
        if not ok:
            return jsonify({"error": "Bad image format"}), 400
    except Exception:
        return jsonify({"error": "Processing error"}), 500

    # Sauvegarde du fichier
    UPLOAD_FOLDER = current_app.config['UPLOAD_PATH']
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    fname = secure_filename(image.filename)
    base, ext = os.path.splitext(fname)
    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%S')
    final = f"{user.id}_{album.id}_{ts}{ext}"
    path  = os.path.join(UPLOAD_FOLDER, final)
    image.save(path)

    # Création de l’analyse
    date_str = request.form.get('date')
    date_obj = None
    if date_str:
        try:
            date_obj = datetime.fromisoformat(date_str)
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400

    analysis = Analysis(
      photo=path,
      result=result,
      album_id=album.id,
      date=date_obj
    )
    db.session.add(analysis)
    db.session.commit()

    return jsonify({
      "message":       "Photo uploadée",
      "analysis_id":   analysis.id,
      "photo_path":    analysis.photo,
      "result":        analysis.result,
      "analysis_date": analysis.date.isoformat()
    }), 201
