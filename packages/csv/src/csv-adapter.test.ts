import { describe, expect, it } from "vitest";
import { CsvAdapter } from "./csv-adapter.js";

describe("CsvAdapter", () => {
  const adapter = new CsvAdapter();

  it("exports a single row to CSV with header", () => {
    const result = adapter.transform({
      name: "Ali",
      email: "ali@gmail.com",
    });

    expect(result.columns).toEqual(["email", "name"]);
    expect(result.rowCount).toBe(1);
    expect(result.content).toBe(
      "email,name\nali@gmail.com,Ali",
    );
  });

  it("exports multiple rows", () => {
    const result = adapter.transform([
      { name: "Ali", email: "a@b.com" },
      { name: "Sara", email: "s@b.com" },
    ]);

    expect(result.rowCount).toBe(2);
    expect(result.content.split("\n")).toHaveLength(3);
  });

  it("escapes values containing delimiters", () => {
    const result = adapter.transform({
      note: 'Hello, "world"',
    });

    expect(result.content).toContain('"Hello, ""world"""');
  });

  it("respects explicit column order", () => {
    const ordered = new CsvAdapter({ columns: ["name", "email"] });
    const result = ordered.transform({ email: "a@b.com", name: "Ali" });

    expect(result.content).toBe("name,email\nAli,a@b.com");
  });
});
