import type { IDN } from "./types";
import type { DataTypeID } from "./types";

export interface SoftwareDataLink {
  [softwareIDN: IDN]: DataTypeID[];
}
