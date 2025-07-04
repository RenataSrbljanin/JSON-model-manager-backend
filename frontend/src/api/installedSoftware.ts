import axios from "axios";

export interface InstalledSoftware {
  idn: string;
  idn_variant: string;
  cpe_idn: string;
  computer_idn: string;
  compatible_data_types: string[];
  accepts_credentials: string[];
  local_dependencies: string[];
  network_dependencies: string[];
  network_idn: number[];
  installed_combination: [string, "L" | "N"][];
  provides_services: string[];
  provides_network_services: string[];
  provides_user_services: string[];
  max_client_count: number;
  requires_hardware_quota: number;
  requires_hardware_quota_per_client: number;
  is_database: boolean | string;
  hardware_ids: string[];
  person_group_id: string | null;
  person_index: number;
  network_clients: string[];
  network_servers: string[];
}

const BASE_URL = "http://localhost:5000/api/installed-software";

export const getAllInstalledSoftware = async (): Promise<
  InstalledSoftware[]
> => {
  const response = await axios.get<InstalledSoftware[]>(BASE_URL + "/");
  return response.data;
};
export const getInstalledSoftwareByComputerId = async (
  computer_idn: string
): Promise<InstalledSoftware[]> => {
  const response = await axios.get<InstalledSoftware[]>(
    `${BASE_URL}/computer/${computer_idn}`
  );
  return response.data;
};

export const getInstalledSoftwareById = async (
  idn: string
): Promise<InstalledSoftware> => {
  const response = await axios.get<InstalledSoftware>(`${BASE_URL}/${idn}`);
  return response.data;
};

export const createInstalledSoftware = async (
  software: Omit<InstalledSoftware, "idn"> & { idn: string }
): Promise<InstalledSoftware> => {
  const response = await axios.post<InstalledSoftware>(
    BASE_URL + "/",
    software
  );
  return response.data;
};

export const updateInstalledSoftware = async (
  idn: string,
  data: Partial<Omit<InstalledSoftware, "computer_idn" | "idn">>
): Promise<InstalledSoftware> => {
  // važno: ne šalji computer_idn prilikom update, jer korisnik ne može menjati computer_idn
  const response = await axios.put<InstalledSoftware>(
    `${BASE_URL}/${idn}`,
    data
  );
  return response.data;
};

export const deleteInstalledSoftware = async (idn: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${idn}`);
};
