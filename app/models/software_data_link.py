from app.extensions import db


class SoftwareDataLink(db.Model):
    __tablename__ = "software_data_links"

    software_idn = db.Column(db.String, primary_key=True)
    data_type_id = db.Column(db.String, primary_key=True)
