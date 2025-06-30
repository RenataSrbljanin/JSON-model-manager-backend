import json
from app.models.installed_software import InstalledSoftware


def parse_installed_software_from_json(json_obj: dict) -> InstalledSoftware:
    #  parser
    return InstalledSoftware(
        idn=json_obj["idn"],
        computer_idn=json_obj["computer_idn"],
        cpe_idn=json_obj["cpe_idn"],
        idn_variant=json_obj["idn_variant"],
        accepts_credentials=json_obj["accepts_credentials"],
        compatible_data_types=json_obj["compatible_data_types"],
        hardware_ids=json_obj["hardware_ids"],
        installed_combination=[tuple(i) for i in json_obj["installed_combination"]],
        is_database=json_obj["is_database"],
        local_dependencies=json_obj["local_dependencies"],
        network_dependencies=json_obj["network_dependencies"],
        network_clients=json_obj["network_clients"],
        network_servers=json_obj["network_servers"],
        network_idn=json_obj["network_idn"],
        provides_network_services=json_obj["provides_network_services"],
        provides_services=json_obj["provides_services"],
        provides_user_services=json_obj["provides_user_services"],
        max_client_count=json_obj["max_client_count"],
        person_index=json_obj["person_index"],
        person_group_id=json_obj.get("person_group_id"),
        requires_hardware_quota=json_obj["requires_hardware_quota"],
        requires_hardware_quota_per_client=json_obj[
            "requires_hardware_quota_per_client"
        ],
    )
