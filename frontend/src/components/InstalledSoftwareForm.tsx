import { useState, useEffect } from "react";
import { getDataLinksBySoftwareId } from "../api/softwareDataLinks";
import { getSuggestions } from "../api/suggestions";
import type { Suggestions } from "../api/suggestions";
import type { Software } from "../types/software";

type Props = {
  software: Software;
  onSubmit: (s: Software) => void;
};

export default function InstalledSoftwareForm({ software, onSubmit }: Props) {
  const [formData, setFormData] = useState(software);
  const [dataLinks, setDataLinks] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [message, setMessage] = useState("");

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

  const handleChange = (field: keyof Software, value: any) => {
    if (field === "computer_idn") return;
    setFormData({ ...formData, [field]: value });
  };

  if (!suggestions) return <div>Loading suggestions...</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
        setMessage("✅ Softver uspešno sačuvan.");
        setTimeout(() => setMessage(""), 3000);
      }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold mb-2">Softver: {formData.idn}</h3>

      {message && <div className="text-green-600 font-medium">{message}</div>}

      <div className="text-sm text-gray-600">
        <strong>Data Types Linked:</strong>{" "}
        {dataLinks.length > 0 ? dataLinks.join(", ") : "None"}
      </div>

      <div className="text-sm text-gray-700">
        <strong>Computer IDN:</strong> {formData.computer_idn}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">IDN Variant:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.idn_variant ?? ""}
            onChange={(e) => handleChange("idn_variant", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">CPE IDN:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.cpe_idn}
            onChange={(e) => handleChange("cpe_idn", e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Hardware IDs:</label>
          <select
            className="border rounded px-2 py-1"
            value={formData.hardware_ids ?? []}
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
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Accepts Credentials:</label>
          <select
            className="border rounded px-2 py-1"
            value={formData.accepts_credentials ?? []}
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
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Network Clients:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.network_clients.join(",")}
            onChange={(e) =>
              handleChange(
                "network_clients",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Network Servers:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.network_servers.join(",")}
            onChange={(e) =>
              handleChange(
                "network_servers",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Provides Services:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.provides_services.join(",")}
            onChange={(e) =>
              handleChange(
                "provides_services",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Provides Network Services:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.provides_network_services.join(",")}
            onChange={(e) =>
              handleChange(
                "provides_network_services",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Provides User Services:</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={formData.provides_user_services.join(",")}
            onChange={(e) =>
              handleChange(
                "provides_user_services",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Person Group:</label>
          <select
            className="border rounded px-2 py-1"
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
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Person Index:</label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={formData.person_index}
            onChange={(e) =>
              handleChange("person_index", Number(e.target.value))
            }
            min={0}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Network IDNs:</label>
          <select
            className="border rounded px-2 py-1"
            value={(formData.network_idn ?? []).map(String)}
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
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Is Database:</label>
          <select
            className="border rounded px-2 py-1"
            value={String(formData.is_database)}
            onChange={(e) =>
              handleChange("is_database", e.target.value === "true")
            }
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Max Client Count:</label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={formData.max_client_count}
            onChange={(e) =>
              handleChange("max_client_count", parseInt(e.target.value))
            }
            min={0}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Requires Hardware Quota:</label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={formData.requires_hardware_quota}
            onChange={(e) =>
              handleChange(
                "requires_hardware_quota",
                parseFloat(e.target.value)
              )
            }
            min={0}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">
            Requires Hardware Quota Per Client:
          </label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={formData.requires_hardware_quota_per_client}
            onChange={(e) =>
              handleChange(
                "requires_hardware_quota_per_client",
                parseFloat(e.target.value)
              )
            }
            min={0}
          />
        </div>
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
