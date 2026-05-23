import { describe, expect, it } from "vitest";
import { HubspotAdapter } from "./hubspot-adapter.js";

describe("HubspotAdapter", () => {
  const adapter = new HubspotAdapter();

  it("transforms name and email into HubSpot properties", () => {
    const result = adapter.transform({
      name: "Ali",
      email: "ali@gmail.com",
    });

    expect(result).toEqual({
      properties: {
        firstname: "Ali",
        email: "ali@gmail.com",
      },
    });
  });

  it("splits full name into first and last", () => {
    const result = adapter.transform({
      name: "Ali Khan",
      email: "ali@gmail.com",
    });

    expect(result.properties.firstname).toBe("Ali");
    expect(result.properties.lastname).toBe("Khan");
  });

  it("validates email format when provided", () => {
    const result = adapter.validate({ email: "not-an-email" });
    expect(result.valid).toBe(false);
    expect(result.issues[0]?.path).toBe("email");
  });
});
