from flask import Blueprint, request, jsonify
from app.models.data import Data
from app.schemas.data_schema import DataSchema
from app.extensions import db

data_bp = Blueprint("data", __name__, url_prefix="/api/data")
schema = DataSchema()
many_schema = DataSchema(many=True)


@data_bp.route("/", methods=["GET"])
def get_all():
    all_items = Data.query.all()
    return jsonify(many_schema.dump(all_items)), 200


@data_bp.route("/<string:idn>", methods=["GET"])
def get_one(idn):
    item = Data.query.get_or_404(idn)
    return jsonify(schema.dump(item)), 200


@data_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = Data(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201


@data_bp.route("/<string:idn>", methods=["PUT"])
def update(idn):
    item = Data.query.get_or_404(idn)
    data = request.get_json()
    validated = schema.load(data)
    for key, value in validated.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(schema.dump(item)), 200


@data_bp.route("/<string:idn>", methods=["DELETE"])
def delete(idn):
    item = Data.query.get_or_404(idn)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
