import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import FileUpload from "../components/FileUpload";
import * as uploadApi from "../api/upload";

describe("FileUpload", () => {
  it("uploads a JSON file and shows success message", async () => {
    const mockData = { "None:0:0": { installed_software: {} } };

    vi.spyOn(uploadApi, "uploadJsonFile").mockResolvedValueOnce({
      data: mockData,
    });

    render(<FileUpload />);

    const file = new File([JSON.stringify(mockData)], "test.json", {
      type: "application/json",
    });

    const input = screen.getByTestId("file-input");
    await fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("upload-status").textContent).toContain(
        "Uploaded: 1"
      );
    });
  });
});
