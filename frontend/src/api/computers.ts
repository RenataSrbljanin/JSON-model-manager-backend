import axios from "axios";
import type { Computer } from "../types/computer";

const BASE_URL = "http://localhost:5000/api/computers"; // prilagodi ako backend nije localhost:5000

export const getAllComputers = async (): Promise<Computer[]> => {
  const response = await axios.get<Computer[]>(BASE_URL + "/");
  return response.data;
};

export const getComputerById = async (
  idn: string
): Promise<Computer | null> => {
  try {
    const response = await axios.get<Computer>(`${BASE_URL}/${idn}`);
    return response.data;
  } catch (error: any) {
    console.error("Greška prilikom dohvatanja računara:", error);

    // Ako je status 404, možemo vratiti null
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    // Za sve ostale greške – propagiraj grešku dalje
    throw error;
  }
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
