# from flask import Blueprint, request, jsonify
# import os
# import json

# upload_bp = Blueprint("upload", __name__)
# UPLOAD_FOLDER = "uploaded_json"

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# @upload_bp.route("/upload-json", methods=["POST"])
# def upload_json():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if not file.filename.endswith(".json"):
#         return jsonify({"error": "Only JSON files allowed"}), 400

#     filepath = os.path.join(UPLOAD_FOLDER, file.filename)
#     file.save(filepath)

#     with open(filepath, "r", encoding="utf-8") as f:
#         try:
#             data = json.load(f)
#         except json.JSONDecodeError:
#             return jsonify({"error": "Invalid JSON file"}), 400

#     # Po želji: podatke čuvamo u sesiji ili memoriji za prikaz
#     return jsonify({"message": "File uploaded and parsed", "data": data}), 200
from flask import Blueprint, request, jsonify
import os
import json

from app.models.computer import Computer
from app.models.installed_software import InstalledSoftware
from app.extensions import db

upload_bp = Blueprint("upload", __name__)
UPLOAD_FOLDER = "uploaded_json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@upload_bp.route("/upload-json", methods=["POST"])
def upload_json():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.endswith(".json"):
        return jsonify({"error": "Only JSON files allowed"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    with open(filepath, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON file"}), 400

    # ✅ Ubacivanje u bazu
    try:
        if "computers" not in data:
            return jsonify({"error": "JSON must contain 'computers' key"}), 400

        for comp_idn, comp_data in data["computers"].items():
            # 1. Computer
            computer = Computer.query.get(comp_idn)
            if not computer:
                computer = Computer(idn=comp_idn)
            computer.data = comp_data.get("data", [])
            computer.network_idn = comp_data.get("network_idn", [])
            computer.provides_hardware_quota = comp_data.get(
                "provides_hardware_quota", 0
            )
            computer.used_hardware_quota = comp_data.get("used_hardware_quota", 0)
            computer.software_idn_mapping = comp_data.get("software_idn_mapping", {})
            computer.software_data_links = comp_data.get("software_data_links", {})
            computer.stored_credentials = comp_data.get("stored_credentials", [])
            computer.installed_software_idns = comp_data.get(
                "installed_software_idns", []
            )

            db.session.add(computer)

            # 2. InstalledSoftware
            installed_software_dict = comp_data.get("installed_software", {})
            for sw_idn, sw_data in installed_software_dict.items():
                software = InstalledSoftware.query.get(sw_idn)
                if not software:
                    software = InstalledSoftware(idn=sw_idn)

                software.computer_idn = comp_idn
                software.idn_variant = sw_data.get("idn_variant", "")
                software.cpe_idn = sw_data.get("cpe_idn", "")
                software.compatible_data_types = sw_data.get(
                    "compatible_data_types", []
                )
                software.accepts_credentials = sw_data.get("accepts_credentials", [])
                software.local_dependencies = sw_data.get("local_dependencies", [])
                software.network_dependencies = sw_data.get("network_dependencies", [])
                software.network_idn = sw_data.get("network_idn", [])
                software.installed_combination = sw_data.get(
                    "installed_combination", []
                )
                software.provides_services = sw_data.get("provides_services", [])
                software.provides_network_services = sw_data.get(
                    "provides_network_services", []
                )
                software.provides_user_services = sw_data.get(
                    "provides_user_services", []
                )
                software.max_client_count = sw_data.get("max_client_count", 0)
                software.requires_hardware_quota = sw_data.get(
                    "requires_hardware_quota", 0.0
                )
                software.requires_hardware_quota_per_client = sw_data.get(
                    "requires_hardware_quota_per_client", 0.0
                )
                software.is_database = bool(sw_data.get("is_database", False))
                software.hardware_ids = sw_data.get("hardware_ids", [])
                software.person_group_id = sw_data.get("person_group_id")
                software.person_index = sw_data.get("person_index", 0)
                software.network_clients = sw_data.get("network_clients", [])
                software.network_servers = sw_data.get("network_servers", [])
                software.stored_credentials = sw_data.get("stored_credentials", [])
                software.software_data_links = sw_data.get("software_data_links", {})
                software.software_idn_mapping = sw_data.get("software_idn_mapping", {})
                software.provides_hardware_quota = sw_data.get(
                    "provides_hardware_quota", 0.0
                )
                software.used_hardware_quota = sw_data.get("used_hardware_quota", 0.0)

                db.session.add(software)

        db.session.commit()
        return jsonify({"message": "Data saved to database"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
