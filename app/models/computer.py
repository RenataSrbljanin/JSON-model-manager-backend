from app.extensions import db


class Computer(db.Model):
    __tablename__ = "computers"

    idn = db.Column(db.String, primary_key=True) # 2
    data = db.Column(db.JSON, nullable=False)  # 1
     #  installedsoftware   # 3
    installed_software_idns = db.Column(db.JSON, nullable=False) # 4
    network_idn = db.Column(db.JSON, nullable=False)  # 5   
    provides_hardware_quota = db.Column(db.Float, nullable=False) # 6
    software_data_links = db.Column(db.JSON, nullable=False) # 7
    software_idn_mapping = db.Column(db.JSON, nullable=False) # 8
    stored_credentials = db.Column(db.JSON, nullable=False) # 9
    used_hardware_quota = db.Column(db.Float, nullable=False) # 10

    def to_dict(self):
        return {
            "idn": self.idn, # 2
            "data": self.data, # 1
            #  installedsoftware   # 3
            "installed_software_idns": self.installed_software_idns, # 4
            "network_idn": self.network_idn, # 5
            "provides_hardware_quota": self.provides_hardware_quota, # 6
            "software_data_links": self.software_data_links, # 7
            "software_idn_mapping": self.software_idn_mapping, # 8
            "stored_credentials": self.stored_credentials,  # 9
            "used_hardware_quota": self.used_hardware_quota, # 10
        }
