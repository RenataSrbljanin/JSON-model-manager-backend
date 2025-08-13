import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComputerEditorPage from "../pages/ComputerEditorPage_predlozeni";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockComputer = {
  idn: "comp-1",
  cpu: "Intel i5",
  ram: "8GB",
  os: "Windows 10",
  data: ["data1", "data2"],
  installed_software: {},
};

const mockSoftware = [
  {
    idn: "soft-1",
    computer_idn: "comp-1",
    name: "Chrome",
    version: "105.0",
    data_type_id: ["dt1"],
    dependencies: [],
  },
];

describe("ComputerEditorPage - Save JSON", () => {
  beforeEach(() => {
    // Mock GET
    mockedAxios.get.mockImplementation((url) => {
      if (url === "http://localhost:5000/api/computers/comp-1") {
        return Promise.resolve({ data: mockComputer });
      }
      if (
        url === "http://localhost:5000/api/installed-software/computer/comp-1"
      ) {
        return Promise.resolve({ data: mockSoftware });
      }
      if (url.includes("/software-data-links/by-software/")) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error(`Unknown GET URL: ${url}`));
    });

    // Mock POST
    mockedAxios.post.mockResolvedValue({
      data: { message: "File saved", filename: "modified_output_test.json" },
    });

    // Mock alert
    vi.stubGlobal("alert", vi.fn());
  });

  it("should send POST to /save with updated computer+software", async () => {
    render(<ComputerEditorPage idn="comp-1" />);

    // Čekaj da se učita podatak
    await screen.findByText((text) =>
      text.includes("Editing Computer: comp-1")
    );

    const saveButton = screen.getByRole("button", {
      name: /sačuvaj izmene fajla/i,
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5000/save",
        expect.objectContaining({
          "comp-1": expect.objectContaining({
            cpu: "Intel i5",
            ram: "8GB",
            os: "Windows 10",
            installed_software: expect.any(Object),
          }),
        })
      );
    });
  });

  it("should show alert if save (POST) fails", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Server error"));

    render(<ComputerEditorPage idn="comp-1" />);

    await screen.findByText((text) =>
      text.includes("Editing Computer: comp-1")
    );

    const saveButton = screen.getByRole("button", {
      name: /sačuvaj izmene fajla/i,
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Greška pri čuvanju fajla.");
    });
  });
});
