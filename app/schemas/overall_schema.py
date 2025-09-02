from marshmallow import Schema, fields

class OverallSchema(Schema):

    computers = fields.List(fields.Str(), required=True)  # 1
    created = fields.List(fields.Str(), required=True)  # 2
    credentials = fields.Str(required=True)  # 3
    data = fields.Str(required=True)  # 4
    duration = fields.List(fields.Str(), required=True)  # 5
    firewall_rules = fields.Str(required=True)  # 6
    network_segments = fields.List(  # 7
        fields.Tuple((fields.Str(), fields.Str())), required=True
    )  # 7
    total_employee_count = fields.Int(required=True)  #  8
    version = fields.Str(required=True)  # 9
  

    # local_dependencies = fields.List(fields.Str(), required=True)  # 10
    # max_client_count = fields.Int(required=True)  # 11
    # network_clients = fields.List(fields.Str(), required=True)  # 12
    # network_dependencies = fields.List(fields.Str(), required=True)  # 13
    # network_idn = fields.List(fields.Int(), required=True)  # 14
    # network_servers = fields.List(fields.Str(), required=True)  # 15
    # person_group_id = fields.Str(allow_none=True)  # 16
    # person_index = fields.Int(required=True)  # 17
    # provides_network_services = fields.List(fields.Str(), required=True)  # 18
    # provides_services = fields.List(fields.Str(), required=True)  # 19
    # provides_user_services = fields.List(fields.Str(), required=True)  # 20
    # requires_hardware_quota = fields.Float(required=True)  # 21
    # requires_hardware_quota_per_client = fields.Float(required=True)  # 22
