from app.extensions import db


class InstalledSoftware(db.Model):
    __tablename__ = "installed_software"

    idn = db.Column(db.String, primary_key=True)
    idn_variant = db.Column(db.String, nullable=False)
    cpe_idn = db.Column(db.String, nullable=False)
    computer_idn = db.Column(db.String, nullable=False)
    compatible_data_types = db.Column(db.JSON, nullable=False)
    accepts_credentials = db.Column(db.JSON, nullable=False)
    local_dependencies = db.Column(db.JSON, nullable=False)
    network_dependencies = db.Column(db.JSON, nullable=False)
    network_idn = db.Column(db.JSON, nullable=False)
    installed_combination = db.Column(db.JSON, nullable=False)
    provides_services = db.Column(db.JSON, nullable=False)
    provides_network_services = db.Column(db.JSON, nullable=False)
    provides_user_services = db.Column(db.JSON, nullable=False)
    max_client_count = db.Column(db.Integer, nullable=False)
    requires_hardware_quota = db.Column(db.Float, nullable=False)
    requires_hardware_quota_per_client = db.Column(db.Float, nullable=False)
    is_database = db.Column(db.String, nullable=False)
    hardware_ids = db.Column(db.JSON, nullable=False)
    person_group_id = db.Column(db.String, nullable=True)
    person_index = db.Column(db.Integer, nullable=False)
    network_clients = db.Column(db.JSON, nullable=False)
    network_servers = db.Column(db.JSON, nullable=False)
    stored_credentials = db.Column(db.JSON, nullable=False)
    software_data_links = db.Column(db.JSON, nullable=False)
    software_idn_mapping = db.Column(db.JSON, nullable=False)
    provides_hardware_quota = db.Column(db.Float, nullable=False)
    used_hardware_quota = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "idn": self.idn,
            "idn_variant": self.idn_variant,
            "cpe_idn": self.cpe_idn,
            "computer_idn": self.computer_idn,
            "compatible_data_types": self.compatible_data_types,
            "accepts_credentials": self.accepts_credentials,
            "local_dependencies": self.local_dependencies,
            "network_dependencies": self.network_dependencies,
            "network_idn": self.network_idn,
            "installed_combination": self.installed_combination,
            "provides_services": self.provides_services,
            "provides_network_services": self.provides_network_services,
            "provides_user_services": self.provides_user_services,
            "max_client_count": self.max_client_count,
            "requires_hardware_quota": self.requires_hardware_quota,
            "requires_hardware_quota_per_client": self.requires_hardware_quota_per_client,
            "is_database": self.is_database,
            "hardware_ids": self.hardware_ids,
            "person_group_id": self.person_group_id,
            "person_index": self.person_index,
            "network_clients": self.network_clients,
            "network_servers": self.network_servers,
            "stored_credentials": self.stored_credentials,
            "software_data_links": self.software_data_links,
            "software_idn_mapping": self.software_idn_mapping,
            "provides_hardware_quota": self.provides_hardware_quota,
            "used_hardware_quota": self.used_hardware_quota,
        }
