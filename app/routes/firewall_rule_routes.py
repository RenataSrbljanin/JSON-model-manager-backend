from flask import Blueprint, request, jsonify
from app.models.firewall_rule import FirewallRule
from app.schemas.firewall_rule_schema import FirewallRuleSchema
from app.extensions import db

firewall_rule_bp = Blueprint(
    "firewall_rule", __name__, url_prefix="/api/firewall-rules"
)
schema = FirewallRuleSchema()
many_schema = FirewallRuleSchema(many=True)


@firewall_rule_bp.route("/", methods=["GET"])
def get_all():
    all_items = FirewallRule.query.all()
    return jsonify(many_schema.dump(all_items)), 200


@firewall_rule_bp.route("/<string:idn>", methods=["GET"])
def get_one(idn):
    item = FirewallRule.query.get_or_404(idn)
    return jsonify(schema.dump(item)), 200


@firewall_rule_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    validated = schema.load(data)
    new_item = FirewallRule(**validated)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(schema.dump(new_item)), 201


@firewall_rule_bp.route("/<string:idn>", methods=["PUT"])
def update(idn):
    item = FirewallRule.query.get_or_404(idn)
    data = request.get_json()
    validated = schema.load(data)
    for key, value in validated.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify(schema.dump(item)), 200


@firewall_rule_bp.route("/<string:idn>", methods=["DELETE"])
def delete(idn):
    item = FirewallRule.query.get_or_404(idn)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted successfully."}), 204
