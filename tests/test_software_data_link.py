import pytest
from app.models.software_data_link import SoftwareDataLink
from app.extensions import db


@pytest.fixture(autouse=True)
def clean_db():
    yield
    db.session.query(SoftwareDataLink).delete()
    db.session.commit()


@pytest.fixture
def sample_data():
    return {
        "software_idn": "soft1",
        "data_type_id": "data1",
        # ostala polja ako postoje
    }


def test_create_software_data_link(client, sample_data):
    res = client.post("/software-data-links/", json=sample_data)
    assert res.status_code == 201
    data = res.get_json()
    assert data["software_idn"] == sample_data["software_idn"]
    assert data["data_type_id"] == sample_data["data_type_id"]


def test_get_all_software_data_links(client, sample_data):
    client.post("/software-data-links/", json=sample_data)
    res = client.get("/software-data-links/")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) >= 1


def test_get_one_software_data_link(client, sample_data):
    client.post("/software-data-links/", json=sample_data)
    res = client.get(
        f"/software-data-links/{sample_data['software_idn']}/{sample_data['data_type_id']}"
    )
    assert res.status_code == 200
    data = res.get_json()
    assert data["software_idn"] == sample_data["software_idn"]
    assert data["data_type_id"] == sample_data["data_type_id"]


def test_update_software_data_link(client, sample_data):
    client.post("/software-data-links/", json=sample_data)
    update_data = {
        "data_type_id": sample_data["data_type_id"]
    }  # i druga polja ako imaš
    res = client.put(
        f"/software-data-links/{sample_data['software_idn']}/{sample_data['data_type_id']}",
        json=update_data,
    )
    assert res.status_code == 200
    data = res.get_json()


def test_delete_software_data_link(client, sample_data):
    client.post("/software-data-links/", json=sample_data)
    res = client.delete(
        f"/software-data-links/{sample_data['software_idn']}/{sample_data['data_type_id']}"
    )
    assert res.status_code == 204
