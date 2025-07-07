from app.extensions import db


class FirewallRule(db.Model):
    __tablename__ = "firewall_rules"

    idn = db.Column(db.String, primary_key=True)
    allow = db.Column(db.String, nullable=False)
    from_objects = db.Column(db.JSON, nullable=False)
    to_objects = db.Column(db.JSON, nullable=False)
