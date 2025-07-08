from app import create_app
from app.extensions import db
from app.models.computer import Computer
from app.models.installed_software import InstalledSoftware
from app.models.software_data_link import SoftwareDataLink
import os

app = create_app()

with app.app_context():
    print("Current working directory:", os.getcwd())
    print("Database URI:", app.config["SQLALCHEMY_DATABASE_URI"])

    # Ako fajl ne postoji, kreiraće se kada pozovemo db.create_all()
    db.create_all()

    db_path = app.config["SQLALCHEMY_DATABASE_URI"].replace("sqlite:///", "")
    abs_path = os.path.abspath(db_path)
    print("Resolved DB file path:", abs_path)
    print("DB file exists:", os.path.exists(abs_path))

    # Proveri da li već postoji računar sa IDN "comp-1"
    existing = Computer.query.filter_by(idn="comp-1").first()
    if existing:
        print("ℹ️  Test data already exists. Skipping insert.")
    else:
        # Ubaci test podatke samo ako ne postoji
        test_computer_1 = Computer(
            idn="comp-1",
            data=["OS:Linux", "Location:Lab"],
            installed_software_idns=["soft-1", "soft-2"],
            stored_credentials=["cred-1"],
            software_data_links={"soft-1": ["dt-1", "dt-2"]},
            software_idn_mapping={"soft-1": "Software One"},
            network_idn=[1, 2],
            provides_hardware_quota=100.0,
            used_hardware_quota=40.0,
        )

        software_1 = InstalledSoftware(
            idn="soft-1",
            idn_variant="v1.0",
            cpe_idn="cpe:/a:vendor:soft1:1.0",
            computer_idn="comp-1",
            compatible_data_types=["dt-1"],
            accepts_credentials=["cred-1"],
            local_dependencies=[],
            network_dependencies=[],
            network_idn=[1],
            installed_combination=[["soft-2", "L"]],
            provides_services=["srv-1"],
            provides_network_services=["net-srv-1"],
            provides_user_services=["user-srv-1"],
            max_client_count=100,
            requires_hardware_quota=10.0,
            requires_hardware_quota_per_client=0.5,
            is_database=False,
            hardware_ids=["hw-1"],
            person_group_id=None,
            person_index=1,
            network_clients=["soft-2"],
            network_servers=["srv-db"],
            stored_credentials=["cred-1"],
            software_data_links=[],
            software_idn_mapping={},
            provides_hardware_quota=0.0,
            used_hardware_quota=0.0,
        )

        software_2 = InstalledSoftware(
            idn="soft-2",
            idn_variant="v2.0",
            cpe_idn="cpe:/a:vendor:soft2:2.0",
            computer_idn="comp-1",
            compatible_data_types=["dt-2"],
            accepts_credentials=["cred-1"],
            local_dependencies=[],
            network_dependencies=[],
            network_idn=[2],
            installed_combination=[["soft-1", "N"]],
            provides_services=["srv-2"],
            provides_network_services=["net-srv-2"],
            provides_user_services=["user-srv-2"],
            max_client_count=50,
            requires_hardware_quota=5,
            requires_hardware_quota_per_client=0.2,
            is_database=True,
            hardware_ids=["hw-2"],
            person_group_id="pg-1",
            person_index=2,
            network_clients=["client-app"],
            network_servers=["srv-api"],
            stored_credentials=["cred-1"],
            software_data_links=[],
            software_idn_mapping={},
            provides_hardware_quota=0.1,
            used_hardware_quota=0.2,
        )

        # Add SoftwareDataLink test entries
        link1 = SoftwareDataLink(software_idn="soft-1", data_type_id="dt-1")
        link2 = SoftwareDataLink(software_idn="soft-1", data_type_id="dt-2")
        link3 = SoftwareDataLink(software_idn="soft-2", data_type_id="dt-3")

        # Save to DB
        db.session.add(test_computer_1)
        db.session.add_all([software_1, software_2])
        db.session.add_all([link1, link2, link3])
        db.session.commit()

    if Computer.query.filter_by(idn="comp-2").first():
        print("ℹ️  Test data already exists. Skipping insert.")
    else:
        test_computer_2 = Computer(
            idn="comp-2",
            data=["OS:Linux", "Location:Lab"],
            installed_software_idns=["soft-1", "soft-2"],
            stored_credentials=["cred-1"],
            software_data_links={"soft-1": ["dt-1", "dt-2"]},
            software_idn_mapping={"soft-1": "Software One"},
            network_idn=[1, 2],
            provides_hardware_quota=100.0,
            used_hardware_quota=40.0,
        )
        db.session.add(test_computer_2)
        db.session.commit()
        print("✅ Database created and test data inserted.")
