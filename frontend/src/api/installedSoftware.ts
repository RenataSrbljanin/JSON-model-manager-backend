import axios from "axios";
import type { Software } from "../types/software";
// export interface Software {
//   accepts_credentials: string[]; // 1
//   compatible_data_types: string[]; //2
//   computer_idn: string; // 3
//   cpe_idn: string; // 4
//   hardware_ids: string[]; // 5

//   idn: string; // 6
//   idn_variant: string; // 7
  
//   installed_combination: [string, "L" | "N"][]; // 8
//   is_database: boolean | string; // 9
//   local_dependencies: string[]; // 10
//   max_client_count: number; // 11
//   network_clients: string[]; // 12
//   network_dependencies: string[]; // 13
//   network_idn: number[]; // 14
//   network_servers: string[]; // 15
//   person_group_id: string | null; // 16
//   person_index: number; // 17
//   provides_network_services: string[]; // 18
//   provides_services: string[];  // 19
//   provides_user_services: string[]; // 20
//   requires_hardware_quota: number;  // 21
//   requires_hardware_quota_per_client: number;  // 22
// }

const BASE_URL = "http://localhost:5000/api/installed-software";

export const getAllInstalledSoftware = async (): Promise<
  Software[]
> => {
  const response = await axios.get<Software[]>(BASE_URL + "/");
  return response.data;
};
export const getInstalledSoftwareByComputerId = async (
  computer_idn: string
): Promise<Software[]> => {
  const response = await axios.get<Software[]>(
    `${BASE_URL}/computer/${computer_idn}`
  );
  return response.data;
};

export const getInstalledSoftwareById = async (
  idn: string
): Promise<Software> => {
  const response = await axios.get<Software>(`${BASE_URL}/${idn}`);
  return response.data;
};

export const createInstalledSoftware = async (
  software: Omit<Software, "idn"> & { idn: string }
): Promise<Software> => {
  const response = await axios.post<Software>(
    BASE_URL + "/",
    software
  );
  return response.data;
};

export const updateInstalledSoftware = async (
  idn: string,
  data: Partial<Omit<Software, "computer_idn" | "idn">>
): Promise<Software> => {
  // važno: ne šalji computer_idn prilikom update, jer korisnik ne može menjati computer_idn
  const response = await axios.put<Software>(
    `${BASE_URL}/${idn}`,
    data
  );
  return response.data;
};

export const deleteInstalledSoftware = async (idn: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${idn}`);
};
