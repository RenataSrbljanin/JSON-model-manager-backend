import pytest
from app import create_app
from app.extensions import db
from app.models.installed_software import InstalledSoftware


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///:memory:"  # In-memory baza za testove
    )

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def sample_installed_software(idn="test123"):
    return {
        "idn": idn,
        "idn_variant": "v1",
        "cpe_idn": "cpe1",
        "computer_idn": "comp1",
        "compatible_data_types": [],
        "accepts_credentials": [],
        "local_dependencies": [],
        "network_dependencies": [],
        "network_idn": [],
        "installed_combination": [],
        "provides_services": [],
        "provides_network_services": [],
        "provides_user_services": [],
        "max_client_count": 10,
        "requires_hardware_quota": 1.0,
        "requires_hardware_quota_per_client": 0.5,
        "is_database": "no",
        "hardware_ids": [],
        "person_group_id": None,
        "person_index": 0,
        "network_clients": [],
        "network_servers": [],
    }


def test_create_installed_software(client):
    res = client.post("/api/installed-software/", json=sample_installed_software())
    assert res.status_code == 201
    data = res.get_json()
    assert data["idn"] == "test123"


def test_get_one_installed_software(client):
    # prvo ubaci podatak
    client.post("/api/installed-software/", json=sample_installed_software())
    res = client.get("/api/installed-software/test123")
    assert res.status_code == 200
    data = res.get_json()
    assert data["idn"] == "test123"


def test_update_installed_software(client):
    client.post("/api/installed-software/", json=sample_installed_software())
    update_data = sample_installed_software()
    update_data["idn_variant"] = "v2"
    res = client.put("/api/installed-software/test123", json=update_data)
    assert res.status_code == 200
    data = res.get_json()
    assert data["idn_variant"] == "v2"


def test_delete_installed_software(client):
    client.post("/api/installed-software/", json=sample_installed_software())
    res = client.delete("/api/installed-software/test123")
    assert res.status_code == 204
    # Potvrdi da je obrisano
    res = client.get("/api/installed-software/test123")
    assert res.status_code == 404
