import { useState } from "react";

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

  const handleChange = (field: keyof Computer, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Edit Computer: {formData.idn}</h3>

      <div>
        <label className="block font-medium">Data (comma-separated):</label>
        <input
          type="text"
          className="border px-2 py-1 rounded w-full"
          value={formData.data.join(",")}
          onChange={(e) => handleChange("data", e.target.value.split(","))}
        />
      </div>

      <div>
        <label className="block font-medium">
          Stored Credentials (comma-separated):
        </label>
        <input
          type="text"
          className="border px-2 py-1 rounded w-full"
          value={formData.stored_credentials.join(",")}
          onChange={(e) =>
            handleChange("stored_credentials", e.target.value.split(","))
          }
        />
      </div>

      <div>
        <label className="block font-medium">
          Network IDNs (comma-separated):
        </label>
        <input
          type="text"
          className="border px-2 py-1 rounded w-full"
          value={formData.network_idn.join(",")}
          onChange={(e) =>
            handleChange(
              "network_idn",
              e.target.value.split(",").map((x) => Number(x))
            )
          }
        />
      </div>

      <div>
        <label className="block font-medium">Provides Hardware Quota:</label>
        <input
          type="number"
          className="border px-2 py-1 rounded w-full"
          value={formData.provides_hardware_quota}
          onChange={(e) =>
            handleChange("provides_hardware_quota", parseFloat(e.target.value))
          }
        />
      </div>

      <div>
        <label className="block font-medium">Used Hardware Quota:</label>
        <input
          type="number"
          className="border px-2 py-1 rounded w-full"
          value={formData.used_hardware_quota}
          onChange={(e) =>
            handleChange("used_hardware_quota", parseFloat(e.target.value))
          }
        />
      </div>

      <div>
        <label className="block font-medium">Software IDN Mapping:</label>
        <textarea
          className="border px-2 py-1 rounded w-full"
          rows={3}
          value={JSON.stringify(formData.software_idn_mapping, null, 2)}
          onChange={(e) =>
            handleChange("software_idn_mapping", JSON.parse(e.target.value))
          }
        />
      </div>

      <div>
        <label className="block font-medium">Software Data Links:</label>
        <textarea
          className="border px-2 py-1 rounded w-full"
          rows={3}
          value={JSON.stringify(formData.software_data_links, null, 2)}
          onChange={(e) =>
            handleChange("software_data_links", JSON.parse(e.target.value))
          }
        />
      </div>

      <div className="text-sm text-gray-600">
        Installed Software IDNs:{" "}
        {formData.installed_software_idns.length > 0
          ? formData.installed_software_idns.join(", ")
          : "None"}
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sačuvaj računar
      </button>
    </form>
  );
}
