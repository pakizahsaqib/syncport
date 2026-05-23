import { describe, expect, it } from "vitest";
import { AirtableAdapter } from "./airtable-adapter.js";

describe("AirtableAdapter", () => {
  it("maps contact fields to Airtable field names", () => {
    const result = new AirtableAdapter().transform({
      name: "Ali",
      email: "ali@gmail.com",
    });

    expect(result).toEqual({
      fields: {
        Name: "Ali",
        Email: "ali@gmail.com",
      },
    });
  });
});
