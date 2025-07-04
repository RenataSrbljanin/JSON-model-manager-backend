import type {
  SoftwareIDN,
  NetworkIndex,
  PersonGroup,
  PersonIndex,
  Service,
} from "./types";

export interface DataModel {
  data_definition_idn: string;
  data_type: string;
  database_stored: boolean;
  idn: string;
  linked_software: SoftwareIDN[];
  network_idn: NetworkIndex[];
  person_groups: PersonGroup[];
  person_indexes: PersonIndex[];
  principal_software: SoftwareIDN;
  protection_level: number;
  services: Service[];
}
