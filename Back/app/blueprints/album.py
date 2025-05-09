import os
from datetime import datetime

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from ..backend_lib.image import process_image
from ..models import Album, db, Analysis, User

album_bp = Blueprint('album', __name__)

@album_bp.route('/new', methods=['POST'])
@jwt_required()
def create_album():
    # Get data from request object
    title = request.form.get('title')
    if title is None:
        return jsonify({"error": "No title given in body"}), 400

    result = request.form.get('result')
    if result is None:
        return jsonify({"error": "No result given in body"}), 400

    date_str = request.form.get('date')  # Expecting a string like '2025-05-09'

    # Get files from request object
    print(request.files)
    if 'image' not in request.files:
        return jsonify({"error": "No file given in body"}), 400
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No file given in body"}), 400

    # Get current user
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        processed = process_image(image)
        if not processed:
            return jsonify({"error": "Image not in correct format"}), 404
    except:
        return jsonify({"error": "Unexpected error formatting given image"}), 500

    # Create directory to save file if not already there
    os.makedirs(current_app.config['UPLOAD_PATH'], exist_ok=True)

    # Generate a file name
    original_filename = secure_filename(image.filename)
    base, ext = os.path.splitext(original_filename)
    timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%S')
    filename = f"{user.id}_{timestamp}{ext}"
    save_path = os.path.join(current_app.config['UPLOAD_PATH'], filename)

    # If file name already taken, append suffix to avoid overwriting
    counter = 1
    while os.path.exists(save_path):
        filename = f"{user.id}_{timestamp}_{counter}{ext}"
        save_path = os.path.join(current_app.config['UPLOAD_PATH'], filename)
        counter += 1

    # Save image
    image.save(save_path)

    # Create new Album
    new_album = Album(title=title, user_id=user.id)
    db.session.add(new_album)
    db.session.flush()

    # Attempt to parse date (if given)
    date = None
    if date_str is not None:
        try:
            date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")
        except:
            return jsonify({"error": "Could not parse given date"}), 404

    # Create new Analysis
    new_analysis = Analysis(
        photo=save_path,
        result=result,
        album_id=new_album.id,
        date=date
    )
    db.session.add(new_analysis)
    db.session.commit()
    db.session.flush()

    return jsonify({
        "message": f"Album created with id={new_album.id}",
        "album_id": new_album.id
    }), 200