from flask import Blueprint, request, jsonify
from app.models.software_data_link import SoftwareDataLink
from app.schemas.software_data_link_schema import SoftwareDataLinkSchema
from app.extensions import db

software_data_link_bp = Blueprint(
    "software_data_link_bp", __name__, url_prefix="/software-data-links"
)
schema = SoftwareDataLinkSchema()


@software_data_link_bp.route("/", methods=["GET"])
def get_all_software_data_links():
    links = SoftwareDataLink.query.all()
    return jsonify(schema.dump(links, many=True))


@software_data_link_bp.route(
    "/<string:software_idn>/<string:data_type_id>", methods=["GET"]
)
def get_software_data_link(software_idn, data_type_id):
    link = SoftwareDataLink.query.get_or_404((software_idn, data_type_id))
    return jsonify(schema.dump(link))


@software_data_link_bp.route("/", methods=["POST"])
def create_software_data_link():
    data = request.get_json()
    errors = schema.validate(data)
    if errors:
        return jsonify(errors), 400
    new_link = SoftwareDataLink(**data)
    db.session.add(new_link)
    db.session.commit()
    return jsonify(schema.dump(new_link)), 201


@software_data_link_bp.route(
    "/<string:software_idn>/<string:data_type_id>", methods=["PUT"]
)
def update_software_data_link(software_idn, data_type_id):
    link = SoftwareDataLink.query.get_or_404((software_idn, data_type_id))
    data = request.get_json()
    errors = schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    for key, value in data.items():
        setattr(link, key, value)
    db.session.commit()
    return jsonify(schema.dump(link))


@software_data_link_bp.route(
    "/<string:software_idn>/<string:data_type_id>", methods=["DELETE"]
)
def delete_software_data_link(software_idn, data_type_id):
    link = SoftwareDataLink.query.get_or_404((software_idn, data_type_id))
    db.session.delete(link)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204
