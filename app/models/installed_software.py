# from typing import List, Optional, Tuple
# import uuid
# import json

# from . import db


# class InstalledSoftwareModel(db.Model):
#     __tablename__ = "installed_software"

#     id = db.Column(db.Integer, primary_key=True)
#     idn = db.Column(db.String, unique=True, nullable=False)
#     computer_idn = db.Column(db.String, nullable=False)
#     cpe_idn = db.Column(db.String, nullable=False)
#     idn_variant = db.Column(db.String)
#     accepts_credentials = db.Column(db.PickleType)
#     compatible_data_types = db.Column(db.PickleType)
#     hardware_ids = db.Column(db.PickleType)
#     installed_combination = db.Column(db.PickleType)
#     is_database = db.Column(db.String)
#     local_dependencies = db.Column(db.PickleType)
#     network_dependencies = db.Column(db.PickleType)
#     network_clients = db.Column(db.PickleType)
#     network_servers = db.Column(db.PickleType)
#     network_idn = db.Column(db.PickleType)
#     provides_network_services = db.Column(db.PickleType)
#     provides_services = db.Column(db.PickleType)
#     provides_user_services = db.Column(db.PickleType)
#     max_client_count = db.Column(db.Integer)
#     person_index = db.Column(db.Integer)
#     person_group_id = db.Column(db.String)
#     requires_hardware_quota = db.Column(db.Float)
#     requires_hardware_quota_per_client = db.Column(db.Float)


# class InstalledSoftware:
#     def __init__(
#         self,
#         idn: str,
#         computer_idn: str,
#         cpe_idn: str,
#         idn_variant: str,
#         accepts_credentials: List[str],
#         compatible_data_types: List[str],
#         hardware_ids: List[str],
#         installed_combination: List[Tuple[str, str]],
#         is_database: str,
#         local_dependencies: List[str],
#         network_dependencies: List[str],
#         network_clients: List[str],
#         network_servers: List[str],
#         network_idn: List[int],
#         provides_network_services: List[str],
#         provides_services: List[str],
#         provides_user_services: List[str],
#         max_client_count: int,
#         person_index: int,
#         person_group_id: Optional[str],
#         requires_hardware_quota: float,
#         requires_hardware_quota_per_client: float,
#     ):
#         self.idn = idn
#         self.computer_idn = computer_idn
#         self.cpe_idn = cpe_idn
#         self.idn_variant = idn_variant
#         self.accepts_credentials = accepts_credentials
#         self.compatible_data_types = compatible_data_types
#         self.hardware_ids = hardware_ids
#         self.installed_combination = installed_combination
#         self.is_database = is_database
#         self.local_dependencies = local_dependencies
#         self.network_dependencies = network_dependencies
#         self.network_clients = network_clients
#         self.network_servers = network_servers
#         self.network_idn = network_idn
#         self.provides_network_services = provides_network_services
#         self.provides_services = provides_services
#         self.provides_user_services = provides_user_services
#         self.max_client_count = max_client_count
#         self.person_index = person_index
#         self.person_group_id = person_group_id
#         self.requires_hardware_quota = requires_hardware_quota
#         self.requires_hardware_quota_per_client = requires_hardware_quota_per_client

#     def to_dict(self):
#         return self.__dict__

#     def __repr__(self):
#         return json.dumps(self.to_dict(), indent=2)


# # === Helper Functions ===


# def generate_uuid() -> str:
#     return str(uuid.uuid4())


# def generate_idn(
#     computer_idn: str, cpe_idn: str, static_uuid: Optional[str] = None
# ) -> str:
#     return f"{computer_idn}>{cpe_idn}#{static_uuid or generate_uuid()}"


# def generate_idn_variant(cpe_idn: str, version_id: int = 1) -> str:
#     return f"{cpe_idn}#{version_id}"


# def generate_credential_idn(
#     username: str, idn: str, scope: str = "local", cred_uuid: Optional[str] = None
# ) -> str:
#     return f"{username}.{idn}@{scope}#{cred_uuid or generate_uuid()}"


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
