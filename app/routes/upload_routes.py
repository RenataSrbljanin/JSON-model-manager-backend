from flask import Blueprint, request, jsonify
import os
import json

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

    # Po želji: podatke čuvamo u sesiji ili memoriji za prikaz
    return jsonify({"message": "File uploaded and parsed", "data": data}), 200
