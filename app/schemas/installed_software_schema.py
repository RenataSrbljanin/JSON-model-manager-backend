from marshmallow import Schema, fields

class InstalledSoftwareSchema(Schema):

    accepts_credentials = fields.List(fields.Str(), required=True)  # 1
    compatible_data_types = fields.List(fields.Str(), required=True)  # 2
    computer_idn = fields.Str(required=True)  # 3
    cpe_idn = fields.Str(required=True)  # 4
    hardware_ids = fields.List(fields.Str(), required=True)  # 5
    idn = fields.Str(required=True)  # 6
    idn_variant = fields.Str(required=True)  # 7
    installed_combination = fields.List(  # 8
        fields.Tuple((fields.Str(), fields.Str())), required=True
    )
    is_database = fields.Raw(required=True)  # 9
    local_dependencies = fields.List(fields.Str(), required=True)  # 10
    max_client_count = fields.Int(required=True)  # 11
    network_clients = fields.List(fields.Str(), required=True)  # 12
    network_dependencies = fields.List(fields.Str(), required=True)  # 13
    network_idn = fields.List(fields.Int(), required=True)  # 14
    network_servers = fields.List(fields.Str(), required=True)  # 15
    person_group_id = fields.Str(allow_none=True)  # 16
    person_index = fields.Int(required=True)  # 17
    provides_network_services = fields.List(fields.Str(), required=True)  # 18
    provides_services = fields.List(fields.Str(), required=True)  # 19
    provides_user_services = fields.List(fields.Str(), required=True)  # 20
    requires_hardware_quota = fields.Float(required=True)  # 21
    requires_hardware_quota_per_client = fields.Float(required=True)  # 22

class SoftwareSchema(Schema):
    idn = fields.String(required=True)
    # Dodajte ostala polja koja se nalaze u JSON-u za softver
    cpe_idn = fields.String()
    computer_idn = fields.String()