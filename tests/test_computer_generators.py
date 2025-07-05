# tests/test_computer_generators.py

import re
import uuid
import pytest
from typing import List, Optional
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


def test_generate_software_data_links_prva_verzija():
    input_map = {"soft-1": ["FinancialData", "UserAccounts"], "soft-2": []}
    all_data_ids = ["FinancialData", "UserAccounts", "SomeOtherData"]
    result = generate_software_data_links(input_map, all_data_ids)
    assert set(result.keys()) == {"soft-1", "soft-2"}
    assert len(result["soft-1"]) == 2
    for link in result["soft-1"]:
        prefix, uid = link.split("#")
        assert prefix in ["FinancialData", "UserAccounts"]
        assert is_valid_uuid(uid)
    assert result["soft-2"] == []


def test_generate_software_data_links():
    input_map = {"soft-1": ["FinancialData", "UserAccounts"], "soft-2": []}
    all_data_ids = ["FinancialData", "UserAccounts", "SomeOtherData"]
    result = generate_software_data_links(input_map, all_data_ids)
    assert set(result.keys()) == {"soft-1", "soft-2"}
    assert len(result["soft-1"]) == 2  # samo FinancialData i UserAccounts
    assert "SomeOtherData" not in result["soft-1"]


# def test_generate_stored_credentials():
#     usernames = ["admin", "svc"]
#     software_idns = ["comp1>swA#idA", "comp2>swB#idB"]
#     creds = generate_stored_credentials(usernames, software_idns)
#     assert len(creds) == 4
#     for c in creds:
#         match = re.match(r"(.*)\.(.*)@local#(.*)", c)
#         assert match
#         assert is_valid_uuid(match.group(3))


def generate_stored_credentials_prva_verzija(
    user_prefixes: List[str],
    count_per_prefix: int = 1,
    extra_ids: Optional[List[str]] = None,
) -> List[str]:
    credentials = []
    if extra_ids is None:
        extra_ids = []
    for i, prefix in enumerate(user_prefixes):
        count = count_per_prefix if isinstance(count_per_prefix, int) else 1
        for _ in range(count):
            extra_id = extra_ids[i] if i < len(extra_ids) else ""
            credentials.append(f"{prefix}.{uuid.uuid4()}{extra_id}")
    return credentials


def test_generate_stored_credentials():
    usernames = ["admin", "svc"]
    creds = generate_stored_credentials(usernames, 2)
    assert len(creds) == 4
    assert all(any(cred.startswith(user) for user in usernames) for cred in creds)


# def test_generate_software_idn_mapping_prva_verzija():
#     # idns = ["None:0:0>Internet_connection#abc123", "None:0:1>cpe:/a:sql#uuid"]
#     # mapping = generate_software_idn_mapping(idns)
#     idn_map = {
#         "None:0:0>Internet_connection#abc123": {"name": "Internet_connection"},
#         "None:0:1>cpe:/a:sql#uuid": {"name": "sql_service"},
#     }
#     mapping = generate_software_idn_mapping(idn_map)
#     assert (
#         mapping["Internet_connection#abc123"] == "None:0:0>Internet_connection#abc123"
#     )
#     assert mapping["cpe:/a:sql#uuid"] == "None:0:1>cpe:/a:sql#uuid"


def test_generate_software_data_links():
    input_map = {"soft-1": ["FinancialData", "UserAccounts"], "soft-2": []}
    all_data_ids = ["FinancialData", "UserAccounts", "SomeOtherData"]
    result = generate_software_data_links(input_map, all_data_ids)

    assert set(result.keys()) == {"soft-1", "soft-2"}
    assert len(result["soft-1"]) == 2
    assert result["soft-2"] == []

    for link in result["soft-1"]:
        prefix, uid = link.split("#")
        assert prefix in input_map["soft-1"]
        assert len(uid) > 0


def test_generate_software_idn_mapping():
    idn_map = {
        "None:0:0>Internet_connection#abc123": {"name": "Internet_connection"},
        "None:0:1>cpe:/a:sql#uuid": {"name": "sql_service"},
    }
    mapping = generate_software_idn_mapping(idn_map)
    assert "Internet_connection#abc123" in mapping
    assert (
        mapping["Internet_connection#abc123"] == "None:0:0>Internet_connection#abc123"
    )
    assert "cpe:/a:sql#uuid" in mapping
    assert mapping["cpe:/a:sql#uuid"] == "None:0:1>cpe:/a:sql#uuid"
