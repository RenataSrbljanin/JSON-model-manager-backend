import { useEffect, useState } from "react";
import { getInstalledSoftwareByComputerId, updateInstalledSoftware } from "../api/installedSoftware";
import type { Software } from "../api/installedSoftware";
import InstalledSoftwareForm from "./InstalledSoftwareForm";
import { parseComputerIdn, generateComputerIdn } from "../utils/computer_idn_helpers";
import type { Computer } from "../types/computer";

type Props = {
  computer: Computer;
  onSubmit: (comp: Computer) => void;
  onChange: (updated: Computer) => void;
};

export default function ComputerForm({ computer, onSubmit, onChange }: Props) {
  const [formData, setFormData] = useState<Computer>(computer);
  const [installedSoftwareList, setInstalledSoftwareList] = useState<Software[]>([]);

  // Label nivo state-ovi
  const [labelLevel1, setLabelLevel1] = useState("");
  const [labelLevel2, setLabelLevel2] = useState("");
  const [labelLevel3, setLabelLevel3] = useState("");

  // Čuvamo originalni IDN da bismo mogli uporediti
  const [originalIdn, setOriginalIdn] = useState<string>(computer.idn);

  useEffect(() => {
    setFormData(computer);
    setOriginalIdn(computer.idn);

    try {
      const parsed = parseComputerIdn(computer.idn);
      setLabelLevel1(parsed.labelLevels[0] || "");
      setLabelLevel2(parsed.labelLevels[1] || "");
      setLabelLevel3(parsed.labelLevels[2] || "");
    } catch (err) {
      console.warn("Nevalidan IDN:", err);
    }

    async function fetchSoftware() {
      try {
        const software = await getInstalledSoftwareByComputerId(computer.idn);
        setInstalledSoftwareList(software);
      } catch (error) {
        console.error("Greška pri učitavanju softvera:", error);
      }
    }

    fetchSoftware();
  }, [computer]);

  // Ažurira formData i poziva onChange
  const handleChange = (field: keyof Computer, value: any) => {
    let updated: Computer = { ...formData, [field]: value };

    // Ako se menja `idn`, proveravamo da li se razlikuje od originalnog
    if (field === "idn" && value !== originalIdn) {
      updated = { ...updated, previous_idn: originalIdn };
    }

    setFormData(updated);
    onChange(updated);
  };

  // Ažurira labelLevels i računa novi IDN
  const updateLabelLevel = (level: 1 | 2 | 3, value: string) => {
    const newLevels = [labelLevel1, labelLevel2, labelLevel3];
    newLevels[level - 1] = value;

    if (level === 1) setLabelLevel1(value);
    if (level === 2) setLabelLevel2(value);
    if (level === 3) setLabelLevel3(value);

    const parsed = parseComputerIdn(formData.idn);
    const newIdn = generateComputerIdn(newLevels, parsed.deviceIndex, parsed.networkIdn, parsed.suffix);

    handleChange("idn", newIdn);
  };

  return (
    <div>
      <h2>Izmena računara: {formData.idn}</h2>

      <label>Label Level 1:</label>
      <select value={labelLevel1} onChange={(e) => updateLabelLevel(1, e.target.value)}>
        <option value="">--Izaberi--</option>
        <option value="finance">finance</option>
        <option value="developer">developer</option>
        <option value="None">None</option>
      </select>

      <label>Label Level 2:</label>
      <select value={labelLevel2} onChange={(e) => updateLabelLevel(2, e.target.value)}>
        <option value="">--Izaberi--</option>
        <option value="internal">internal</option>
        <option value="external">external</option>
        <option value="windows">windows</option>
        <option value="banking">banking</option>
      </select>

      <label>Label Level 3:</label>
      <select value={labelLevel3} onChange={(e) => updateLabelLevel(3, e.target.value)}>
        <option value="">--Izaberi--</option>
        <option value="senior">senior</option>
        <option value="junior">junior</option>
        <option value="internal">internal</option>
      </select>

      {/* Ovde možeš dodati i ostala polja kao što su network, quota, note, itd. */}

      <button onClick={() => onSubmit(formData)} type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Sačuvaj računar
      </button>
    </div>
  );
}
