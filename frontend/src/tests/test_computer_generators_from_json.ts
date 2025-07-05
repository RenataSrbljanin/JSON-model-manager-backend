import fs from "fs";
import path from "path";

const raw = fs.readFileSync(
  path.resolve(__dirname, "fixtures/outputs-5-100-0.json"),
  "utf-8"
);
const outputs = JSON.parse(raw);

const computerEntries = Object.entries(outputs);
const [compIdn, compObj] = computerEntries[0]; // uzmi prvi računar
const softwareEntries = Object.entries(compObj.installed_software);
const [swIdn, swObj] = softwareEntries[0]; // uzmi prvi softver

it("should load dataLinks from JSON and generate correct mapping", () => {
  // učitaj iz outputs.json
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../fixtures/outputs.json"),
    "utf-8"
  );
  const outputs = JSON.parse(raw);

  const [compIdn, compObj] = Object.entries(outputs)[0];
  const swIdn = Object.keys(compObj.installed_software)[0];

  const expectedDataLinks = compObj.software_data_links[swIdn];

  const result = generate_software_data_links({ [swIdn]: [] }, compObj.data);

  expect(result).toHaveProperty(swIdn, expect.any(Array));
  expect(result[swIdn]).toEqual(expect.arrayContaining(expectedDataLinks));
});
