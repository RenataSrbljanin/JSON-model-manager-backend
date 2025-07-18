import { useEffect, useState } from "react";
import {
  getInstalledSoftwareByComputerId,
  updateInstalledSoftware,
} from "../api/installedSoftware";
import type { InstalledSoftware } from "../api/installedSoftware";
import InstalledSoftwareForm from "./InstalledSoftwareForm";

type Computer = {
  idn: string;
  data: string[];
  installed_software_idns: string[];
  stored_credentials: string[];
  software_data_links: Record<string, string[]>;
  software_idn_mapping: Record<string, string>;
  network_idn: number[];
  provides_hardware_quota: number;
  used_hardware_quota: number;
};

type Props = {
  computer: Computer;
  onSubmit: (comp: Computer) => void;
};

export default function ComputerForm({ computer, onSubmit }: Props) {
  const [formData, setFormData] = useState(computer);
  const [installedSoftwareList, setInstalledSoftwareList] = useState<
    InstalledSoftware[]
  >([]);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchSoftware() {
      try {
        const software = await getInstalledSoftwareByComputerId(computer.idn);
        setInstalledSoftwareList(software);
      } catch (error) {
        console.error("Greška pri učitavanju softvera:", error);
      }
    }
    fetchSoftware();
  }, [computer.idn]);

  const selectedSoftware = installedSoftwareList.find(
    (s) => s.idn === selectedSoftwareId
  );

  const handleChange = (field: keyof Computer, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSoftwareUpdate = async (updated: InstalledSoftware) => {
    try {
      await updateInstalledSoftware(updated.idn, updated);
      const updatedList = installedSoftwareList.map((s) =>
        s.idn === updated.idn ? updated : s
      );
      setInstalledSoftwareList(updatedList);
    } catch (error) {
      console.error("Greška pri ažuriranju softvera:", error);
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Edit Computer: {formData.idn}</h3>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Data:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={formData.data.join(",")}
            onChange={(e) => handleChange("data", e.target.value.split(","))}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Provides Hardware Quota:</label>
          <input
            type="number"
            className="border px-2 py-1 rounded"
            value={formData.provides_hardware_quota}
            onChange={(e) =>
              handleChange(
                "provides_hardware_quota",
                parseFloat(e.target.value)
              )
            }
          />
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sačuvaj računar
        </button>
      </form>

      {/* Softver sekcija */}
      <div className="mt-6">
        <h4 className="text-md font-semibold">Instalirani softver:</h4>
        <select
          className="border rounded px-2 py-1 mt-2"
          onChange={(e) => setSelectedSoftwareId(e.target.value)}
          value={selectedSoftwareId ?? ""}
        >
          <option value="">-- Odaberi softver za editovanje --</option>
          {installedSoftwareList.map((sw) => (
            <option key={sw.idn} value={sw.idn}>
              {sw.idn}
            </option>
          ))}
        </select>

        {selectedSoftware && (
          <div className="border p-4 mt-4 rounded bg-gray-50 shadow-inner">
            <InstalledSoftwareForm
              software={selectedSoftware}
              onSubmit={handleSoftwareUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
