export type Computer = {
  idn: string;
  label?: string;
  device_index?: number;
  suffix?: string;
  data: string[];
  installed_software_idns: string[];
  stored_credentials: string[];
  software_data_links: Record<string, string[]>;
  software_idn_mapping: Record<string, string>;
  network_idn: number[];
  provides_hardware_quota: number;
  used_hardware_quota: number;
};
