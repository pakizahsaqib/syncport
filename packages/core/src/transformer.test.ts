import { describe, expect, it } from "vitest";
import type { Adapter } from "./adapter.js";
import { Transformer } from "./transformer.js";

const doublingAdapter: Adapter<{ n: number }, { n: number }> = {
  name: "double",
  transform: (data) => ({ n: data.n * 2 }),
};

describe("Transformer", () => {
  it("transforms via the last registered adapter", () => {
    const result = new Transformer().use(doublingAdapter).transform({ n: 5 });
    expect(result).toEqual({ n: 10 });
  });

  it("throws when no adapter is registered", () => {
    expect(() => new Transformer().transform({ n: 1 })).toThrow(/No adapter registered/);
  });

  it("chains adapters when chain option is set", () => {
    const addOne: Adapter<{ n: number }, { n: number }> = {
      name: "addOne",
      transform: (data) => ({ n: data.n + 1 }),
    };

    const result = new Transformer()
      .use(addOne)
      .use(doublingAdapter)
      .transform({ n: 5 }, { chain: true });

    expect(result).toEqual({ n: 12 });
  });
});
