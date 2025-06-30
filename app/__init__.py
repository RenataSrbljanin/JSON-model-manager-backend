from flask import Flask
from .models import db
from app.routes.routes import bp
from app.routes.url_encoder_routes import url_encoder_bp


def create_app():
    app = Flask(__name__)
    # app.register_blueprint(bp)
    # return app

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///app.db"  # Or we can use PostgreSQL/MySQL
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # from .routes import main

    app.register_blueprint(bp)
    app.register_blueprint(url_encoder_bp)

    with app.app_context():
        db.create_all()  # Auto-creates tables

    return app
