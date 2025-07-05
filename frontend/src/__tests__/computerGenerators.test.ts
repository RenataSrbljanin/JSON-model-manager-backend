import { describe, expect, it } from "vitest";
import { generateComputerId, generateUuid } from "../utils/computerGenerators";

describe("computerGenerators", () => {
  it("should generate a computer ID", () => {
    const id = generateComputerId("None", 0, 2);
    expect(id).toBe("None:0:2");
  });

  it("should generate a valid UUID", () => {
    const uuid = generateUuid();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
