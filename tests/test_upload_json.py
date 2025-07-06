import os
import io
import json
from app import create_app


def test_upload_json(client):
    # Pripremi test fajl
    json_data = {
        "None:0:0": {
            "installed_software": {"None:0:0>soft-1#abc": {"name": "ExampleSoft"}},
            "data": ["UserData"],
        }
    }
    file_bytes = io.BytesIO(json.dumps(json_data).encode("utf-8"))
    file_bytes.name = "test_upload_sample.json"

    # Pošalji POST zahtev sa fajlom
    response = client.post(
        "/upload-json",
        content_type="multipart/form-data",
        data={"file": (file_bytes, "test_upload_sample.json")},
    )

    assert response.status_code == 200
    json_response = response.get_json()
    assert "data" in json_response
    assert "message" in json_response
    assert json_response["message"] == "File uploaded and parsed"

    parsed = json_response["data"]
    assert isinstance(parsed, dict)
    assert "None:0:0" in parsed
    assert "installed_software" in parsed["None:0:0"]
