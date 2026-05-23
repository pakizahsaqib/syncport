import type { Adapter } from "./adapter.js";
import type { JsonRecord, TransformOptions } from "./types.js";
import { assertValid } from "./validation/index.js";

/**
 * Fluent transformation engine. Chain adapters with `.use()` and run `.transform()`.
 */
export class Transformer {
  private readonly adapters: Adapter[] = [];

  /** Register an adapter for the next transform */
  use<T extends Adapter>(adapter: T): this {
    this.adapters.push(adapter);
    return this;
  }

  /** Clear all registered adapters */
  clear(): this {
    this.adapters.length = 0;
    return this;
  }

  /** List registered adapter names */
  getAdapterNames(): string[] {
    return this.adapters.map((a) => a.name);
  }

  /**
   * Transform input through the last registered adapter, or through all adapters in sequence.
   */
  transform<TInput = unknown, TOutput = unknown>(
    data: TInput,
    options?: TransformOptions & { chain?: boolean },
  ): TOutput {
    if (this.adapters.length === 0) {
      throw new Error("No adapter registered. Call .use(adapter) before .transform().");
    }

    const adapters = options?.chain ? this.adapters : [this.adapters[this.adapters.length - 1]!];

    let current: unknown = data;

    for (const adapter of adapters) {
      const input = current;

      if (!options?.skipValidation && adapter.validate) {
        const result = adapter.validate(input);
        if (options?.strict !== false && !result.valid) {
          assertValid(result);
        }
      }

      current = adapter.transform(input, options);
    }

    return current as TOutput;
  }
}
