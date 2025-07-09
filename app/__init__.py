from flask import Flask
from .extensions import db, bcrypt, jwt, cors
from .routes import register_routes
from .config import Config

from app.routes.json_routes import json_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicijalizacija ekstenzija sa aplikacijom
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    # Registracija svih ruta (blueprintova)
    register_routes(app)

    # Kreiram tabele ako ne postoje
    with app.app_context():
        db.create_all()

    return app
