import axios from "axios";
import type { Software } from "../types/software";
import {extractUUIDFromIdn} from "../utils/installed_software_helpers";

const BASE_URL = "http://localhost:5000/api/installed-software";

export const getAllInstalledSoftwares = async (): Promise<Software[]> => {
  const response = await axios.get<Software[]>(BASE_URL + "/");
  return response.data;
};

// Dodata je URL enkodovanje IDN-a
export const getInstalledSoftwareByComputerId = async (computer_idn: string): 
Promise<Software[]> => {
  const encodedIdn = encodeURIComponent(computer_idn);
  const response = await axios.get<Software[]>(
    `${BASE_URL}/computer/${encodedIdn}`);
  return response.data;
};

// Dodata je URL enkodovanje IDN-a
export const getInstalledSoftwareById = async (idn: string): 
Promise<Software> => {
  const encodedIdn = encodeURIComponent(idn);
  const response = await axios.get<Software>(`${BASE_URL}/${encodedIdn}`);
  return response.data;
};

export const createInstalledSoftware = async (
  software: Omit<Software, "idn"> & { idn: string }
): Promise<Software> => {
  const response = await axios.post<Software>(BASE_URL + "/", software);
  return response.data;
};

/**
 * Ažurira softver, uključujući promenu computer_idn i automatsko ažuriranje software_idn.
 * Ova funkcija prvo preuzima postojeći softver da bi dobila cpe_idn i originalni UUID,
 * zatim konstruiše novi software_idn sa novim computer_idn-om i šalje oba ažuriranja.
 *
 * @param currentSoftwareIdn Trenutni, puni IDN softvera koji se ažurira.
 * @param newComputerIdn Nova vrednost za computer_idn.
 * @param data Dodatni parcijalni podaci za ažuriranje softvera (osim computer_idn i idn).
 * @returns Ažurirani objekat softvera.
 */
// Dodata je URL enkodovanje IDN-a
export const updateSingleSoftwareWithNewComputerIdn_old = async (
  currentSoftwareIdn: string,
  newComputerIdn: string,
  data: Partial<Omit<Software, "computer_idn" | "idn" | "cpe_idn">> = {}
): Promise<Software> => {
  const encodedCurrentIdn = encodeURIComponent(currentSoftwareIdn);
  const encodedNewComputerIdn = encodeURIComponent(newComputerIdn);

  const existingSoftwareResponse = await axios.get<Software>(`${BASE_URL}/${encodedCurrentIdn}`);
  const existingSoftware = existingSoftwareResponse.data;

  const cpeIdn = existingSoftware.cpe_idn;
  const uuid = extractUUIDFromIdn(currentSoftwareIdn);

  const newSoftwareIdn = `${newComputerIdn}>${cpeIdn}#${uuid}`;

  const updatePayload = {
    ...data,
    computer_idn: newComputerIdn,
    idn: newSoftwareIdn,
  };

  const response = await axios.put<Software>(
    `${BASE_URL}/${encodedCurrentIdn}`,
    updatePayload
  );
  return response.data;
};

// Dodata je URL enkodovanje IDN-a
export const updateSingleSoftwareWithNewComputerIdn = async (
  currentSoftwareIdn: string,
  newComputerIdn: string,
  softwareData: Partial<Omit<Software, "computer_idn" | "idn" | "cpe_idn">>
) => {
  try {
    // Kreira novi, kompletan IDN softvera
    const cpeIdn = currentSoftwareIdn.split('>')[1].split('#')[0];
    const uuid = currentSoftwareIdn.split('#')[1];
    const newSoftwareIdn = `${newComputerIdn}>${cpeIdn}#${uuid}`;

    // Podaci koji se šalju na backend za ažuriranje
    const dataToSend = {
      ...softwareData,
      idn: newSoftwareIdn,
      computer_idn: newComputerIdn,
    };

    // URL-enkodovanje IDN-a
    const encodedCurrentIdn = encodeURIComponent(currentSoftwareIdn);

    // Šalje PUT zahtev sa originalnim IDN-om softvera kako bi ga backend pronašao
    // i ažurirao, uključujući promenu IDN-a.
    const response = await axios.put(`${BASE_URL}/${encodedCurrentIdn}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Greška pri ažuriranju softvera ${currentSoftwareIdn}:`, error);
    throw error;
  }
};

// Dodata je URL enkodovanje IDN-a
export const updateInstalledSoftware_with_constant_computerIDN = async (
  idn: string,
  data: Partial<Omit<Software, "computer_idn" | "idn">>
): Promise<Software> => {
  // važno: ne šalji computer_idn prilikom update, jer korisnik ne može menjati computer_idn
  const encodedIdn = encodeURIComponent(idn);
  const response = await axios.put<Software>(
    `${BASE_URL}/${encodedIdn}`,
    data);
  return response.data;
};

// Dodata je URL enkodovanje IDN-a
export const deleteInstalledSoftware = async (idn: string): Promise<void> => {
  const encodedIdn = encodeURIComponent(idn);
  await axios.delete(`${BASE_URL}/${encodedIdn}`);
};
