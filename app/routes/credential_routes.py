from flask import Blueprint, request, jsonify
from app.models.credential import Credential
from app.schemas.credential_schema import CredentialSchema
from app.extensions import db

credential_bp = Blueprint("credential", __name__, url_prefix="/api/credentials")
schema = CredentialSchema()
many_schema = CredentialSchema(many=True)


@credential_bp.route("/", methods=["GET"])
def get_all():
    all_items = Credential.query.all()
    return jsonify(many_schema.dump(all_items)), 200


@credential_bp.route("/<string:credential_id>", methods=["GET"])
def get_one(credential_id):
    item = Credential.query.get_or_404(credential_id)
    return jsonify(schema.dump(item)), 200


@credential_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = Credential(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201


@credential_bp.route("/<string:credential_id>", methods=["PUT"])
def update(credential_id):
    item = Credential.query.get_or_404(credential_id)
    data = request.get_json()
    validated = schema.load(data)
    for key, value in validated.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(schema.dump(item)), 200


@credential_bp.route("/<string:credential_id>", methods=["DELETE"])
def delete(credential_id):
    item = Credential.query.get_or_404(credential_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
