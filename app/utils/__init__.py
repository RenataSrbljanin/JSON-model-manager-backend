# utils/computer_generators.py

import uuid
from typing import Optional, Dict, List


def generate_uuid() -> str:
    """Generiši novi UUID string."""
    return str(uuid.uuid4())


def generate_computer_idn(
    org_id: Optional[str] = None, network_index: int = 0, computer_index: int = 0
) -> str:
    """
    Generiši IDN za računar u formatu: "org_id:network_index:computer_index".
    Ako org_id nije prosleđen, koristi "None".
    """
    return f"{org_id or 'None'}:{network_index}:{computer_index}"


def generate_software_data_links(
    software_data_map: Dict[str, List[str]],
) -> Dict[str, List[str]]:
    """
    Generiši software_data_links mapu.
    Primer:
    {
        "soft_idn_1": ["DataType1#uuid1", "DataType2#uuid2"],
        "soft_idn_2": [],
    }
    """
    return {
        sw_idn: [f"{dt}#{generate_uuid()}" for dt in data_types]
        for sw_idn, data_types in software_data_map.items()
    }


def generate_stored_credentials(
    usernames: List[str], software_idns: List[str]
) -> List[str]:
    """
    Generiši IDN za credential za svaki username i software_idn.
    Format: 'username.software_idn@local#uuid'
    """
    result = []
    for username in usernames:
        for sw_idn in software_idns:
            cred_idn = f"{username}.{sw_idn}@local#{generate_uuid()}"
            result.append(cred_idn)
    return result


def generate_software_idn_mapping(software_idns: List[str]) -> Dict[str, str]:
    """
    Mapira short_idn → full_idn (korisno ako želiš lookup po varijanti bez computer ID-a).
    """
    mapping = {}
    for full_idn in software_idns:
        if ">" in full_idn:
            short_idn = full_idn.split(">")[1]
        else:
            short_idn = full_idn
        mapping[short_idn] = full_idn
    return mapping
