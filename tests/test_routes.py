# def test_validate_software(client):
#     valid_payload = {
#         "idn": "None:0:0>cpe:/a:microsoft:.net_framework:4.8#12345678",
#         "computer_idn": "None:0:0",
#         "cpe_idn": "cpe:/a:microsoft:.net_framework:4.8",
#         "idn_variant": "cpe:/a:microsoft:.net_framework:4.8#1",
#         "accepts_credentials": [],
#         "compatible_data_types": [],
#         "hardware_ids": [],
#         "installed_combination": [["cpe:/o:microsoft:windows_server_2016:1803#0", "L"]],
#         "is_database": "",
#         "local_dependencies": [],
#         "network_dependencies": [],
#         "network_clients": [],
#         "network_servers": [],
#         "network_idn": [0],
#         "provides_network_services": [],
#         "provides_services": [],
#         "provides_user_services": [],
#         "max_client_count": 0,
#         "person_index": 0,
#         "person_group_id": None,
#         "requires_hardware_quota": 1,
#         "requires_hardware_quota_per_client": 0,
#     }

#     response = client.post("/validate_software", json=valid_payload)
#     assert response.status_code == 200
#     assert response.json["idn"] == valid_payload["idn"]
