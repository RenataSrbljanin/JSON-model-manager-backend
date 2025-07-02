from marshmallow import Schema, fields


class SoftwareDataLinkSchema(Schema):
    software_idn = fields.Str(required=True)
    data_type_id = fields.Str(required=True)
