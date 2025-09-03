import { useEffect, useState } from "react";
// Uklanjamo import za getInstalledSoftwareByComputerId i updateInstalledSoftware_with_constant_computerIDN
// jer se softverom upravlja u roditeljskoj komponenti
import type { Software } from "../types/software";
import InstalledSoftwareForm from "./InstalledSoftwareForm";
import { generateComputerIdn, parseComputerIdn } from "../utils/computer_idn_helpers";
import type { Computer } from "../types/computer";

// Ažuriran tip Props da uključuje softwareList i onSoftwareUpdate
type Props = {
    computer: Computer;
    softwareList: Software[]; // Lista softvera je sada prop
    onChange: (updated: Computer) => void;
    onSoftwareUpdate: (currentIdn: string, newIdn: string, software: Partial<Software>) => Promise<any>;
};

export default function ComputerForm({ computer, softwareList, onChange, onSoftwareUpdate }: Props) {
    const [formData, setFormData] = useState<Computer>(computer);
    // lokalni state za nivoe label-a:
    const [labelLevel1, setLabelLevel1] = useState("");
    const [labelLevel2, setLabelLevel2] = useState("");
    const [labelLevel3, setLabelLevel3] = useState("");
    const [device_index, setDeviceIndex] = useState<number | undefined>(undefined);
    const [selectedSoftwareId, setSelectedSoftwareId] = useState<string | null>(null);

    useEffect(() => {
        setFormData(computer);

        // učitavanje početnih vrednosti labelLevelX iz IDN-a
        try {
            const parsed = parseComputerIdn(computer.idn);
            setLabelLevel1(parsed.labelLevels[0] || "");
            setLabelLevel2(parsed.labelLevels[1] || "");
            setLabelLevel3(parsed.labelLevels[2] || "");
            setDeviceIndex(parsed.deviceIndex);
        } catch (err) {
            console.warn("Nevalidan IDN:", err);
        }
    }, [computer]);

    const selectedSoftware = softwareList.find((s) => s.idn === selectedSoftwareId);

    const handleChange = (field: keyof Computer, value: any) => {
        let updated: Computer = { ...formData, [field]: value } as Computer;
        setFormData(updated);
        onChange(updated);
    };
    const handleChange_some = (updates: Partial<Computer>) => {
        let updated: Computer = { ...formData, ...updates };
        setFormData(updated);
        onChange(updated);
    };
    // ⬇ ažurira labelLevels i ceo idn
    const updateLabelLevel = (level: 1 | 2 | 3, value: string) => {
        const newLevels = [labelLevel1, labelLevel2, labelLevel3];
        newLevels[level - 1] = value;

        if (level === 1) setLabelLevel1(value);
        if (level === 2) setLabelLevel2(value);
        if (level === 3) setLabelLevel3(value);

        // Moramo osigurati da se parsira trenutni formData.idn
        const parsed = parseComputerIdn(formData.idn);
        const newIdn = generateComputerIdn(newLevels, parsed.deviceIndex, parsed.networkIdn, parsed.suffix);

        // U ovoj komponenti samo ažuriramo lokalni state i obaveštavamo roditelja
        handleChange("idn", newIdn);
    };

    // ⬇️ ažurira device_index i ceo idn
    const updateDeviceIndex = (device_index_string: string) => {
        let device_index = Number(device_index_string);
        if (!isNaN(device_index)) {
            const parsed = parseComputerIdn(formData.idn);
            const newIdn = generateComputerIdn(parsed.labelLevels, device_index, parsed.networkIdn, parsed.suffix);
            handleChange("idn", newIdn);
        }
    };

    // ⬇️ ažurira network_idn_string i ceo idn
    const updateNetworkIDN = (network_idn_string: string) => {
        let newNetwork = Number(network_idn_string);
        if (!isNaN(newNetwork)) {
            const parsed = parseComputerIdn(formData.idn);
            const newIdn = generateComputerIdn(parsed.labelLevels, parsed.deviceIndex, newNetwork, parsed.suffix);
            handleChange_some({
                network_idn: [newNetwork],
                idn: newIdn
            });
        //    handleChange("idn", newIdn);
        }
    };

    return (
        <div className="space-y-4">
            <form
                key={computer.idn}
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="space-y-4"
            >
                <h3 className="text-lg font-semibold">Uređivanje računara: {formData.idn}</h3>

                <div className="flex flex-col">
                    <label htmlFor="inputForData" className="mb-1 font-medium" >Data:</label>
                    <input
                        id="inputForData"
                        type="text"
                        className="border px-2 py-1 rounded"
                        value={formData.data.join(",")}
                        onChange={(e) => handleChange("data", e.target.value.split(","))}
                    />
                </div>
                <div>
                    {/* Label Level 1 */}
                    <label htmlFor="level1_input">Label Level 1:</label>
                    <select id="level1_input" value={labelLevel1} onChange={(e) => updateLabelLevel(1, e.target.value)}>
                        <option value="">--Izaberi--</option>
                        <option value="finance">finance</option>
                        <option value="developer">developer</option>
                        <option value="None">None</option>
                    </select>

                    {/* Label Level 2 */}
                    <label htmlFor="level2_input">Label Level 2:</label>
                    <select id="level2_input" value={labelLevel2} onChange={(e) => updateLabelLevel(2, e.target.value)}>
                        <option value="">--Izaberi--</option>
                        <option value="internal">internal</option>
                        <option value="external">external</option>
                        <option value="windows">windows</option>
                        <option value="banking">banking</option>
                    </select>

                    {/* Label Level 3 */}
                    <label htmlFor="level3_input">Label Level 3:</label>
                    <select id="level3_input" value={labelLevel3} onChange={(e) => updateLabelLevel(3, e.target.value)}>
                        <option value="">--Izaberi--</option>
                        <option value="senior">senior</option>
                        <option value="junior">junior</option>
                        <option value="internal">internal</option>
                    </select>
                </div>

                {/* Device Index */}
                <label htmlFor="device_index_input">Device Index:</label>
                <input id="device_index_input" type="number" value={device_index ?? ""} onChange={(e) => updateDeviceIndex(e.target.value)} />
                <br />
                {/* Network IDN */}
                <label htmlFor="network_idn_input">Network IDN:</label>
                <select
                    id="network_idn_input"
                    value={formData.network_idn?.[0] ?? ""}
                    onChange={(e) => updateNetworkIDN(e.target.value)}
                >
                    <option value="">-- mrežu--</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
                <br />
                {/* Suffix (opcionalan) */}
                <label htmlFor="suffix_input">Suffix:</label>
                <input id="suffix_input" type="text" value={formData.suffix ?? ""} onChange={(e) => handleChange("suffix", e.target.value)} placeholder="npr. #1" />
                {/* prikaz trenutne vrednosti IDN */}
                <div style={{ marginTop: "1rem", fontWeight: "bold" }}>IDN: {formData.idn}</div>

                <div className="flex flex-col">
                    <label htmlFor="Provides_Hardware_Quota_input" className="mb-1 font-medium">Provides Hardware Quota:</label>
                    <input
                        id="Provides_Hardware_Quota_input"
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
                <select id="select_sw_input" className="border rounded px-2 py-1 mt-2" onChange={(e) => setSelectedSoftwareId(e.target.value)} value={selectedSoftwareId ?? ""}>
                    <option value="">-- Odaberi softver za editovanje --</option>
                    {softwareList.map((sw) => (
                        <option key={sw.idn} value={sw.idn}>
                            {sw.idn}
                        </option>
                    ))}
                </select>

                {selectedSoftware && (
                    <div className="border p-4 mt-4 rounded bg-gray-50 shadow-inner">
                        <InstalledSoftwareForm software={selectedSoftware} onSubmit={(updatedSoftware) => onSoftwareUpdate(updatedSoftware.idn, formData.idn, updatedSoftware)} />
                    </div>
                )}
            </div>
        </div>
    );
}
