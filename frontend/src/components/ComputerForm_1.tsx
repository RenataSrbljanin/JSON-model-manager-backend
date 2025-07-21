import { useEffect, useState } from "react";
import { getInstalledSoftwareByComputerId,updateInstalledSoftware,} from "../api/installedSoftware";
import type { InstalledSoftware } from "../api/installedSoftware";
import InstalledSoftwareForm from "./InstalledSoftwareForm";
import { generateComputerIdn } from "../utils/computer_idn_helpers";
import type { Computer } from "../types/computer";
import { parseComputerIdn } from "../utils/computer_idn_helpers";

type Props = {
  computer: Computer;
  onSubmit: (comp: Computer) => void;
  onChange: (updated: Computer) => void;
};

export default function ComputerForm({ computer, onSubmit, onChange }: Props) {
  const [formData, setFormData] = useState<Computer>(computer);
  //lokalni state za nivoe label-a:
  const [labelLevel1, setLabelLevel1] = useState("");
  const [labelLevel2, setLabelLevel2] = useState("");
  const [labelLevel3, setLabelLevel3] = useState("");
  const [installedSoftwareList, setInstalledSoftwareList] = useState<InstalledSoftware[]>([]);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState<string | null>(null);
  const [previousIdn, setPreviousIdn] = useState<string>(computer.idn);

  useEffect(() => {
    setFormData(computer);
    setPreviousIdn(computer.idn); // osveži kada se učita novi computer

    // učitavanje početnih vrednosti labelLevelX iz IDN-a
    try {
      const parsed = parseComputerIdn(computer.idn);
      setLabelLevel1(parsed.labelLevels[0] || "");
      setLabelLevel2(parsed.labelLevels[1] || "");
      setLabelLevel3(parsed.labelLevels[2] || "");
      // setDeviceIndex(parsed.deviceIndex);
      // setNetworkIdn(parsed.networkIdn);
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

  // // Provera da li je IDN definisan
  // useEffect(() => {
  //   if (computer?.idn) {
  //     try {
  //       const parsed = parseComputerIdn(computer.idn || "");
  //       const label = parsed.labelLevels.join(":");

  //       setLabelLevel1(parsed.labelLevels[0] || "");
  //       setLabelLevel2(parsed.labelLevels[1] || "");
  //       setLabelLevel3(parsed.labelLevels[2] || "");
  //       // setDeviceIndex(parsed.deviceIndex);
  //       // setNetworkIdn(parsed.networkIdn);

  //       setFormData({
  //         ...computer,
  //         label,
  //       });
  //     } catch (error) {
  //       console.error("Greška pri parsiranju IDN-a:", error);
  //     }
  //   }
  // }, [computer.idn]);

  const selectedSoftware = installedSoftwareList.find((s) => s.idn === selectedSoftwareId);

  const handleChange = (field: keyof Computer, value: any) => {
    let updated: Computer = { ...formData, [field]: value } as Computer;

    // // Ako se menja `idn`, proveravamo da li se razlikuje od originalnog
    // if (field === "idn" && value !== originalIdn) {
    //   updated = { ...updated, previous_idn: originalIdn };
    // }
    // // Ako su svi delovi potrebni za IDN dostupni, ažuriraj idn
    // const labelLevels = updated.label?.split(":").map((part) => part.trim()) ?? [];
    // const deviceIndex = updated.device_index;
    // const networkIdn = updated.network_idn?.[0];
    // const suffix = updated.suffix;

    // if (labelLevels.length && typeof deviceIndex === "number" && typeof networkIdn === "number") {
    //   updated.idn = generateComputerIdn(labelLevels, deviceIndex, networkIdn, suffix);

    setFormData(updated);
    onChange(updated);
  };

  // ⬇️ ažurira labelLevels i ceo idn
  const updateLabelLevel = (level: 1 | 2 | 3, value: string) => {
    const newLevels = [labelLevel1, labelLevel2, labelLevel3];
    newLevels[level - 1] = value;

    if (level === 1) setLabelLevel1(value);
    if (level === 2) setLabelLevel2(value);
    if (level === 3) setLabelLevel3(value);

    const parsed = parseComputerIdn(formData.idn);
    const newIdn = generateComputerIdn(newLevels, parsed.deviceIndex, parsed.networkIdn, parsed.suffix);

    // dodaj i previous_idn samo ako se IDN promeni
    if (newIdn !== formData.idn) {
      setPreviousIdn(formData.idn); // zapamti staru vrednost
      handleChange("idn", newIdn);
    } else {
      handleChange("idn", newIdn);
    }
  };
  // azurira Software
  const handleSoftwareUpdate = async (updated: InstalledSoftware) => {
    try {
      await updateInstalledSoftware(updated.idn, updated);
      const updatedList = installedSoftwareList.map((s) => (s.idn === updated.idn ? updated : s));
      setInstalledSoftwareList(updatedList);
    } catch (error) {
      console.error("Greška pri ažuriranju softvera:", error);
    }
  };
  const handleSubmit = () => {
    const dataToSubmit = {
      ...formData,
      previous_idn: previousIdn, // šaljemo i prethodni IDN
    };
    onSubmit(dataToSubmit);
  };
  return (
    <div className="space-y-4">
      <form
        key={computer.idn}
        onSubmit={(e) => {
          e.preventDefault();
       //   onSubmit(formData);
          handleSubmit();
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
        <div>
          {/* Label Level 1 */}
          <label>Label Level 1:</label>
          <select value={labelLevel1} onChange={(e) => updateLabelLevel(1, e.target.value)}>
            <option value="">--Izaberi--</option>
            <option value="finance">finance</option>
            <option value="developer">developer</option>
            <option value="None">None</option>
          </select>

          {/* Label Level 2 */}
          <label>Label Level 2:</label>
          <select value={labelLevel2} onChange={(e) => updateLabelLevel(2, e.target.value)}>
            <option value="">--Izaberi--</option>
            <option value="internal">internal</option>
            <option value="external">external</option>
            <option value="windows">windows</option>
            <option value="banking">banking</option>
          </select>

          {/* Label Level 3 */}
          <label>Label Level 3:</label>
          <select value={labelLevel3} onChange={(e) => updateLabelLevel(3, e.target.value)}>
            <option value="">--Izaberi--</option>
            <option value="senior">senior</option>
            <option value="junior">junior</option>
            <option value="internal">internal</option>
          </select>
        </div>
        {/* Network IDN */}
        <label>Network IDN:</label>
        <select
          value={formData.network_idn?.[0] ?? ""}
          onChange={(e) => {
            const newNetwork = Number(e.target.value);
            handleChange("network_idn", [newNetwork]);
          }}
        >
          <option value="">--Izaberi mrežu--</option>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>

        {/* Device Index */}
        <label>Device Index:</label>
        <input type="number" value={formData.device_index ?? ""} onChange={(e) => handleChange("device_index", Number(e.target.value))} />

        {/* Suffix (opcionalan) */}
        <label>Suffix:</label>
        <input type="text" value={formData.suffix ?? ""} onChange={(e) => handleChange("suffix", e.target.value)} placeholder="npr. #1" />
        {/* prikaz trenutne vrednosti IDN */}
        <div style={{ marginTop: "1rem", fontWeight: "bold" }}>IDN: {formData.idn}</div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Provides Hardware Quota:</label>
          <input
            type="number"
            className="border px-2 py-1 rounded"
            value={formData.provides_hardware_quota}
            onChange={(e) => handleChange("provides_hardware_quota", parseFloat(e.target.value))}
          />
        </div>

      </form>

      {/* Softver sekcija */}
      <div className="mt-6">
        <h4 className="text-md font-semibold">Instalirani softver:</h4>
        <select className="border rounded px-2 py-1 mt-2" onChange={(e) => setSelectedSoftwareId(e.target.value)} value={selectedSoftwareId ?? ""}>
          <option value="">-- Odaberi softver za editovanje --</option>
          {installedSoftwareList.map((sw) => (
            <option key={sw.idn} value={sw.idn}>
              {sw.idn}
            </option>
          ))}
        </select>

        {selectedSoftware && (
          <div className="border p-4 mt-4 rounded bg-gray-50 shadow-inner">
            <InstalledSoftwareForm software={selectedSoftware} onSubmit={handleSoftwareUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}
