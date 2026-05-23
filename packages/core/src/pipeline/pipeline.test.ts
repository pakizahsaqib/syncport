import { describe, expect, it, vi } from "vitest";
import type { Adapter } from "../adapter.js";
import { transform } from "./pipeline.js";

const fullNameAdapter: Adapter<Record<string, unknown>, { fullName: string; email?: string }> = {
  name: "fullName",
  transform: (data) => ({
    fullName: `${String(data.firstname ?? "")} ${String(data.lastname ?? "")}`.trim(),
    ...(data.email !== undefined ? { email: String(data.email) } : {}),
  }),
};

describe("transform pipeline", () => {
  it("chains map, sanitize, transform, and export", () => {
    const onDebug = vi.fn();

    const result = transform({ first: "Ada", last: "Lovelace", email: "  ada@test.com  " })
      .map({
        fields: {
          first: "firstname",
          last: "lastname",
          email: "email",
        },
      })
      .sanitize({ trimStrings: true })
      .use(fullNameAdapter)
      .onDebug(onDebug)
      .export({ skipValidation: true });

    expect(result.data).toEqual({ fullName: "Ada Lovelace", email: "ada@test.com" });
    expect(result.adapter).toBe("fullName");
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(onDebug).toHaveBeenCalled();
  });

  it("applies mapping to arrays", () => {
    const result = transform([{ name: "Ali" }, { name: "Sam" }])
      .map({ fields: { name: "fullName" } })
      .export();

    expect(result.data).toEqual([{ fullName: "Ali" }, { fullName: "Sam" }]);
  });

  it("runs middleware before adapter", () => {
    const scaleAdapter: Adapter<{ n: number }, { value: number }> = {
      name: "scale",
      transform: (data) => ({ value: data.n * 10 }),
    };

    const result = transform({ n: 2 })
      .middleware((data) => ({ n: (data as { n: number }).n + 1 }))
      .use(scaleAdapter)
      .export();

    expect(result.data).toEqual({ value: 30 });
  });

  it("validates with schema", () => {
    expect(() =>
      transform({ email: "not-an-email" })
        .validate({
          fields: {
            email: {
              type: "string",
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
          },
        })
        .export(),
    ).toThrow(/Validation failed/);
  });
});
