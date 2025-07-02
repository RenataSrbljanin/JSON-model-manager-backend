from app.extensions import db


class DataModel(db.Model):
    __tablename__ = "data_models"

    idn = db.Column(db.String, primary_key=True)
    data_definition_idn = db.Column(db.String, nullable=False)
    data_type = db.Column(db.String, nullable=False)
    database_stored = db.Column(db.String, nullable=False)
    linked_software = db.Column(db.JSON, nullable=False)
    network_idn = db.Column(db.JSON, nullable=False)
    person_groups = db.Column(db.JSON, nullable=False)
    person_indexes = db.Column(db.JSON, nullable=False)
    principal_software = db.Column(db.String, nullable=False)
    protection_level = db.Column(db.Integer, nullable=False)
    services = db.Column(db.JSON, nullable=False)
