import { useState, useEffect } from "react";
import ComputerForm from "../components/ComputerForm_1";
import { getComputerById, updateComputer } from "../api/computers";
import { getInstalledSoftwareByComputerId, updateInstalledSoftware
} from "../api/installedSoftware";
import type { Computer as BaseComputer } from "../types/computer";
type Computer = BaseComputer & { previous_idn?: string };
import type { Software } from "../types/software";
import axios from "axios";
import { normalizeInstalledSoftware } from "../utils/normalizeInstalledSoftware";

export default function ComputerEditorPage({ idn }: { idn: string }) {
  const [computer, setComputer] = useState<Computer | null>(null);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const comp = await getComputerById(idn);
        if (!comp) {
          setError("Računar nije pronađen.");
          return;
        }
        setComputer({ ...comp, previous_idn: comp.idn });

        const installed = await getInstalledSoftwareByComputerId(idn);
        if (!installed) {
          setSoftwareList([]);
        } else {
          setSoftwareList(installed);
        }
      } catch (err) {
        console.error("Greška prilikom učitavanja:", err);
        setError("Greška prilikom učitavanja podataka.");
      }
    }
    fetchData();
  }, [idn]);

  const handleComputerUpdate = async (updated: Computer & { previous_idn?: string }) => {
    const previous_idn = updated.previous_idn || updated.idn;

    const { previous_idn: _, ...dataToSend } = updated; // ✅ izbegnut konflikt

    console.log("Šaljem PUT za:", previous_idn);
    console.log("Podaci koje ZAISTA šaljem:", dataToSend);

    await updateComputer(previous_idn, dataToSend);
    alert("Computer updated"); // linija 56
  };


  const handleSoftwareUpdate = async (updatedSoftware: Software) => {
    await updateInstalledSoftware(updatedSoftware.idn, updatedSoftware);
    alert("Software updated");
  };
  const handleSave = async (modifiedData: any) => {
    try {
      const response = await axios.post("http://localhost:5000/save", modifiedData);
      alert(`Uspešno sačuvano u fajl: ${response.data.filename}`);
    } catch (error) {
      console.error("Greška pri snimanju u fajl!:", error);
      alert("Greška pri čuvanju fajla.");
    }
  };
  if (error) return <div className="text-red-500">{error}</div>;
  if (!computer) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Editing Computer: {idn}</h2>

      <div className="bg-white shadow-md rounded p-4 mb-6">
        <ComputerForm computer={computer} onSubmit={handleComputerUpdate} onChange={setComputer} />
      </div>

      <button
        onClick={async () => {
          try {
            // 1. Priprema podataka za spremanje u bazu
            // Proslijedimo cijeli 'computer' objekt s 'previous_idn'
            await handleComputerUpdate(computer);

            // 2. Priprema podataka za spremanje u fajl
            // OVDJE UKLANJAMO 'previous_idn' PRIJE SLANJA NA /save ENDPOINT
            const { previous_idn: _, ...computerToSaveToFile } = computer;

            await handleSave({
              [computerToSaveToFile.idn]: { // Koristimo novi objekt bez previous_idn
                ...computerToSaveToFile,
                installed_software: Object.fromEntries(softwareList.map((s) => [s.idn, s])),
              },
            });

            alert("Kompjuter uspešno sačuvan u bazi i kao fajl!");
          } catch (error) {
            console.error("Greška prilikom čuvanja:", error);
            alert("Došlo je do greške prilikom čuvanja.");
          }
          // await handleComputerUpdate(computer); // snimi u bazu
          // await handleSave({
          //   [computer.idn]: {
          //     ...computer,
          //     installed_software: Object.fromEntries(softwareList.map((s) => [s.idn, s])),
          //   },
          // }); // snimi fajl
       //   await handleComputerUpdate(computer); // snimi u bazu
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-4"
      >
        Sačuvaj u bazi i kao fajl
      </button>
    </div>
  );
}
