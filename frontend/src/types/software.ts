
export interface Software {
  accepts_credentials: string[]; // 1 // Relationship
  compatible_data_types: string[]; //2
  computer_idn: string; // 3 = 1.1 + 1.2 + 1.3 => person_group_id:person_index:network_idn
  cpe_idn: string; // 4         2
  hardware_ids: string[]; // 5

  idn: string; // 6
  idn_variant: string; // 7

  installed_combination: [string, "L" | "N"| "U" ][]; // 8
  is_database: boolean | string; // 9
  local_dependencies: string[]; // 10
  max_client_count: number; // 11
  network_clients: string[]; // 12
  network_dependencies: string[]; // 13
  network_idn: number[]; // 14  1.3
  network_servers: string[]; // 15
  person_group_id: string | null; // 16  1.1
  person_index: number; // 17  1.2
  provides_network_services: string[]; // 18
  provides_services: string[]; // 19
  provides_user_services: string[]; // 20
  requires_hardware_quota: number; // 21
  requires_hardware_quota_per_client: number; // 22
}
export interface SoftwareIdnComponents {
  computerIdn: string;
  cpeIdn: string;
  uuid: string;
}
