import type { IDN, CredentialID, DataTypeID, NetworkSegmentID } from "./types";
import type { InstalledSoftware } from "./InstalledSoftware";
import type { SoftwareDataLink } from "./SoftwareDataLink";

export interface Computer {
  idn: IDN;
  data: DataTypeID[];
  installed_software: { [idn: IDN]: InstalledSoftware };
  installed_software_idns: IDN[];
  stored_credentials: CredentialID[];
  software_data_links: SoftwareDataLink;
  software_idn_mapping: { [key: string]: IDN };
  network_idn: NetworkSegmentID[];
  provides_hardware_quota: number;
  used_hardware_quota: number;
}
