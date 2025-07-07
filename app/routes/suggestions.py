# routes/suggestions.py
from flask import Blueprint, jsonify
from app.models.helpers import get_all_computers, get_all_installed_software
from app.models.data_model import DataModel
from app.models.credential import Credential
from app.models.firewall_rule import FirewallRule
from app.models.software_data_link import SoftwareDataLink
from app.extensions import db

suggestions_bp = Blueprint("suggestions", __name__)


@suggestions_bp.route("/api/suggestions", methods=["GET"])
def get_suggestions():
    computers = get_all_computers()
    software = get_all_installed_software()

    def collect_unique(attr, items):
        return sorted(list({v for item in items for v in item.get(attr, []) if v}))

    def collect_unique_scalar(attr, items):
        return sorted(list({item.get(attr) for item in items if item.get(attr)}))

    suggestions = {
        "person_group_ids": collect_unique_scalar("person_group_id", software),
        "compatible_data_types": collect_unique("compatible_data_types", software),
        "accepts_credentials": collect_unique("accepts_credentials", software),
        "stored_credentials": collect_unique("stored_credentials", computers),
        "hardware_ids": collect_unique("hardware_ids", software),
        "network_ids": sorted(
            list(
                set(nid for c in computers for nid in c.get("network_idn", []))
                | set(nid for s in software for nid in s.get("network_idn", []))
            )
        ),
        "software_ids": [s["idn"] for s in software],
        "credential_ids": [c.credential_id for c in Credential.query.all()],
        "data_type_ids": [
            sdl.data_type_id for sdl in db.session.query(SoftwareDataLink).all()
        ],
        "firewall_roles": sorted(
            list({rule.role_type for rule in FirewallRule.query.all()})
        ),
        "data_model_types": sorted(
            list({dm.data_type for dm in DataModel.query.all()})
        ),
        "principal_software_ids": sorted(
            list({dm.principal_software for dm in DataModel.query.all()})
        ),
    }

    return jsonify(suggestions)
