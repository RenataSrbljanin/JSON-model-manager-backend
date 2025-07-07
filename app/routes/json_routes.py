from flask import request, jsonify
import os
import json
from datetime import datetime
from flask import Blueprint
from app.models.computer import Computer

json_bp = Blueprint("json_routes", __name__)

SAVE_DIR = "json_files/exports"
os.makedirs(SAVE_DIR, exist_ok=True)


@json_bp.route("/save", methods=["POST"])
def save_modified_json():
    """
    Prima izmenjene podatke sa frontenda i snima ih kao novi JSON fajl.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"modified_output_{timestamp}.json"
        filepath = os.path.join(SAVE_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return jsonify({"message": "File saved", "filename": filename}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@json_bp.route("/export", methods=["GET"])
def export_current_data():
    try:
        # Ovde ide konverzija iz baze u JSON format, npr.:
        computers = Computer.query.all()
        result = {}
        for comp in computers:
            result[comp.idn] = comp.to_dict()  # pretpostavljamo da postoji to_dict()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
