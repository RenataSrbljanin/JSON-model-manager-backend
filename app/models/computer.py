from app.extensions import db


class Computer(db.Model):
    __tablename__ = "computers"

    idn = db.Column(db.String, primary_key=True)
    data = db.Column(db.JSON, nullable=False)
    installed_software_idns = db.Column(db.JSON, nullable=False)
    stored_credentials = db.Column(db.JSON, nullable=False)
    software_data_links = db.Column(db.JSON, nullable=False)
    software_idn_mapping = db.Column(db.JSON, nullable=False)
    network_idn = db.Column(db.JSON, nullable=False)
    provides_hardware_quota = db.Column(db.Float, nullable=False)
    used_hardware_quota = db.Column(db.Float, nullable=False)
