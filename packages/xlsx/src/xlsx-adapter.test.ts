import { describe, expect, it } from "vitest";
import { XlsxAdapter } from "./xlsx-adapter.js";

describe("XlsxAdapter", () => {
  it("generates a base64 xlsx workbook", () => {
    const result = new XlsxAdapter().transform([
      { name: "Ali", score: 10 },
      { name: "Sam", score: 20 },
    ]);

    expect(result.base64.length).toBeGreaterThan(100);
    expect(result.sheetNames).toEqual(["Export"]);
    expect(result.rowCount).toBe(2);
    expect(result.mimeType).toContain("spreadsheet");
  });

  it("supports multiple sheets", () => {
    const result = new XlsxAdapter({
      sheets: [
        { name: "Contacts", data: [{ name: "Ali" }] },
        { name: "Deals", data: [{ title: "Enterprise" }] },
      ],
    }).transform([]);

    expect(result.sheetNames).toEqual(["Contacts", "Deals"]);
    expect(result.rowCount).toBe(2);
  });
});
