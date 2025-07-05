# tests/test_computer_generators.py

import re
import uuid
import pytest
from app.utils.computer_generators import (
    generate_computer_idn,
    generate_software_data_links,
    generate_stored_credentials,
    generate_software_idn_mapping,
)


def is_valid_uuid(value: str) -> bool:
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False


def test_generate_computer_idn_defaults():
    idn = generate_computer_idn()
    assert idn == "None:0:0"


def test_generate_computer_idn_custom():
    idn = generate_computer_idn("OrgX", 1, 5)
    assert idn == "OrgX:1:5"


def test_generate_software_data_links():
    input_map = {"soft-1": ["FinancialData", "UserAccounts"], "soft-2": []}
    result = generate_software_data_links(input_map)
    assert set(result.keys()) == {"soft-1", "soft-2"}
    assert len(result["soft-1"]) == 2
    for link in result["soft-1"]:
        prefix, uid = link.split("#")
        assert prefix in ["FinancialData", "UserAccounts"]
        assert is_valid_uuid(uid)
    assert result["soft-2"] == []


def test_generate_stored_credentials():
    usernames = ["admin", "svc"]
    software_idns = ["comp1>swA#idA", "comp2>swB#idB"]
    creds = generate_stored_credentials(usernames, software_idns)
    assert len(creds) == 4
    for c in creds:
        match = re.match(r"(.*)\.(.*)@local#(.*)", c)
        assert match
        assert is_valid_uuid(match.group(3))


def test_generate_software_idn_mapping():
    idns = ["None:0:0>Internet_connection#abc123", "None:0:1>cpe:/a:sql#uuid"]
    mapping = generate_software_idn_mapping(idns)
    assert (
        mapping["Internet_connection#abc123"] == "None:0:0>Internet_connection#abc123"
    )
    assert mapping["cpe:/a:sql#uuid"] == "None:0:1>cpe:/a:sql#uuid"
