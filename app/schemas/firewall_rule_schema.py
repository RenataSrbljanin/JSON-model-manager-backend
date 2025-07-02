from marshmallow import Schema, fields


class FirewallRuleSchema(Schema):
    idn = fields.Str(required=True)
    allow = fields.Boolean(required=True)
    from_objects = fields.List(fields.Str(), required=True)
    to_objects = fields.List(fields.Str(), required=True)
