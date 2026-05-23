import { describe, expect, it } from "vitest";
import type { Adapter } from "@syncport/core";
import { createClient } from "./client.js";

const mockAdapter: Adapter = {
  name: "mock",
  transform: (data) => ({ out: data }),
};

describe("createClient", () => {
  it("registers adapters and exports data", () => {
    const client = createClient({ defaultAdapter: "mock" });
    client.register(mockAdapter);

    const result = client.exportData({ foo: "bar" });
    expect(result).toEqual({ out: { foo: "bar" } });
  });

  it("throws when adapter is missing", () => {
    const client = createClient();
    expect(() => client.exportData({})).toThrow(/No adapter specified/);
  });
});
