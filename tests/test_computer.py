import pytest
from app.extensions import db
from app.models.computer import Computer

# Sample payload for a computer
sample_computer = {
    "idn": "comp-001",
    "data": ["type1", "type2"],
    "installed_software_idns": ["soft-001", "soft-002"],
    "stored_credentials": ["cred-001"],
    "software_data_links": {"soft-001": ["data-001", "data-002"]},
    "software_idn_mapping": {"internal-soft": "soft-001"},
    "network_idn": [1, 2],
    "provides_hardware_quota": 100.0,
    "used_hardware_quota": 30.0,
}


@pytest.fixture(autouse=True)
def clear_database(app):
    with app.app_context():
        db.session.query(Computer).delete()
        db.session.commit()


def test_create_computer(client):
    response = client.post("/api/computers/", json=sample_computer)
    assert response.status_code == 201
    data = response.get_json()
    assert data["idn"] == sample_computer["idn"]


def test_get_all_computers(client):
    client.post("/api/computers/", json=sample_computer)
    response = client.get("/api/computers/")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 1


def test_get_one_computer(client):
    client.post("/api/computers/", json=sample_computer)
    response = client.get(f"/api/computers/{sample_computer['idn']}")
    assert response.status_code == 200
    data = response.get_json()
    assert data["idn"] == sample_computer["idn"]


def test_update_computer(client):
    client.post("/api/computers/", json=sample_computer)
    update_payload = sample_computer.copy()
    update_payload["used_hardware_quota"] = 50.0
    response = client.put(
        f"/api/computers/{sample_computer['idn']}", json=update_payload
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["used_hardware_quota"] == 50.0


def test_delete_computer(client):
    client.post("/api/computers/", json=sample_computer)
    response = client.delete(f"/api/computers/{sample_computer['idn']}")
    assert response.status_code == 204
    # Confirm deletion
    get_response = client.get(f"/api/computers/{sample_computer['idn']}")
    assert get_response.status_code == 404
