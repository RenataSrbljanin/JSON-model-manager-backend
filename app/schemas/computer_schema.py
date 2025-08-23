from marshmallow import Schema, fields

class ComputerSchema(Schema):
    idn = fields.Str(required=True)  # 2
    data = fields.List(fields.Str(), required=True)  # 1
    #  installedsoftware   # 3
    installed_software_idns = fields.List(fields.Str(), required=True)  # 4
    network_idn = fields.List(fields.Int(), required=True)  # 5
    provides_hardware_quota = fields.Float(required=True)  # 6
    software_data_links = fields.Dict(  # 7
        keys=fields.Str(), values=fields.List(fields.Str()), required=True
    )
    software_idn_mapping = fields.Dict(  # 8
        keys=fields.Str(), values=fields.Str(), required=True
    )
    stored_credentials = fields.List(fields.Str(), required=True)  # 9
    used_hardware_quota = fields.Float(required=True)  # 10

from .installed_software_schema import SoftwareSchema

class Predlozeni_ComputerSchema(Schema):
    idn = fields.String(required=True)
    provides_hardware_quota = fields.Integer()
    used_hardware_quota = fields.Integer()
    # Prikazuje se samo 'idn' iz softverske šeme
    installed_software_idns = fields.Pluck(
        'SoftwareSchema',
        'idn',
        many=True,
        dump_only=True
    )
    # Prikazuje kompletan objekat 'installed_software'
    installed_software = fields.Nested('SoftwareSchema', many=True)
    
    # Dodajte ostala polja koja su originalno bila u JSON-u
    data = fields.List(fields.String())