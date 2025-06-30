# from flask import Blueprint, request, jsonify
# from pydantic import ValidationError
# from app.models.installed_software import InstalledSoftware
# from app.schemas.installed_software_schema import InstalledSoftwareSchema

# bp = Blueprint("routes", __name__)

# @bp.route("/installed_software", methods=["POST"])
# def create_installed_software():
#     try:
#         # Validate input with InstalledSoftwareSchema
#         data = request.get_json()
#         validated = InstalledSoftwareSchema(**data)

#         # You can now create an InstalledSoftware instance
#         software = InstalledSoftware(**validated.dict())

#         # Return the software object as JSON
#         return jsonify(software.to_dict()), 201

#     except ValidationError as ve:
#         return jsonify({"error": ve.errors()}), 400

# app/routes.py


# from flask import Blueprint, jsonify, request
# from app.schemas.installed_software_schema import InstalledSoftwareSchema

# bp = Blueprint("main", __name__)


# @bp.route("/validate_software", methods=["POST"])
# def validate_software():
#     data = request.json
#     schema = InstalledSoftwareSchema()
#     result = schema.load(data)
#     return jsonify(result), 200


from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.models.installed_software import InstalledSoftware, InstalledSoftwareModel, db
from app.schemas.installed_software_schema import InstalledSoftwareSchema

bp = Blueprint("routes", __name__)
schema = InstalledSoftwareSchema()


@bp.route("/")
def home():
    return "Hello from the Blueprint!"


@bp.route("/validate_software", methods=["POST"])
def validate_software():
    try:
        data = request.get_json()
        result = schema.load(data)
        return jsonify(result), 200
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400


@bp.route("/installed_software", methods=["POST"])
def create_installed_software():
    try:
        data = request.get_json()
        validated = schema.load(data)
        # With no database
        # software = InstalledSoftware(**validated)
        # return jsonify(software.to_dict()), 201

        # with database
        software = InstalledSoftwareModel(**validated)
        db.session.add(software)
        db.session.commit()
        return jsonify({"message": "Saved to DB!"}), 201
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400


@bp.route("/installed_software", methods=["GET"])
def get_all_software():
    software_list = InstalledSoftwareModel.query.all()
    return jsonify([s.idn for s in software_list])  # or schema.dump(s, many=True)


@bp.route("/installed_software/<path:idn>", methods=["PUT"])
def update_installed_software(idn):
    try:
        data = request.get_json()
        validated = schema.load(data)

        software = InstalledSoftwareModel.query.filter_by(idn=idn).first()
        if not software:
            return jsonify({"error": "Software not found"}), 404

        for key, value in validated.items():
            setattr(software, key, value)

        db.session.commit()
        return jsonify({"message": "Software updated!"}), 200

    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400


@bp.route("/installed_software/<path:idn>", methods=["DELETE"])
def delete_installed_software(idn):
    software = InstalledSoftwareModel.query.filter_by(idn=idn).first()
    if not software:
        return jsonify({"error": "Software not found"}), 404

    db.session.delete(software)
    db.session.commit()
    return jsonify({"message": "Software deleted"}), 200
