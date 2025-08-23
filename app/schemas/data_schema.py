from marshmallow import Schema, fields


class DataSchema(Schema):
    data_definition_idn = fields.Str(required=True)  # 1
    data_type = fields.Str(required=True)  # 2
    database_stored = fields.Raw(required=True)  # 3

    idn = fields.Str(required=True)  # 4

    linked_software = fields.List(fields.Str(), required=True)  # 5
    network_idn = fields.List(fields.Int(), required=True)  # 6
    person_groups = fields.List(fields.Str(), required=True)  # 7
    person_indexes = fields.List(fields.Int(), required=True)  # 8
    principal_software = fields.Str(required=True)  # 9
    protection_level = fields.Int(required=True)  # 10
    services = fields.List(fields.Str(), required=True)  # 11
