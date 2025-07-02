from marshmallow import Schema, fields


class DataModelSchema(Schema):
    idn = fields.Str(required=True)
    data_definition_idn = fields.Str(required=True)
    data_type = fields.Str(required=True)
    database_stored = fields.Raw(required=True)
    linked_software = fields.List(fields.Str(), required=True)
    network_idn = fields.List(fields.Int(), required=True)
    person_groups = fields.List(fields.Str(), required=True)
    person_indexes = fields.List(fields.Int(), required=True)
    principal_software = fields.Str(required=True)
    protection_level = fields.Int(required=True)
    services = fields.List(fields.Str(), required=True)
