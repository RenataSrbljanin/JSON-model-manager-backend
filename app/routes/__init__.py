from .installed_software_routes import installed_software_bp
from .computer_routes import computer_bp
from .credential_routes import credential_bp
from .data_model_routes import data_model_bp
from .firewall_rule_routes import firewall_rule_bp
from .software_data_link_routes import software_data_link_bp
from .upload_routes import upload_bp
from .suggestions import suggestions_bp


def register_routes(app):
    app.register_blueprint(upload_bp)
    app.register_blueprint(installed_software_bp)
    app.register_blueprint(computer_bp)
    app.register_blueprint(credential_bp)
    app.register_blueprint(data_model_bp)
    app.register_blueprint(firewall_rule_bp)
    app.register_blueprint(software_data_link_bp)
    app.register_blueprint(suggestions_bp)
