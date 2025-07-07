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

  // Fetch data links
  useEffect(() => {
    async function fetchLinks() {
      const links = await getDataLinksBySoftwareId(software.idn);
      setDataLinks(links.map((l: any) => l.data_type_id));
    }
    fetchLinks();
  }, [software.idn]);

  // Fetch suggestions for dropdowns
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const data = await getSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    }
    fetchSuggestions();
  }, []);

  const handleChange = (field: keyof InstalledSoftware, value: any) => {
    if (field === "computer_idn") return; // prevent change
    setFormData({ ...formData, [field]: value });
  };

  if (!suggestions) {
    return <div>Loading suggestions...</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <h3>Edit Software: {formData.idn}</h3>

      <div>
        <strong>Data Types Linked:</strong>{" "}
        {dataLinks.length > 0 ? dataLinks.join(", ") : "None"}
      </div>

      <div>Computer IDN: {formData.computer_idn}</div>

      <label>
        Person Group:
        <select
          value={formData.person_group_id ?? ""}
          onChange={(e) => handleChange("person_group_id", e.target.value)}
        >
          <option value="">--Select--</option>
          {suggestions.person_group_ids.map((pgid) => (
            <option key={pgid} value={pgid}>
              {pgid}
            </option>
          ))}
        </select>
      </label>

      <label>
        Hardware IDs:
        <select
          multiple
          value={formData.hardware_ids}
          onChange={(e) =>
            handleChange(
              "hardware_ids",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {suggestions.hardware_ids.map((hid) => (
            <option key={hid} value={hid}>
              {hid}
            </option>
          ))}
        </select>
      </label>
      <label>
        Accepts Credentials:
        <select
          multiple
          value={formData.accepts_credentials}
          onChange={(e) =>
            handleChange(
              "accepts_credentials",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {suggestions.credential_ids.map((cid) => (
            <option key={cid} value={cid}>
              {cid}
            </option>
          ))}
        </select>
      </label>
      <label>
        Network IDNs:
        <select
          multiple
          value={formData.network_idn.map(String)}
          onChange={(e) =>
            handleChange(
              "network_idn",
              Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
            )
          }
        >
          {suggestions.network_idns.map((nid) => (
            <option key={nid} value={nid}>
              {nid}
            </option>
          ))}
        </select>
      </label>

      <label>
        Variant:
        <input
          type="text"
          value={formData.idn_variant}
          onChange={(e) => handleChange("idn_variant", e.target.value)}
        />
      </label>

      <button type="submit">Save</button>
    </form>
  );
}
