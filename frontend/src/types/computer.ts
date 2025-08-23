import type { Software } from "./software";

export type Computer = {

  data: string[]; // 1
  idn: string;  // 2   person_group_id:person_index:network_idn

  installed_software: Software[]; // 3
  installed_software_idns: string[]; // 4  person_group_id:person_index:network_idn>cpe_idn#uuid
  network_idn: number[]; // 5
  provides_hardware_quota: number; // 6
  software_data_links: Record<string, string[]>;// 7
  software_idn_mapping: Record<string, string>; // 8
  stored_credentials: Credential[]; // 9
  used_hardware_quota: number;  // 10

  // label?: string;
  device_index?: number;
  suffix?: string;
  previous_idn?: string; 
};
export interface ComputerIdnComponents {
  label?: string;
  device_index?: number;
  suffix?: string;
}
export interface Employee {
  id: number;
  employee_group: string;
  employee_index: number;
  credentials: Credential[];
}

/**
 * Represents a Credential used for accessing software or systems.
 */
export interface Credential {
  idn: string;
  has_root: boolean;
  stored_at_computer_id: string;
  linked_software: Software[];
  linked_employees: Employee[];
}

/**
 * Represents a Data entity, like emails or financial data.
 */
export interface Data {
  idn: string;
  data_definition_idn: string;
  data_type: string;
  database_stored: boolean;
  principal_software_id?: string;
  protection_level: number;
  linked_software: Software[];
}

/**
 * Represents a Software component installed on a computer.
 */
export interface Software_predlozeni {
  idn: string;
  computer_idn: string;
  cpe_idn: string;
  idn_variant: string;
  is_database: string;
  max_client_count: number;
  person_group_id?: string;
  person_index: number;
  requires_hardware_quota: number;
  requires_hardware_quota_per_client: number;
  
  // Relationships
  dependencies: Software[];
  dependency_of: Software[];
  accepts_credentials: Credential[];
  data_links: Data[];
}

export interface FirewallRule {
  idn: string;
  allow: boolean;
  
  // Simplified as arrays of strings for frontend representation
  from_objects: string[];
  to_objects: string[];
}

/**
 * Represents a Network Segment containing multiple computers.
 */
export interface NetworkSegment {
  id: string;
  computers: Computer[];
}

/**
 * Represents the entire system data structure, as stored in the database.
 */
export interface SystemData {
  id: number;
  filename: string;
  data: string; // The raw JSON data as a string
  created_at: string;
}

