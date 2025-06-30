from marshmallow import Schema, fields


class InstalledSoftwareSchema(Schema):
    idn = fields.Str(required=True)
    computer_idn = fields.Str(required=True)
    cpe_idn = fields.Str(required=True)
    idn_variant = fields.Str(required=True)

    accepts_credentials = fields.List(fields.Str(), required=True)
    compatible_data_types = fields.List(fields.Str(), required=True)
    hardware_ids = fields.List(fields.Str(), required=True)

    installed_combination = fields.List(
        fields.List(fields.Str(), validate=lambda x: len(x) == 2), required=True
    )

    is_database = fields.Str(required=True)
    local_dependencies = fields.List(fields.Str(), required=True)
    network_dependencies = fields.List(fields.Str(), required=True)
    network_clients = fields.List(fields.Str(), required=True)
    network_servers = fields.List(fields.Str(), required=True)
    network_idn = fields.List(fields.Int(), required=True)

    provides_network_services = fields.List(fields.Str(), required=True)
    provides_services = fields.List(fields.Str(), required=True)
    provides_user_services = fields.List(fields.Str(), required=True)

    max_client_count = fields.Int(required=True)
    person_index = fields.Int(required=True)
    person_group_id = fields.Str(allow_none=True)

    requires_hardware_quota = fields.Float(required=True)
    requires_hardware_quota_per_client = fields.Float(required=True)
