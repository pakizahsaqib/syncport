import { describe, expect, it } from "vitest";
import { applyMapping, nestByPath } from "./apply-mapping.js";

describe("applyMapping", () => {
  it("maps source keys to target keys", () => {
    const result = applyMapping(
      { name: "Ali", email: "ali@gmail.com" },
      {
        fields: {
          name: "firstname",
          email: "email",
        },
      },
    );

    expect(result).toEqual({
      firstname: "Ali",
      email: "ali@gmail.com",
    });
  });

  it("applies transform functions", () => {
    const result = applyMapping(
      { fullName: "Ali Khan" },
      {
        fields: {
          fullName: {
            target: "firstname",
            transform: (v) => String(v).split(" ")[0],
          },
        },
      },
    );

    expect(result).toEqual({ firstname: "Ali" });
  });

  it("merges defaults", () => {
    const result = applyMapping(
      { email: "a@b.com" },
      {
        defaults: { lifecyclestage: "lead" },
        fields: { email: "email" },
      },
    );

    expect(result).toEqual({
      lifecyclestage: "lead",
      email: "a@b.com",
    });
  });
});

describe("nestByPath", () => {
  it("nests dot-prefixed keys under root", () => {
    const result = nestByPath(
      {
        "properties.firstname": "Ali",
        "properties.email": "ali@gmail.com",
      },
      "properties",
    );

    expect(result).toEqual({
      properties: {
        firstname: "Ali",
        email: "ali@gmail.com",
      },
    });
  });
});
