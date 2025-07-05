import uuid
from typing import Optional


# === Helper Functions ===
def generate_uuid() -> str:
    return str(uuid.uuid4())


def generate_idn(
    computer_idn: str, cpe_idn: str, static_uuid: Optional[str] = None
) -> str:
    return f"{computer_idn}>{cpe_idn}#{static_uuid or generate_uuid()}"


def generate_idn_variant(cpe_idn: str, version_id: int = 1) -> str:
    return f"{cpe_idn}#{version_id}"


def generate_credential_idn(
    username: str, idn: str, scope: str = "local", cred_uuid: Optional[str] = None
) -> str:
    return f"{username}.{idn}@{scope}#{cred_uuid or generate_uuid()}"
