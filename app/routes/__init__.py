from app.routes.installed_software_routes import installed_software_bp
from app.routes.computer_routes import computer_bp
from app.routes.credential_routes import credential_bp
from app.routes.data_routes import data_bp
from app.routes.firewall_rule_routes import firewall_rule_bp
from app.routes.software_data_link_routes import software_data_link_bp
from app.routes.upload_routes import upload_bp
from app.routes.suggestions_routes import suggestions_bp
from app.routes.json_routes import json_bp


def register_routes(app):
    app.register_blueprint(upload_bp)
    app.register_blueprint(installed_software_bp)
    app.register_blueprint(computer_bp)
    app.register_blueprint(credential_bp)
    app.register_blueprint(data_bp)
    app.register_blueprint(firewall_rule_bp)
    app.register_blueprint(software_data_link_bp)
    app.register_blueprint(suggestions_bp)
    app.register_blueprint(json_bp)
