import { describe, expect, it } from "vitest";
import { SheetsAdapter } from "./sheets-adapter.js";

describe("SheetsAdapter", () => {
  it("converts records to sheet rows with headers", () => {
    const result = new SheetsAdapter().transform([
      { name: "Ali", email: "ali@test.com" },
      { name: "Sam", email: "sam@test.com" },
    ]);

    expect(result.headers).toEqual(["email", "name"]);
    expect(result.rows).toHaveLength(2);
    expect(result.values[0]).toEqual(["email", "name"]);
    expect(result.rowCount).toBe(2);
    expect(result.range).toMatch(/^Sheet1!/);
  });
});
