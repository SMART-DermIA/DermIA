from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    albums = db.relationship('Album', backref='user', lazy=True)
    doctor_name  = db.Column(db.String(120), nullable=True)
    doctor_phone = db.Column(db.String(20),  nullable=True)
    doctor_email = db.Column(db.String(120), nullable=True)


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    analyses = db.relationship('Analysis', backref='album', lazy=True)
    x       = db.Column(db.Float,   nullable=False)
    y       = db.Column(db.Float,   nullable=False)
    view    = db.Column(db.String(10), nullable=False)  # 'front' ou 'back'


class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    photo = db.Column(db.String(200), nullable=False)  # chemin vers l'image
    result = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable=False)