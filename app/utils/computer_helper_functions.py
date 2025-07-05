# utils/computer_helper_functions.py

from typing import Dict, Any, List, Set, Optional
from collections import defaultdict

# === Quota related ===


def get_used_hardware_quota(computer: Dict[str, Any]) -> float:
    return computer.get("used_hardware_quota", 0.0)


def get_provided_hardware_quota(computer: Dict[str, Any]) -> float:
    return computer.get("provides_hardware_quota", 0.0)


def calculate_total_quota_difference(computer: Dict[str, Any]) -> float:
    provided = get_provided_hardware_quota(computer)
    used = get_used_hardware_quota(computer)
    return provided - used


# === Installed Software ===


def get_installed_software(computer: Dict[str, Any]) -> Dict[str, Any]:
    return computer.get("installed_software", {})


def get_installed_software_ids(computer: Dict[str, Any]) -> List[str]:
    return list(get_installed_software(computer).keys())


def get_software_ids_using_credential(
    computer: Dict[str, Any], credential_idn: str
) -> List[str]:
    return [
        sw_id
        for sw_id, sw in get_installed_software(computer).items()
        if credential_idn in sw.get("accepts_credentials", [])
    ]


def get_all_provided_services(computer: Dict[str, Any]) -> Set[str]:
    services = set()
    for sw in get_installed_software(computer).values():
        services.update(sw.get("provides_services", []))
    return services


# === Credentials ===


def get_stored_credentials(computer: Dict[str, Any]) -> List[str]:
    return computer.get("stored_credentials", [])


def group_credentials_by_prefix(computer: Dict[str, Any]) -> Dict[str, List[str]]:
    grouped = defaultdict(list)
    for cred in get_stored_credentials(computer):
        if "." in cred:
            prefix = cred.split(".")[0]
            grouped[prefix].append(cred)
    return dict(grouped)


def is_credential_used_by_any_software(
    computer: Dict[str, Any], credential_idn: str
) -> bool:
    return any(
        credential_idn in sw.get("accepts_credentials", [])
        for sw in get_installed_software(computer).values()
    )


def get_unused_credentials(computer: Dict[str, Any]) -> List[str]:
    stored = get_stored_credentials(computer)
    used = set()
    for sw in get_installed_software(computer).values():
        used.update(sw.get("accepts_credentials", []))
    return [cred for cred in stored if cred not in used]


# === Software Data Links ===


def get_software_data_links(computer: Dict[str, Any], software_idn: str) -> List[str]:
    return computer.get("software_data_links", {}).get(software_idn, [])


def get_all_unique_data_types(computer: Dict[str, Any]) -> List[str]:
    types = set()
    for links in computer.get("software_data_links", {}).values():
        for link in links:
            parts = link.split("#")
            if parts:
                types.add(parts[0])
    return list(types)


def computer_has_data_id(computer: Dict[str, Any], data_id: str) -> bool:
    return data_id in computer.get("data", [])


# === Services ===


def map_services_to_software_ids(computer: Dict[str, Any]) -> Dict[str, List[str]]:
    result = defaultdict(list)
    for sw_id, sw in get_installed_software(computer).items():
        for service in sw.get("provides_services", []):
            result[service].append(sw_id)
    return dict(result)


def get_software_ids_providing_service(
    computer: Dict[str, Any], service_name: str
) -> List[str]:
    return [
        sw_id
        for sw_id, sw in get_installed_software(computer).items()
        if service_name in sw.get("provides_services", [])
    ]
