from app.extensions import db


class Credential(db.Model):
    __tablename__ = "credentials"

    credential_id = db.Column(db.String, primary_key=True)
    role_type = db.Column(db.String, nullable=False)
    softwareIDN = db.Column(db.String, nullable=False)
    user = db.Column(db.String, nullable=False)
