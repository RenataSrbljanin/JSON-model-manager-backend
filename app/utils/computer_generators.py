import uuid
from typing import Optional, List, Dict


def generate_uuid() -> str:
    """Generiše novi UUID kao string."""
    return str(uuid.uuid4())


def generate_computer_idn(
    org_id: Optional[str] = "None", group_index: int = 0, computer_index: int = 0
) -> str:
    """
    Generiše jedinstveni IDN za računar na osnovu organizacije, grupe i indeksa.
    Primer: 'None:0:0'
    """
    return f"{org_id}:{group_index}:{computer_index}"


def generate_installed_software_idn(
    computer_idn: str, cpe_idn: str, static_uuid: Optional[str] = None
) -> str:
    """
    Generiše jedinstveni IDN za instalirani softver na računaru.
    Primer: 'None:0:0>cpe:/a:microsoft:sql_server:2019#<uuid>'
    """
    return f"{computer_idn}>{cpe_idn}#{static_uuid or generate_uuid()}"


def generate_software_data_links_all_data_ids(  # ne koristm je za sad
    software_idns: List[str], data_ids: List[str]
) -> Dict[str, List[str]]:
    """
    Povezuje softver sa podacima koje koristi.
    Na primer:
        {
            'None:0:0>softver#uuid': ['FinancialData:banking#uuid'],
            ...
        }
    """
    links = {}
    for sw in software_idns:
        links[sw] = data_ids.copy()  # ili prazan niz ako želiš da počne bez veza
    return links


def generate_software_data_links_2(
    software_data_map: Dict[str, List[str]], data_ids: List[str]
) -> Dict[str, List[str]]:
    """
    Za svaki softver vraća samo listu data_ids koji su u njegovoj listi,
    ali svaki data_id sa dodatim random uid-em posle #.
    """
    import random

    result = {}
    for software, linked_data in software_data_map.items():
        filtered = []
        for d in data_ids:
            if d in linked_data:
                uid = random.randint(100, 999)
                filtered.append(f"{d}#{uid}")
        result[software] = filtered
    return result


import uuid
from typing import Dict, List


def generate_software_data_links(
    software_data_map: Dict[str, List[str]], data_ids: List[str]
) -> Dict[str, List[str]]:
    """
    Za svaki softver generiše listu linkova u formatu "DataType#UUID" za svaki data_id
    koji se nalazi u listi njegovih kompatibilnih tipova.

    Primer izlaza:
    {
        "soft-1": ["FinancialData#f9f4...", "UserAccounts#abc1..."],
        "soft-2": []
    }
    """
    result = {}
    for software, compatible_data in software_data_map.items():
        links = []
        for data_type in data_ids:
            if data_type in compatible_data:
                link = f"{data_type}#{uuid.uuid4()}"
                links.append(link)
        result[software] = links
    return result


def generate_software_idn_mapping_kompleksniji(
    installed_software: Dict[str, Dict],
) -> Dict[str, str]:
    """
    Kreira mapu: varijanta softverskog IDN-a → puni softverski IDN.
    Koristi se za pretragu softvera po njegovom "kratkom" identifikatoru.
    """
    mapping = {}
    for full_idn, software in installed_software.items():
        idn_variant = software.get("idn_variant")
        if idn_variant:
            mapping[idn_variant] = full_idn
    return mapping


def generate_software_idn_mapping(
    installed_software: Dict[str, Dict],
) -> Dict[str, str]:
    """
    Kreira mapu: skraćeni softverski IDN (deo posle '>') -> puni softverski IDN
    """
    mapping = {}
    for full_idn in installed_software.keys():
        short_idn = full_idn.split(">")[-1]
        mapping[short_idn] = full_idn
    return mapping


def generate_computer_data_ids(data_type: str, n: int = 1) -> List[str]:
    """
    Generiše 'n' ID-jeva podataka koje računar može posedovati.
    Na primer: 'FinancialData:banking#<uuid>'
    """
    return [f"{data_type}#%s" % generate_uuid() for _ in range(n)]


def generate_empty_installed_software_block() -> Dict:
    """
    Vraća prazan blok instaliranog softvera za početni objekat računara.
    """
    return {
        "installed_software": {},
        "installed_software_idns": [],
        "software_data_links": {},
        "software_idn_mapping": {},
        "stored_credentials": [],
        "used_hardware_quota": 0,
    }


def generate_stored_credentials_prva_verzija(
    user_prefixes: List[str], count_per_prefix: int = 1
) -> List[str]:
    """
    Generiše listu credential ID-jeva sa prefiksima korisničkih imena.
    Na primer: ['admin.1234', 'svc.5678']
    """
    credentials = []
    for prefix in user_prefixes:
        for _ in range(count_per_prefix):
            credentials.append(f"{prefix}.{generate_uuid()}")
    return credentials


def generate_stored_credentials(
    user_prefixes: List[str], count_per_prefix: int = 1
) -> List[str]:
    """
    Generiše listu credential ID-jeva sa prefiksima korisničkih imena.
    Na primer: ['admin.1234', 'svc.5678']
    """
    import random

    credentials = []
    for prefix in user_prefixes:
        for _ in range(count_per_prefix):
            suffix = str(random.randint(1000, 9999))
            credentials.append(f"{prefix}.{suffix}")
    return credentials
