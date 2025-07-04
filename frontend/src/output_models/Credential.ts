import type { CredentialID, IDN } from "./types";

export interface Credential {
  credential_id: CredentialID;
  role_type: "admin" | "svc" | "developer" | "finance" | "ceo" | string;
  softwareIDN: IDN;
  user: string;
}
