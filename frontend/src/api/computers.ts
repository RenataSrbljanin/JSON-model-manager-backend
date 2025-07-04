import axios from "axios";

export interface Computer {
  idn: string;
  data: string[];
  installed_software_idns: string[];
  stored_credentials: string[];
  software_data_links: Record<string, string[]>;
  software_idn_mapping: Record<string, string>;
  network_idn: number[];
  provides_hardware_quota: number;
  used_hardware_quota: number;
}

const BASE_URL = "http://localhost:5000/api/computers"; // prilagodi ako backend nije localhost:5000

export const getAllComputers = async (): Promise<Computer[]> => {
  const response = await axios.get<Computer[]>(BASE_URL + "/");
  return response.data;
};

export const getComputerById = async (idn: string): Promise<Computer> => {
  const response = await axios.get<Computer>(`${BASE_URL}/${idn}`);
  return response.data;
};

export const createComputer = async (
  computer: Omit<Computer, "idn"> & { idn: string }
): Promise<Computer> => {
  const response = await axios.post<Computer>(BASE_URL + "/", computer);
  return response.data;
};

export const updateComputer = async (
  idn: string,
  data: Partial<Omit<Computer, "idn">>
): Promise<Computer> => {
  const response = await axios.put<Computer>(`${BASE_URL}/${idn}`, data);
  return response.data;
};

export const deleteComputer = async (idn: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${idn}`);
};
