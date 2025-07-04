# from flask import Flask
# from .models import db
# from app.routes.routes import bp
# from app.routes.url_encoder_routes import url_encoder_bp


# def create_app():
#     app = Flask(__name__)
#     # app.register_blueprint(bp)
#     # return app

#     app.config["SQLALCHEMY_DATABASE_URI"] = (
#         "sqlite:///app.db"  # Or we can use PostgreSQL/MySQL
#     )
#     app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#     db.init_app(app)

#     # from .routes import main

#     app.register_blueprint(bp)
#     app.register_blueprint(url_encoder_bp)

#     with app.app_context():
#         db.create_all()  # Auto-creates tables

#     return app

from flask import Flask
from .extensions import db, bcrypt, jwt, cors
from .routes import register_routes
from .config import Config

from app.models.computer import Computer
from app.models.installed_software import InstalledSoftware
from app.models.software_data_link import SoftwareDataLink


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
