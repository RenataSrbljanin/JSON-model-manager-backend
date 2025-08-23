from app.extensions import db

class InstalledSoftware(db.Model):
    __tablename__ = "installed_software"
    accepts_credentials = db.Column(db.JSON, nullable=False) # 1
    compatible_data_types = db.Column(db.JSON, nullable=False)  # 2
    computer_idn = db.Column(db.String, nullable=False) # 3
    cpe_idn = db.Column(db.String, nullable=False)  # 4
    hardware_ids = db.Column(db.JSON, nullable=False)  # 5
    idn = db.Column(db.String, primary_key=True)  # 6
    idn_variant = db.Column(db.String, nullable=False)  # 7
    installed_combination = db.Column(db.JSON, nullable=False)  # 8
    is_database = db.Column(db.String, nullable=False)  # 9
    local_dependencies = db.Column(db.JSON, nullable=False)  # 10
    max_client_count = db.Column(db.Integer, nullable=False)  # 11
    network_clients = db.Column(db.JSON, nullable=False)  # 12
    network_dependencies = db.Column(db.JSON, nullable=False)  # 13
    network_idn = db.Column(db.JSON, nullable=False)  # 14
    network_servers = db.Column(db.JSON, nullable=False)  # 15
    person_group_id = db.Column(db.String, nullable=True)  # 16
    person_index = db.Column(db.Integer, nullable=False)  # 17
    provides_network_services = db.Column(db.JSON, nullable=False) # 18
    provides_services = db.Column(db.JSON, nullable=False)  # 19
    provides_user_services = db.Column(db.JSON, nullable=False)  # 20
    requires_hardware_quota = db.Column(db.Float, nullable=False) # 21
    requires_hardware_quota_per_client = db.Column(db.Float, nullable=False) # 22

    # provides_hardware_quota = db.Column(db.Float, nullable=False) # computer # 6
    # software_data_links = db.Column(db.JSON, nullable=False) # computer # 7
    # software_idn_mapping = db.Column(db.JSON, nullable=False) # computer # 8
    # stored_credentials = db.Column(db.JSON, nullable=False) # computer # 9
    # used_hardware_quota = db.Column(db.Float, nullable=False) # computer # 10

    def to_dict(self):
        return {
            "accepts_credentials": self.accepts_credentials,  # 1
            "compatible_data_types": self.compatible_data_types,  # 2
            "computer_idn": self.computer_idn,  # 3
            "cpe_idn": self.cpe_idn,  # 4
            "hardware_ids": self.hardware_ids,  # 5
            "idn": self.idn,  # 6
            "idn_variant": self.idn_variant,  # 7
            "installed_combination": self.installed_combination,  # 8
            "is_database": self.is_database,  # 9
            "local_dependencies": self.local_dependencies,  # 10
            "max_client_count": self.max_client_count,  # 11
            "network_clients": self.network_clients,  # 12
            "network_dependencies": self.network_dependencies,  # 13
            "network_idn": self.network_idn,  # 14
            "network_servers": self.network_servers,  # 15
            "person_group_id": self.person_group_id,  # 16
            "person_index": self.person_index,  # 17
            "provides_network_services": self.provides_network_services,  # 18
            "provides_services": self.provides_services,  # 19
            "provides_user_services": self.provides_user_services,  # 20
            "requires_hardware_quota": self.requires_hardware_quota,  # 21
            "requires_hardware_quota_per_client": self.requires_hardware_quota_per_client,  # 22


            # "stored_credentials": self.stored_credentials,  # computer # 6
            # "software_data_links": self.software_data_links,  # computer # 7
            # "software_idn_mapping": self.software_idn_mapping,  # computer # 8
            # "provides_hardware_quota": self.provides_hardware_quota, # computer # 9
            # "used_hardware_quota": self.used_hardware_quota,  # computer # 10
        }
