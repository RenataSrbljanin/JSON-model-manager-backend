from app.extensions import db


class Computer(db.Model):
    __tablename__ = "computers"

    idn = db.Column(db.String, primary_key=True)
    data = db.Column(db.JSON, nullable=False)
    installed_software_idns = db.Column(db.JSON, nullable=False)
    network_idn = db.Column(db.JSON, nullable=False)
    provides_hardware_quota = db.Column(db.Float, nullable=False)
    software_data_links = db.Column(db.JSON, nullable=False)
    software_idn_mapping = db.Column(db.JSON, nullable=False)
    stored_credentials = db.Column(db.JSON, nullable=False)
    used_hardware_quota = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "idn": self.idn,
            "data": self.data,
            "installed_software_idns": self.installed_software_idns,
            "network_idn": self.network_idn,
            "provides_hardware_quota": self.provides_hardware_quota,
            "software_data_links": self.software_data_links,
            "software_idn_mapping": self.software_idn_mapping,
            "stored_credentials": self.stored_credentials,
            "used_hardware_quota": self.used_hardware_quota,
        }
