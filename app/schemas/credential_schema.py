from marshmallow import Schema, fields


class CredentialSchema(Schema):
    credential_id = fields.Str(required=True)
    role_type = fields.Str(required=True)
    softwareIDN = fields.Str(required=True)
    user = fields.Str(required=True)
