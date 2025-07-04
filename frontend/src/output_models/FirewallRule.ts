import type { FirewallObject } from "./types";

export interface FirewallRule {
  allow: boolean;
  from_objects: FirewallObject[];
  idn: string;
  to_objects: FirewallObject[];
}
