# utils/credential_helper_functions.py

from typing import Dict, Any, List
from collections import defaultdict


def get_credentials_by_user_prefix(computer: Dict[str, Any], prefix: str) -> List[str]:
    """
    Vrati sve credentials za date korisničke prefikse (npr. 'admin', 'svc', 'guest').
    """
    return [
        cred
        for cred in computer.get("stored_credentials", [])
        if cred.startswith(f"{prefix}.")
    ]


def group_credentials_by_prefix(computer: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    Grupisanje credentials po prefiksu korisničkog imena (npr. 'admin', 'svc', 'user').
    """
    grouped = defaultdict(list)
    for cred in computer.get("stored_credentials", []):
        if "." in cred:
            prefix = cred.split(".")[0]
            grouped[prefix].append(cred)
    return dict(grouped)


def find_software_credentials_usage(computer: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    Vrati mapu: credential_idn → lista softverskih IDN-ova koji ga koriste.
    """
    usage_map = {}
    for sw_id, sw in computer.get("installed_software", {}).items():
        for cred in sw.get("accepts_credentials", []):
            usage_map.setdefault(cred, []).append(sw_id)
    return usage_map


def get_credentials_for_software(
    computer: Dict[str, Any], software_idn: str
) -> List[str]:
    """
    Vrati sve credentiale koje koristi konkretan softver po IDN-u.
    """
    return (
        computer.get("installed_software", {})
        .get(software_idn, {})
        .get("accepts_credentials", [])
    )


def is_credential_stored_locally(computer: Dict[str, Any], credential_idn: str) -> bool:
    """
    Da li je credential fizički sačuvan na ovom računaru?
    """
    return credential_idn in computer.get("stored_credentials", [])
