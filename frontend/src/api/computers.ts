import axios from "axios";
import type { Computer } from "../types/computer";

const BASE_URL = "http://localhost:5000/api/computers"; // prilagodi ako backend nije localhost:5000
/**
 * Dohvaća listu računara sa Flask backend-a.
 * Opcionalno filtrira računare na osnovu unetog termina za pretragu.
 * @param searchTerm Termin za pretragu (npr. IDN računara).
 * @returns Promise koji se razrešava u niz objekata tipa Computer.
 */
export const getAllComputers = async (searchTerm: string = ""): Promise<Computer[]> => {
  try {
    // Kreiramo URL sa parametrom za pretragu ako je searchTerm prisutan.
    // Koristimo URLSearchParams za pravilno kodiranje parametara.
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }

    // Konstruišemo pun URL. Ako nema search terma, biće samo BASE_URL.
    // Ako ima, biće BASE_URL?search=yourTerm
    const url = `${BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await axios.get<Computer[]>(url);
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju računara:", error);
    // Možete baciti grešku ili vratiti prazan niz, zavisno od vašeg pristupa obradi grešaka
    throw error; // Bacamo grešku da bi je HomePage mogao uhvatiti
    // return []; // Alternativno, vratite prazan niz
  }
};
export const getAllComputers_old = async (): Promise<Computer[]> => {
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

export const updateComputer_old = async (
  idn: string,
  data: Partial<Omit<Computer, "idn">>
): Promise<Computer> => {
  const response = await axios.put<Computer>(`${BASE_URL}/${idn}`, data);
  return response.data;
};
export async function updateComputer(previousIdn: string, data: Computer): Promise<Computer> {
  const response = await axios.put(`/api/computers/${previousIdn}`, data);
  return response.data;
}

export const deleteComputer = async (idn: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${idn}`);
};
