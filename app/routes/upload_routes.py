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
            computer.data = comp_data.get("data", [])  # 1
            # idn # 2
            # installedsoftware   # 3
            computer.installed_software_idns = comp_data.get( # 4
                "installed_software_idns", []
            )
            computer.network_idn = comp_data.get("network_idn", []) # 5
            computer.provides_hardware_quota = comp_data.get(  # 6
                "provides_hardware_quota", 0
            )
            computer.software_data_links = comp_data.get("software_data_links", {}) # 7
            computer.software_idn_mapping = comp_data.get("software_idn_mapping", {}) # 8
            computer.stored_credentials = comp_data.get("stored_credentials", [])  # 9
            computer.used_hardware_quota = comp_data.get("used_hardware_quota", 0) # 10

            db.session.add(computer)

            # 2. InstalledSoftware
            installed_software_dict = comp_data.get("installed_software", {})
            for sw_idn, sw_data in installed_software_dict.items():
                software = InstalledSoftware.query.get(sw_idn)
                if not software:
                    software = InstalledSoftware(idn=sw_idn)

                software.accepts_credentials = sw_data.get("accepts_credentials", []) # 1
                software.compatible_data_types = sw_data.get("compatible_data_types", [])# 2
                software.computer_idn = comp_idn  # 3
                software.cpe_idn = sw_data.get("cpe_idn", "") # 4
                software.hardware_ids = sw_data.get("hardware_ids", []) # 5

                software.idn_variant = sw_data.get("idn_variant", "") # 7
                software.installed_combination = sw_data.get(  # 8
                    "installed_combination", []
                )
                software.is_database = bool(sw_data.get("is_database", False)) # 9
                software.local_dependencies = sw_data.get("local_dependencies", []) # 10
                software.max_client_count = sw_data.get("max_client_count", 0) # 11
                software.network_clients = sw_data.get("network_clients", []) # 12
                software.network_dependencies = sw_data.get("network_dependencies", []) # 13
                software.network_idn = sw_data.get("network_idn", [])  # 14
                software.network_servers = sw_data.get("network_servers", []) # 15
                software.person_group_id = sw_data.get("person_group_id")  # 16
                software.person_index = sw_data.get("person_index", 0)  # 17
                software.provides_network_services = sw_data.get(   # 18
                    "provides_network_services", []
                )
                software.provides_services = sw_data.get("provides_services", []) # 19
                software.provides_user_services = sw_data.get(   # 20
                    "provides_user_services", []
                )
                software.requires_hardware_quota = sw_data.get(  # 21
                    "requires_hardware_quota", 0.0
                )
                software.requires_hardware_quota_per_client = sw_data.get( # 22
                    "requires_hardware_quota_per_client", 0.0
                )

                software.provides_hardware_quota = sw_data.get( # computer # 6
                    "provides_hardware_quota", 0.0
                )
                software.software_data_links = sw_data.get("software_data_links", {}) # computer # 7
                software.software_idn_mapping = sw_data.get("software_idn_mapping", {}) # computer # 8
                software.stored_credentials = sw_data.get("stored_credentials", []) # computer # 9
                software.used_hardware_quota = sw_data.get("used_hardware_quota", 0.0) # computer # 10

                db.session.add(software)

        db.session.commit()
        return jsonify({"message": "Data saved to database"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
