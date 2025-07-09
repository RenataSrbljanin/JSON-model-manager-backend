# app/routes/suggestions_routes.py
from flask import Blueprint, jsonify
from app.models.credential import Credential
from app.models.installed_software import InstalledSoftware
from app.models.computer import Computer
from app.models.data_model import DataModel
from app.models.firewall_rule import FirewallRule
from app.models.software_data_link import SoftwareDataLink

suggestions_bp = Blueprint("suggestions", __name__, url_prefix="/api/suggestions")


@suggestions_bp.route("/", methods=["GET"])
def get_suggestions():
    try:
        # InstalledSoftware
        installed = InstalledSoftware.query.all()
        hardware_ids = sorted(
            {hw_id for sw in installed for hw_id in (sw.hardware_ids or [])}
        )
        person_group_ids = sorted(
            {sw.person_group_id for sw in installed if sw.person_group_id}
        )
        credential_ids_from_sw = sorted(
            {cred for sw in installed for cred in (sw.accepts_credentials or [])}
        )
        data_types = sorted(
            {dt for sw in installed for dt in (sw.compatible_data_types or [])}
        )
        network_idns_from_sw = {
            nid for sw in installed for nid in (sw.network_idn or [])
        }

        # Computer
        computers = Computer.query.all()
        network_idns_from_computers = {
            nid for comp in computers for nid in (comp.network_idn or [])
        }
        stored_credentials = sorted(
            {cred for comp in computers for cred in (comp.stored_credentials or [])}
        )

        # Credential
        credential_ids = [c.credential_id for c in Credential.query.all()]

        # SoftwareDataLinks
        data_type_ids = [sdl.data_type_id for sdl in SoftwareDataLink.query.all()]

        # FirewallRule
        firewall_roles = sorted({rule.role_type for rule in FirewallRule.query.all()})

        # DataModel
        principal_software_ids = sorted(
            {dm.principal_software for dm in DataModel.query.all()}
        )
        data_model_types = sorted({dm.data_type for dm in DataModel.query.all()})

        # Combine all suggestions
        return (
            jsonify(
                {
                    "hardware_ids": hardware_ids,
                    "person_group_ids": person_group_ids,
                    "credential_ids": credential_ids,
                    "accepts_credentials": credential_ids_from_sw,
                    "stored_credentials": stored_credentials,
                    "compatible_data_types": data_types,
                    "network_idns": sorted(
                        network_idns_from_sw | network_idns_from_computers
                    ),
                    "data_type_ids": data_type_ids,
                    "firewall_roles": firewall_roles,
                    "principal_software_ids": principal_software_ids,
                    "data_model_types": data_model_types,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
