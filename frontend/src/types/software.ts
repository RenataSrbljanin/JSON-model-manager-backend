import type { SoftwareIDN, CredentialIDN, COMPUTER_IDN, CPE_IDN, PersonGroup } from "./types";

export interface Software {
  accepts_credentials: CredentialIDN  []; // 1 // Relationship
  compatible_data_types: string[]; //2
  computer_idn: COMPUTER_IDN; // 3 = 1.1 + 1.2 + 1.3 => person_group_id:person_index:network_idn
  cpe_idn: CPE_IDN; // 4         2
  hardware_ids: string[]; // 5

  idn: SoftwareIDN; // 6
  idn_variant: string; // 7 cpe_idn#integer

  installed_combination: [string, "L" | "N"| "U" ][]; // 8 idn_variant, "N"
  is_database: boolean | string; // 9
  local_dependencies: SoftwareIDN[]; // 10 software_idn
  max_client_count: number; // 11
  network_clients: string[]; // 12
  network_dependencies: SoftwareIDN[]; // 13
  network_idn: number[]; // 14  1.3
  network_servers: string[]; // 15 (svi su prazni)
  person_group_id: PersonGroup | null; // 16  1.1
  person_index: number; // 17  1.2
  provides_network_services: string[]; // 18 AD, LDAP, RDP, EmailServer, EmailWebServer, InternetBanking, FinApp, DatabaseServer, Internet
  provides_services: string[]; // 19 InternetBanking, 
  provides_user_services: string[]; // 20 Browser, Office, EmailClient, Finance ...
  requires_hardware_quota: number; // 21
  requires_hardware_quota_per_client: number; // 22
}
export interface SoftwareIdnComponents {
  computerIdn: string;
  cpeIdn: string;
  uuid: string;
}
