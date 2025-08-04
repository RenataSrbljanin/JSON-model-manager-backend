import axios from 'axios';
import type { Software } from "../types/software";

const API_BASE_URL = "http://localhost:5000/api";

// ... ostale funkcije ...

/**
 * Ažurira softver sa novim IDN-om računara i dodatnim podacima.
 * @param currentSoftwareIdn Trenutni IDN softvera (npr. "old:idn>cpe_idn#uuid").
 * @param newComputerIdn Novi IDN računara (npr. "new:idn").
 * @param softwareData Ostali podaci za ažuriranje softvera.
 */
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

    // Šalje PUT zahtev sa originalnim IDN-om softvera kako bi ga backend pronašao
    // i ažurirao, uključujući promenu IDN-a.
    const response = await axios.put(`${API_BASE_URL}/installed-software/${currentSoftwareIdn}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Greška pri ažuriranju softvera ${currentSoftwareIdn}:`, error);
    throw error;
  }
};

// ... ostale funkcije ...
