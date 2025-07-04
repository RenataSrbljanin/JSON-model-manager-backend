// components/InstalledSoftwareForm.tsx
import { useState } from "react";

type InstalledSoftware = {
  idn: string;
  idn_variant: string;
  cpe_idn: string;
  computer_idn: string;
  compatible_data_types: string[];
  accepts_credentials: string[];
  local_dependencies: string[];
  network_dependencies: string[];
  network_idn: number[];
  installed_combination: [string, "L" | "N"][];
  provides_services: string[];
  provides_network_services: string[];
  provides_user_services: string[];
  max_client_count: number;
  requires_hardware_quota: number;
  requires_hardware_quota_per_client: number;
  is_database: boolean | string;
  hardware_ids: string[];
  person_group_id: string | null;
  person_index: number;
  network_clients: string[];
  network_servers: string[];
};

type Props = {
  software: InstalledSoftware;
  onSubmit: (s: InstalledSoftware) => void;
};

export default function InstalledSoftwareForm({ software, onSubmit }: Props) {
  const [formData, setFormData] = useState(software);

  const handleChange = (field: keyof InstalledSoftware, value: any) => {
    if (field === "computer_idn") return; // prevent change
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <h3>Edit Software: {formData.idn}</h3>
      {/* <div>
        <strong>Computer IDN:</strong> {formData.computer_idn}
      </div> */}
      <div>Computer IDN: {formData.computer_idn}</div>

      <label>
        Variant:
        <input
          type="text"
          value={formData.idn_variant}
          onChange={(e) => handleChange("idn_variant", e.target.value)}
        />
      </label>
      {/* Add more fields here as needed */}
      <button type="submit">Save</button>
    </form>
  );
}
