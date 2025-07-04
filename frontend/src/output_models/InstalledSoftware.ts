import type {
  IDN,
  CPE_IDN,
  CredentialID,
  DataTypeID,
  NetworkSegmentID,
  COMPUTER_IDN,
  SOFTWARE_IDN,
} from "./types";

export interface InstalledSoftware {
  idn: SOFTWARE_IDN;
  idn_variant: string;
  cpe_idn: CPE_IDN;
  computer_idn: COMPUTER_IDN;
  compatible_data_types: DataTypeID[];
  accepts_credentials: CredentialID[];
  local_dependencies: IDN[];
  network_dependencies: IDN[];
  network_idn: NetworkSegmentID[];
  installed_combination: [CPE_IDN, "L" | "N"][];
  provides_services: string[];
  provides_network_services: string[];
  provides_user_services: string[];
  max_client_count: number;
  requires_hardware_quota: number;
  requires_hardware_quota_per_client: number;
  is_database: boolean | string;
  hardware_ids: string[];
  person_group_id: string | null;
  person_index: number;
  network_clients: IDN[];
  network_servers: IDN[];
}
