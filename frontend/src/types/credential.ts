import type { Employee } from "./computer";
import type { CredentialIDN as CredentialIDN, SoftwareIDN, COMPUTER_IDN } from "./types";
//"admin.None:0:0#1>cpe:/a:microsoft:exchange_server:2016:cumulative_update_9#c9688062-6595-43a2-ad57-600cbb21a7b7@#a4267db3-d6b8-4d47-8753-6204a23919e9",

export interface Credential {  // u overall: credentials
    has_root: Boolean // 1
    idn: CredentialIDN // 2 u software: accepts_credentials, u computer: stored_credentials
    linked_employees: [Employee]  // 3
    linked_software: [SoftwareIDN] // 4
    stored_at:[COMPUTER_IDN]  //5

    // credential_id: CredentialID;
    // role_type: "admin" | "svc" | "developer" | "finance" | "ceo" | string;
    // softwareIDN: IDN;
    // user: string;
}