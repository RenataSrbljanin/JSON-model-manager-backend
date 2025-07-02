from marshmallow import Schema, fields


class ComputerSchema(Schema):
    idn = fields.Str(required=True)
    data = fields.List(fields.Str(), required=True)
    installed_software_idns = fields.List(fields.Str(), required=True)
    stored_credentials = fields.List(fields.Str(), required=True)
    software_data_links = fields.Dict(
        keys=fields.Str(), values=fields.List(fields.Str()), required=True
    )
    software_idn_mapping = fields.Dict(
        keys=fields.Str(), values=fields.Str(), required=True
    )
    network_idn = fields.List(fields.Int(), required=True)
    provides_hardware_quota = fields.Float(required=True)
    used_hardware_quota = fields.Float(required=True)
