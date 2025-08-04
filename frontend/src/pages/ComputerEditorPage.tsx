import { useState, useEffect as useEffect } from "react";
import ComputerForm from "../components/ComputerForm_1";
import { getComputerById, updateComputerbyID as updateComputerById } from "../api/computers";
import {
  getInstalledSoftwareByComputerId,
  updateSingleSoftwareWithNewComputerIdn
} from "../api/installedSoftware_old";
import type { Computer as BaseComputer } from "../types/computer";
type Computer = BaseComputer & { previous_idn?: string };
import type { Software } from "../types/software";
import axios from "axios";
import { normalizeInstalledSoftware } from "../utils/normalizeInstalledSoftware";

export default function ComputerEditorPage({ idn }: { idn: string }) {
  const [computer, setComputer] = useState<Computer | null>(null);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Pomoćna funkcija za učitavanje podataka o računaru i softveru.
  const fetchData = async (computerIdn: string) => {
    try {
      const comp = await getComputerById(computerIdn);
      if (!comp) {
        setError("Računar nije pronađen.");
        return;
      }
      // Postavlja prethodni IDN u stanje, što je ključno za logiku ažuriranja
      setComputer({ ...comp, previous_idn: comp.idn });

      const installed = await getInstalledSoftwareByComputerId(computerIdn);
      if (!installed) {
        setSoftwareList([]);
      } else {
        setSoftwareList(installed);
      }
      setError(null); // Čisti greške nakon uspešnog učitavanja
    } catch (err) {
      console.error("Greška prilikom učitavanja:", err);
      setError("Greška prilikom učitavanja podataka.");
    }
  };

  useEffect(() => {
    // `useEffect` automatski poziva `fetchData` kada se `idn` promeni
    fetchData(idn);
  }, [idn]);

  const handleComputerUpdate = async (updatedComputer: Computer) => {
    const previous_idn = updatedComputer.previous_idn || updatedComputer.idn;
    const new_computer_idn = updatedComputer.idn;

    const { previous_idn: _, ...computerToUpdateDb } = updatedComputer;

    try {
      console.log("Šaljem PUT za računar:", previous_idn);
      console.log("Podaci za računar:", computerToUpdateDb);

      await updateComputerById(previous_idn, computerToUpdateDb);

      if (previous_idn !== new_computer_idn) {
        console.log(`Computer IDN se promenio sa "${previous_idn}" na "${new_computer_idn}". Ažuriram softvere...`);

        const softwareUpdatePromises = softwareList.map(async (software) => {
          return handleSoftwareUpdate(
            software.idn,
            new_computer_idn,
            software // Prosleđujemo ceo objekat softvera
          );
        });
        await Promise.all(softwareUpdatePromises);
        console.log("Svi softveri uspešno ažurirani.");
      }

      await fetchData(new_computer_idn);
      setMessage("Računar i instalirani softveri uspešno ažurirani!");
    } catch (error) {
      console.error("Greška prilikom ažuriranja računara:", error);
      setMessage("Došlo je do greške prilikom ažuriranja.");
    }
  };

  const handleSoftwareUpdate = async (
    currentSoftwareIdn: string,
    newComputerIdn: string,
    softwareData: Partial<Software>
  ) => {
    try {
      const result = await updateSingleSoftwareWithNewComputerIdn(
        currentSoftwareIdn,
        newComputerIdn,
        softwareData
      );
      // Nakon uspešnog ažuriranja softvera, možemo ponovo učitati sve podatke
      await fetchData(newComputerIdn);
      return result;
    } catch (error) {
      console.error(`Greška pri ažuriranju softvera ${currentSoftwareIdn}:`, error);
      throw error;
    }
  };

  const handleSave = async (modifiedData: any) => {
    try {
      const response = await axios.post("http://localhost:5000/save", modifiedData);
      setMessage(`Uspešno sačuvano u fajl: ${response.data.filename}`);
    } catch (error) {
      console.error("Greška pri snimanju u fajl!:", error);
      setMessage("Greška pri čuvanju fajla.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!computer) return <div>Učitavanje...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Uređivanje računara: {idn}</h2>
      {message && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {message}
        </div>
      )}

      <div className="bg-white shadow-md rounded p-4 mb-6">
        <ComputerForm
          computer={computer}
          softwareList={softwareList}
          onChange={setComputer}
          onSoftwareUpdate={handleSoftwareUpdate}
        />
      </div>

      <button
        onClick={async () => {
          try {
            await handleComputerUpdate(computer);
            
            const { previous_idn: _, ...computerToSaveToFile } = computer;

            await handleSave({
              [computerToSaveToFile.idn]: {
                ...computerToSaveToFile,
                installed_software: Object.fromEntries(softwareList.map((s) => [s.idn, s])),
              },
            });
            setMessage("Kompjuter uspešno sačuvan u bazi i kao fajl!");
          } catch (error) {
            console.error("Greška prilikom čuvanja:", error);
            setMessage("Došlo je do greške prilikom čuvanja.");
          }
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-4"
      >
        Sačuvaj u bazi i kao fajl
      </button>
    </div>
  );
}
