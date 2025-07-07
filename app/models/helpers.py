# models/helpers.py
from .computer import Computer
from .installed_software import InstalledSoftware


def get_all_computers():
    return [c.to_dict() for c in Computer.query.all()]


def get_all_installed_software():
    return [s.to_dict() for s in InstalledSoftware.query.all()]
