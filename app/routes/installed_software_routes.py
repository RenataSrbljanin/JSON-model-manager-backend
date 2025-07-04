from flask import Blueprint, request, jsonify
from app.models.installed_software import InstalledSoftware
from app.schemas.installed_software_schema import InstalledSoftwareSchema
from app.extensions import db

installed_software_bp = Blueprint(
    "installed_software", __name__, url_prefix="/api/installed-software"
)
schema = InstalledSoftwareSchema()
many_schema = InstalledSoftwareSchema(many=True)


@installed_software_bp.route("/", methods=["GET"])
def get_all():
    all_items = InstalledSoftware.query.all()
    return jsonify(many_schema.dump(all_items)), 200


@installed_software_bp.route("/<string:idn>", methods=["GET"])
def get_one(idn):
    item = InstalledSoftware.query.get_or_404(idn)
    return jsonify(schema.dump(item)), 200


@installed_software_bp.route("/computer/<string:computer_idn>", methods=["GET"])
def get_installed_software_by_computer(computer_idn):
    items = InstalledSoftware.query.filter_by(computer_idn=computer_idn).all()
    return jsonify(many_schema.dump(items)), 200


@installed_software_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = InstalledSoftware(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201


@installed_software_bp.route("/<string:idn>", methods=["PUT"])
def update(idn):
    item = InstalledSoftware.query.get_or_404(idn)
    data = request.get_json()
    validated = schema.load(data)
    for key, value in validated.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(schema.dump(item)), 200


@installed_software_bp.route("/<string:idn>", methods=["DELETE"])
def delete(idn):
    item = InstalledSoftware.query.get_or_404(idn)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
