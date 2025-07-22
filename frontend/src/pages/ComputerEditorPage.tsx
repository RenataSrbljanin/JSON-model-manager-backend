import { useState, useEffect } from "react";
import ComputerForm from "../components/ComputerForm_1";
import InstalledSoftwareForm from "../components/InstalledSoftwareForm";
import { getComputerById, updateComputer } from "../api/computers";
import {
  getInstalledSoftwareByComputerId,
  updateInstalledSoftware,
} from "../api/installedSoftware";
import type { Computer as BaseComputer } from "../types/computer";
type Computer = BaseComputer & { previous_idn?: string };
import type { InstalledSoftware } from "../api/installedSoftware";
import axios from "axios";
import { normalizeInstalledSoftware } from "../utils/normalizeInstalledSoftware";

export default function ComputerEditorPage({ idn }: { idn: string }) {
  const [computer, setComputer] = useState<Computer | null>(null);
  const [softwareList, setSoftwareList] = useState<InstalledSoftware[]>([]);
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
  console.log("Šaljem PUT za:", previous_idn); // linija 53
  console.log("Podaci koje šaljem:", updated); // linija 54

  const { previous_idn: _, ...dataToSend } = updated; // ✅ izbegnut konflikt
  await updateComputer(previous_idn, dataToSend);
  alert("Computer updated"); // linija 56
};


  const handleSoftwareUpdate = async (updatedSoftware: InstalledSoftware) => {
    await updateInstalledSoftware(updatedSoftware.idn, updatedSoftware);
    alert("Software updated");
  };
  const handleSave = async (modifiedData: any) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/save",
        modifiedData
      );
      alert(`Uspešno sačuvano: ${response.data.filename}`);
    } catch (error) {
      console.error("Greška pri snimanju:", error);
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
          await handleComputerUpdate(computer); // snimi u bazu
          await handleSave({
            [computer.idn]: {
              ...computer,
              installed_software: Object.fromEntries(softwareList.map((s) => [s.idn, s])),
            },
          }); // snimi fajl
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-4"
      >
        Sačuvaj u bazi i kao fajl
      </button>
    </div>
  );
}
