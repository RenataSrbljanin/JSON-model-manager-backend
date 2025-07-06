import { render, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import InstalledSoftwareForm from "../components/InstalledSoftwareForm";

describe("InstalledSoftwareForm", () => {
  test("prevents editing computer_idn", () => {
    const mockSoftware = {
      idn: "soft-1",
      idn_variant: "variant-a",
      cpe_idn: "cpe-1",
      computer_idn: "comp-1",
      compatible_data_types: [],
      accepts_credentials: [],
      local_dependencies: [],
      network_dependencies: [],
      network_idn: [],
      installed_combination: [],
      provides_services: [],
      provides_network_services: [],
      provides_user_services: [],
      max_client_count: 10,
      requires_hardware_quota: 1,
      requires_hardware_quota_per_client: 0.5,
      is_database: false,
      hardware_ids: [],
      person_group_id: null,
      person_index: 0,
      network_clients: [],
      network_servers: [],
    };

    const handleSubmit = vi.fn();

    const { getByText, getByLabelText } = render(
      <InstalledSoftwareForm software={mockSoftware} onSubmit={handleSubmit} />
    );

    // Verify computer_idn is displayed and not editable
    const cidnDisplay = getByText((content) =>
      content.startsWith("Computer IDN:")
    );
    expect(cidnDisplay).toHaveTextContent("Computer IDN: comp-1");

    // Simulate form update
    fireEvent.change(getByLabelText(/Variant/i), {
      target: { value: "variant-b" },
    });

    fireEvent.click(getByText(/Save/i));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        idn_variant: "variant-b",
        computer_idn: "comp-1", // stays the same
      })
    );
  });
});
