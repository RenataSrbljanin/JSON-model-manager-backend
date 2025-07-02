def test_create_data_model(client):
    data = {
        "idn": "dm1",
        "data_definition_idn": "def1",
        "data_type": "type1",
        "database_stored": "yes",
        "linked_software": ["soft1", "soft2"],
        "network_idn": [1, 2],
        "person_groups": ["group1"],
        "person_indexes": [0],
        "principal_software": "soft1",
        "protection_level": 5,
        "services": ["service1"],
    }

    response = client.post("/api/data-models/", json=data)
    assert response.status_code == 201
    resp_json = response.get_json()
    assert resp_json["idn"] == data["idn"]


def test_get_data_model(client):
    response = client.get("/api/data-models/dm1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["idn"] == "dm1"


def test_update_data_model(client):
    update_data = {
        "protection_level": 10,
        "services": ["service1", "service2"],
        # moraš poslati sva polja obavezna za validaciju
        "idn": "dm1",
        "data_definition_idn": "def1",
        "data_type": "type1",
        "database_stored": "yes",
        "linked_software": ["soft1", "soft2"],
        "network_idn": [1, 2],
        "person_groups": ["group1"],
        "person_indexes": [0],
        "principal_software": "soft1",
    }

    response = client.put("/api/data-models/dm1", json=update_data)
    assert response.status_code == 200
    resp_json = response.get_json()
    assert resp_json["protection_level"] == 10
    assert "service2" in resp_json["services"]


def test_delete_data_model(client):
    response = client.delete("/api/data-models/dm1")
    assert response.status_code == 204

    # Potvrda da je obrisan
    response = client.get("/api/data-models/dm1")
    assert response.status_code == 404
