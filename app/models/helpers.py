# models/helpers.py
from .computer import Computer
from .installed_software import InstalledSoftware
from collections import defaultdict


def get_dropdown_values_from_computers_and_software() -> dict:
    computer_values = defaultdict(set)
    software_values = defaultdict(set)

    computers = Computer.query.all()
    software = InstalledSoftware.query.all()

    # Izvući sve vrednosti atributa iz computers
    for comp in computers:
        comp_dict = comp.to_dict()
        for key, value in comp_dict.items():
            if isinstance(value, (str, int, float)):
                computer_values[key].add(value)

    # Izvući sve vrednosti atributa iz installed_software
    for sw in software:
        sw_dict = sw.to_dict()
        for key, value in sw_dict.items():
            if isinstance(value, (str, int, float)):
                software_values[key].add(value)

    # Konvertuj setove u sortirane liste
    computer_dropdowns = {
        key: sorted(list(vals)) for key, vals in computer_values.items()
    }
    software_dropdowns = {
        key: sorted(list(vals)) for key, vals in software_values.items()
    }

    return {
        "computer_attribute_values": computer_dropdowns,
        "software_attribute_values": software_dropdowns,
    }


def get_dropdown_values_from_computers_and_software(data: dict) -> dict:
    computer_values = defaultdict(set)
    software_values = defaultdict(set)

    computers = data.get("computers", [])
    installed_software = data.get("installed_software", [])

    # Prikupi vrednosti iz computers
    for comp in computers:
        for key, value in comp.items():
            if isinstance(value, (str, int, float)):
                computer_values[key].add(value)

    # Prikupi vrednosti iz installed_software
    for sw in installed_software:
        for key, value in sw.items():
            if isinstance(value, (str, int, float)):
                software_values[key].add(value)

    # Konvertuj setove u liste
    computer_dropdowns = {
        key: sorted(list(vals)) for key, vals in computer_values.items()
    }
    software_dropdowns = {
        key: sorted(list(vals)) for key, vals in software_values.items()
    }

    return {
        "computer_attribute_values": computer_dropdowns,
        "software_attribute_values": software_dropdowns,
    }


def get_all_computers():
    return [c.to_dict() for c in Computer.query.all()]


def get_all_installed_software():
    return [s.to_dict() for s in InstalledSoftware.query.all()]
