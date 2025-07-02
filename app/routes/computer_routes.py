from flask import Blueprint, request, jsonify
from app.models.computer import Computer
from app.schemas.computer_schema import ComputerSchema
from app.extensions import db

computer_bp = Blueprint("computer", __name__, url_prefix="/api/computers")
schema = ComputerSchema()
many_schema = ComputerSchema(many=True)


@computer_bp.route("/", methods=["GET"])
def get_all():
    all_items = Computer.query.all()
    return jsonify(many_schema.dump(all_items)), 200


@computer_bp.route("/<string:idn>", methods=["GET"])
def get_one(idn):
    item = Computer.query.get_or_404(idn)
    return jsonify(schema.dump(item)), 200


@computer_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = Computer(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201


@computer_bp.route("/<string:idn>", methods=["PUT"])
def update(idn):
    item = Computer.query.get_or_404(idn)
    data = request.get_json()
    validated = schema.load(data)
    for key, value in validated.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(schema.dump(item)), 200


@computer_bp.route("/<string:idn>", methods=["DELETE"])
def delete(idn):
    item = Computer.query.get_or_404(idn)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
