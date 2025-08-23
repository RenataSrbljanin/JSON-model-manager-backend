from marshmallow import Schema, fields


class CredentialSchema(Schema):   

    has_root = fields.Bool(required=True) # 1
    idn = fields.Str(required=True) # 2
    linked_employees = fields.List(fields.List(fields.Raw()), required=True)
    linked_software = fields.List(fields.Str(), required=True)
    stored_at = fields.Str(required=True)
    
    # role_type = fields.Str(required=True)
    # softwareIDN = fields.Str(required=True)
    # user = fields.Str(required=True)

