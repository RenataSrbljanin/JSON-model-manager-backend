import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { generateSoftwareDataLinks } from "../utils/computerGenerators"; // prilagodi putanju

type ComputerJson = {
  installed_software: Record<string, any>;
  software_data_links: Record<string, string[]>;
  data: string[];
};

type OutputJson = Record<string, ComputerJson>;

describe("generate_software_data_links from real JSON", () => {
  it("should load dataLinks from JSON and generate correct mapping", () => {
    // Učitaj JSON iz fixtures foldera
    const raw = fs.readFileSync(
      path.resolve(__dirname, "../fixtures/outputs-5-100-0.json"),
      "utf-8"
    );
    const outputs: OutputJson = JSON.parse(raw);

    const [, compObj] = Object.entries(outputs)[0];
    const swIdn = Object.keys(compObj.installed_software)[0];

    const expectedDataLinks = compObj.software_data_links[swIdn];
    const allDataIds = compObj.data;

    // Testiramo funkciju
    const result = generateSoftwareDataLinks({ [swIdn]: [] }, allDataIds);

    expect(result).toHaveProperty(swIdn);
    expect(result[swIdn]).toEqual(expect.arrayContaining(expectedDataLinks));
  });
});
