import { useState, useEffect } from "react";
import { getDataLinksBySoftwareId } from "../api/softwareDataLinks";
import { getSuggestions } from "../api/suggestions";
import type { Suggestions } from "../api/suggestions";
import type { InstalledSoftware } from "../api/installedSoftware";

type Props = {
  software: InstalledSoftware;
  onSubmit: (s: InstalledSoftware) => void;
};

export default function InstalledSoftwareForm({ software, onSubmit }: Props) {
  const [formData, setFormData] = useState(software);
  const [dataLinks, setDataLinks] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);

  // Učitaj linkovane tipove podataka
  useEffect(() => {
    async function fetchLinks() {
      try {
        const links = await getDataLinksBySoftwareId(software.idn);
        setDataLinks(links.map((l: any) => l.data_type_id));
      } catch (error) {
        console.error("Greška pri učitavanju data links:", error);
      }
    }
    fetchLinks();
  }, [software.idn]);

  // Učitaj sugestije za dropdown menije
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const data = await getSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Greška pri učitavanju sugestija:", error);
      }
    }
    fetchSuggestions();
  }, []);

  const handleChange = (field: keyof InstalledSoftware, value: any) => {
    if (field === "computer_idn") return;
    setFormData({ ...formData, [field]: value });
  };

  if (!suggestions) return <div>Loading suggestions...</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold mb-2">Softver: {formData.idn}</h3>

      <div className="text-sm text-gray-600">
        <strong>Data Types Linked:</strong>{" "}
        {dataLinks.length > 0 ? dataLinks.join(", ") : "None"}
      </div>

      <div className="text-sm text-gray-700">
        <strong>Computer IDN:</strong> {formData.computer_idn}
      </div>

      {/* Person Group */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Person Group:</label>
        <select
          className="border rounded px-2 py-1"
          value={formData.person_group_id ?? ""}
          onChange={(e) => handleChange("person_group_id", e.target.value)}
        >
          <option value="">--Select--</option>
          {Array.isArray(suggestions.person_group_ids) &&
            suggestions.person_group_ids.map((pgid) => (
              <option key={pgid} value={pgid}>
                {pgid}
              </option>
            ))}
        </select>
      </div>

      {/* Hardware IDs */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Hardware IDs:</label>
        <select
          // multiple
          className="border rounded px-2 py-1"
          value={formData.hardware_ids ?? []}
          onChange={(e) =>
            handleChange(
              "hardware_ids",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {Array.isArray(suggestions.hardware_ids) &&
            suggestions.hardware_ids.map((hid) => (
              <option key={hid} value={hid}>
                {hid}
              </option>
            ))}
        </select>
      </div>

      {/* Accepts Credentials */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Accepts Credentials:</label>
        <select
          // multiple
          className="border rounded px-2 py-1"
          value={formData.accepts_credentials ?? []}
          onChange={(e) =>
            handleChange(
              "accepts_credentials",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {Array.isArray(suggestions.credential_ids) &&
            suggestions.credential_ids.map((cid) => (
              <option key={cid} value={cid}>
                {cid}
              </option>
            ))}
        </select>
      </div>

      {/* Network IDNs */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Network IDNs:</label>
        <select
          // multiple
          className="border rounded px-2 py-1"
          value={(formData.network_idn ?? []).map(String)}
          onChange={(e) =>
            handleChange(
              "network_idn",
              Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
            )
          }
        >
          {Array.isArray(suggestions.network_idns) &&
            suggestions.network_idns.map((nid) => (
              <option key={nid} value={nid}>
                {nid}
              </option>
            ))}
        </select>
      </div>

      {/* IDN Variant */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Variant:</label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          value={formData.idn_variant ?? ""}
          onChange={(e) => handleChange("idn_variant", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sačuvaj softver
      </button>
    </form>
  );
}
