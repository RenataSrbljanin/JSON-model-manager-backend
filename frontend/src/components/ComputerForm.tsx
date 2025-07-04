// components/ComputerForm.tsx
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
    >
      <h3>Edit Computer: {formData.idn}</h3>
      <label>
        Data:
        <input
          type="text"
          value={formData.data.join(",")}
          onChange={(e) => handleChange("data", e.target.value.split(","))}
        />
      </label>
      <label>
        Provides Hardware Quota:
        <input
          type="number"
          value={formData.provides_hardware_quota}
          onChange={(e) =>
            handleChange("provides_hardware_quota", parseFloat(e.target.value))
          }
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
