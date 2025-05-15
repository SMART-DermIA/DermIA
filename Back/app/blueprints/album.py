import os
from datetime import datetime, timezone

import flask
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
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

    # Extract additional parameters
    danger_rate = request.form.get('danger_rate', type=float)
    confidence = request.form.get('confidence', type=float)
    asymmetry = request.form.get('asymmetry', type=float)
    color = request.form.get('color', type=float)
    irregularity = request.form.get('irregularity', type=float)
    size = request.form.get('size', type=float)

    date_str = request.form.get('date')  # Expecting a string like '2025-05-09'

    # Get files from request object
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
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')
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
        date=date,
        danger_rate=danger_rate,
        confidence=confidence,
        asymmetry=asymmetry,
        color=color,
        irregularity=irregularity,
        size=size
    )
    db.session.add(new_analysis)
    db.session.commit()

    return jsonify({
        "message": f"Album created with id={new_album.id}",
        "album_id": new_album.id
    }), 200

@album_bp.route('/', methods=['GET'])
@jwt_required()
def get_albums():
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get all albums belonging to the user
    albums = Album.query.filter_by(user_id=user.id).all()

    result = []
    for album in albums:
        # Get all analyses for this album
        analyses = (
            Analysis.query
            .filter_by(album_id=album.id)
            .order_by(Analysis.date.desc())
        )

        latest_analysis = analyses.first()

        analyses = [
            {
                "id": analysis.id,
                "photo": flask.request.host_url.strip("/") + analysis.photo,
                "result": analysis.result,
                "date": analysis.date.isoformat(),
                "danger_rate": analysis.danger_rate,
                "confidence": analysis.confidence,
                "asymmetry": analysis.asymmetry,
                "color": analysis.color,
                "irregularity": analysis.irregularity,
                "size": analysis.size,
            }
            for analysis in analyses
        ]

        result.append({
            "id": album.id,
            "title": album.title,
            "date": album.date.isoformat(),
            "analyses": analyses,
            "position_label": album.position_label,
            "position_x": album.position_x,
            "position_y": album.position_y,
            "orientation": album.orientation,
            "last_updated": latest_analysis.date.isoformat() if latest_analysis else None,
            "last_photo": flask.request.host_url.strip("/") + latest_analysis.photo if latest_analysis else None,
        })



    return jsonify({
        "message": "Albums retrieved successfully",
        "data": result
    }), 200

@album_bp.route('/<int:id>/analysis', methods=['PUT'])
@jwt_required()
def add_analysis_to_album(id: int):
    # Get data from request object
    result = request.form.get('result')
    if result is None:
        return jsonify({"error": "No result given in body"}), 400

    # Extract additional parameters
    danger_rate = request.form.get('danger_rate', type=float)
    confidence = request.form.get('confidence', type=float)
    asymmetry = request.form.get('asymmetry', type=float)
    color = request.form.get('color', type=float)
    irregularity = request.form.get('irregularity', type=float)
    size = request.form.get('size', type=float)

    date_str = request.form.get('date')  # Expecting a string like '2025-05-09'

    # Attempt to parse date (if given)
    date = None
    if date_str is not None:
        try:
            date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f")
        except ValueError:
            try:
                date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                return jsonify({"error": "Could not parse given date"}), 404

    # Get files from request object
    if 'image' not in request.files:
        return jsonify({"error": "No file given in body"}), 400
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No file given in body"}), 400

    # Get current user
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Find Album (filtering by id and also current_user_id)
    stmt = select(Album).where(Album.id == id, Album.user_id == current_user_id)
    album = db.session.execute(stmt).scalar_one_or_none()
    if not album:
        return jsonify({"error": "Album not found"}), 404

    # Process image
    try:
        processed = process_image(image)
        if not processed:
            return jsonify({"error": "Image not in correct format"}), 404
    except:
        return jsonify({"error": "Unexpected error formatting given image"}), 500

    # Create directory to save file and generate a file name
    os.makedirs(current_app.config['UPLOAD_PATH'], exist_ok=True)
    original_filename = secure_filename(image.filename)
    base, ext = os.path.splitext(original_filename)
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')
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

    # Create new Analysis
    new_analysis = Analysis(
        photo=save_path,
        result=result,
        album=album,
        date=date,
        danger_rate=danger_rate,
        confidence=confidence,
        asymmetry=asymmetry,
        color=color,
        irregularity=irregularity,
        size=size
    )
    db.session.add(new_analysis)
    db.session.commit()

    return jsonify({
        "message": f"Analysis added with id={new_analysis.id}",
        "analysis_id": new_analysis.id
    }), 200

@album_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_album(id: int):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    album = Album.query.filter_by(id=id, user_id=user.id).first()
    if not album:
        return jsonify({"error": "Album not found"}), 404

    analyses_query = (
        Analysis.query
        .filter_by(album_id=album.id)
        .order_by(Analysis.date.desc())
    )

    latest_analysis = analyses_query.first()

    analyses = [
        {
            "id": analysis.id,
            "photo": flask.request.host_url.strip("/") + analysis.photo,
            "result": analysis.result,
            "date": analysis.date.isoformat(),
            "danger_rate": analysis.danger_rate,
            "confidence": analysis.confidence,
            "asymmetry": analysis.asymmetry,
            "color": analysis.color,
            "irregularity": analysis.irregularity,
            "size": analysis.size,
        }
        for analysis in analyses_query
    ]

    result = {
        "id": album.id,
        "title": album.title,
        "date": album.date.isoformat(),
        "analyses": analyses,
        "position_label": album.position_label,
        "position_x": album.position_x,
        "position_y": album.position_y,
        "orientation": album.orientation,
        "oldest_analysis_date": analyses[len(analyses)-1]["date"] if len(analyses) != 0 else None,
        "newest_analysis_date": latest_analysis.date.isoformat() if latest_analysis else None,
        "newest_analysis_photo": flask.request.host_url.strip("/") + latest_analysis.photo if latest_analysis else None,
    }

    return jsonify({
        "message": "Album retrieved successfully",
        "data": result
    }), 200