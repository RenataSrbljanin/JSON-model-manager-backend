from flask import Blueprint, request, jsonify
from app.models.data_model import DataModel
from app.schemas.data_model_schema import DataModelSchema
from app.extensions import db

data_model_bp = Blueprint("data_model", __name__, url_prefix="/api/data-models")
schema = DataModelSchema()
many_schema = DataModelSchema(many=True)


@data_model_bp.route("/", methods=["GET"])
def get_all():
    all_items = DataModel.query.all()
    return jsonify(many_schema.dump(all_items)), 200


@data_model_bp.route("/<string:idn>", methods=["GET"])
def get_one(idn):
    item = DataModel.query.get_or_404(idn)
    return jsonify(schema.dump(item)), 200


@data_model_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = DataModel(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201


@data_model_bp.route("/<string:idn>", methods=["PUT"])
def update(idn):
    item = DataModel.query.get_or_404(idn)
    data = request.get_json()
    validated = schema.load(data)
    for key, value in validated.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(schema.dump(item)), 200


@data_model_bp.route("/<string:idn>", methods=["DELETE"])
def delete(idn):
    item = DataModel.query.get_or_404(idn)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
