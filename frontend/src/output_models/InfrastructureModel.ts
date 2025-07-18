import type {
  IDN,
  CredentialID,
  DataTypeID,
  NetworkSegmentID,
  Timestamp,
  DurationString,
} from "./types";
import type { Computer } from "./Computer";
import type { Credential } from "./Credential";
import type { DataModel } from "./DataModel";
import type { FirewallRule } from "./FirewallRule";

export interface InfrastructureModel {
  computers: { [idn: IDN]: Computer };
  created: Timestamp;
  credentials: { [credID: CredentialID]: Credential };
  data: { [key: string]: DataModel };
  duration: DurationString;
  firewall_rules: { [key: string]: FirewallRule };
  network_segments: { [segment: NetworkSegmentID]: IDN[] };
  total_employee_count: number;
  version: string;
}
