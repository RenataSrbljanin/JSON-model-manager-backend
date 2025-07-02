import pytest
from app.models.computer import Computer
from app.extensions import db


@pytest.fixture(autouse=True)
def clean_db():
    yield
    db.session.query(Computer).delete()
    db.session.commit()


@pytest.fixture
def sample_computer_data():
    return {
        "idn": "comp123",
        "data": {"os": "Linux", "version": "18.04"},
        "installed_software_idns": ["soft1", "soft2"],
        "stored_credentials": ["cred1", "cred2"],
        "software_data_links": {"soft1": "data1"},
        "software_idn_mapping": {"soft1": "id1"},
        "network_idn": {"network": "net1"},
        "provides_hardware_quota": 100.0,
        "used_hardware_quota": 25.5,
    }


def test_create_computer(client, sample_computer_data):
    res = client.post("/api/computers/", json=sample_computer_data)
    assert res.status_code == 201
    data = res.get_json()
    assert data["idn"] == sample_computer_data["idn"]
    assert data["data"] == sample_computer_data["data"]


def test_get_all_computers(client, sample_computer_data):
    client.post("/api/computers/", json=sample_computer_data)
    res = client.get("/api/computers/")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert any(c["idn"] == sample_computer_data["idn"] for c in data)


def test_get_one_computer(client, sample_computer_data):
    client.post("/api/computers/", json=sample_computer_data)
    res = client.get(f"/api/computers/{sample_computer_data['idn']}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["idn"] == sample_computer_data["idn"]


def test_update_computer(client, sample_computer_data):
    client.post("/api/computers/", json=sample_computer_data)
    updated_data = {
        "data": {"os": "Windows", "version": "10"},
        "installed_software_idns": ["soft3"],
        "stored_credentials": ["cred3"],
        "software_data_links": {"soft3": "data3"},
        "software_idn_mapping": {"soft3": "id3"},
        "network_idn": {"network": "net2"},
        "provides_hardware_quota": 200.0,
        "used_hardware_quota": 50.0,
    }
    res = client.put(f"/api/computers/{sample_computer_data['idn']}", json=updated_data)
    assert res.status_code == 200
    data = res.get_json()
    assert data["data"] == updated_data["data"]
    assert data["provides_hardware_quota"] == updated_data["provides_hardware_quota"]


def test_delete_computer(client, sample_computer_data):
    client.post("/api/computers/", json=sample_computer_data)
    res = client.delete(f"/api/computers/{sample_computer_data['idn']}")
    assert res.status_code == 204
    # Provera da li je obrisan
    res2 = client.get(f"/api/computers/{sample_computer_data['idn']}")
    assert res2.status_code == 404
