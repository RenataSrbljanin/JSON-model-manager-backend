from flask import Flask
from .models import db
from app.routes import bp


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

    with app.app_context():
        db.create_all()  # Auto-creates tables

    return app
