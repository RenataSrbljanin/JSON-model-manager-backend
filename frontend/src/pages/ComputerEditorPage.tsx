import { useState, useEffect } from "react";
import ComputerForm from "../components/ComputerForm";
import InstalledSoftwareForm from "../components/InstalledSoftwareForm";
import { getComputerById, updateComputer } from "../api/computers";
import {
  getInstalledSoftwareByComputerId,
  updateInstalledSoftware,
} from "../api/installedSoftware";
import type { Computer } from "../api/computers"; //"../output_models";
import type { InstalledSoftware } from "../api/installedSoftware";

export default function ComputerEditorPage({ idn }: { idn: string }) {
  const [computer, setComputer] = useState<Computer | null>(null);
  const [softwareList, setSoftwareList] = useState<InstalledSoftware[]>([]);

  useEffect(() => {
    async function fetchData() {
      const comp = await getComputerById(idn);
      setComputer(comp);

      const installed = await getInstalledSoftwareByComputerId(idn);
      setSoftwareList(installed);
    }
    fetchData();
  }, [idn]);

  const handleComputerUpdate = async (updated: Computer) => {
    await updateComputer(updated.idn, updated);
    alert("Computer updated");
  };

  const handleSoftwareUpdate = async (updatedSoftware: InstalledSoftware) => {
    await updateInstalledSoftware(updatedSoftware.idn, updatedSoftware);
    alert("Software updated");
  };

  if (!computer) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Editing Computer: {idn}</h2>

      <div className="bg-white shadow-md rounded p-4 mb-6">
        <ComputerForm computer={computer} onSubmit={handleComputerUpdate} />
      </div>

      <div className="space-y-6">
        {softwareList.map((s) => (
          <div key={s.idn} className="bg-white shadow rounded p-4">
            <InstalledSoftwareForm
              software={s}
              onSubmit={handleSoftwareUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
