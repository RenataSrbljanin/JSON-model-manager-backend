import { render, fireEvent } from "@testing-library/react";
import ComputerForm from "../components/ComputerForm";
import { describe, test, expect, vi } from "vitest";

test("updates quota on input change", () => {
  const mockComputer = {
    idn: "comp-1",
    data: ["x"],
    installed_software_idns: [],
    stored_credentials: [],
    software_data_links: {},
    software_idn_mapping: {},
    network_idn: [1],
    provides_hardware_quota: 100,
    used_hardware_quota: 20,
  };

  const handleSubmit = vi.fn();

  const { getByLabelText, getByText } = render(
    <ComputerForm computer={mockComputer} onSubmit={handleSubmit} />
  );

  fireEvent.change(getByLabelText(/Provides Hardware Quota/i), {
    target: { value: "120" },
  });

  fireEvent.click(getByText(/Save/i));

  expect(handleSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ provides_hardware_quota: 120 })
  );
});
