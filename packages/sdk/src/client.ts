import { Transformer, type Adapter } from "@syncport/core";
import type {
  ExportDataOptions,
  SyncportClient,
  SyncportClientOptions,
} from "./types.js";

export function createClient(options: SyncportClientOptions = {}): SyncportClient {
  const adapters = new Map<string, Adapter>();
  const { defaultAdapter, transformOptions: defaultTransformOptions } = options;

  return {
    register(adapter: Adapter): void {
      adapters.set(adapter.name, adapter);
    },

    getAdapter(name: string): Adapter | undefined {
      return adapters.get(name);
    },

    listAdapters(): string[] {
      return [...adapters.keys()];
    },

    exportData<TInput = unknown, TOutput = unknown>(
      data: TInput,
      options?: ExportDataOptions,
    ): TOutput {
      const adapterName = options?.adapter ?? defaultAdapter;
      if (!adapterName) {
        throw new Error(
          "No adapter specified. Pass options.adapter or set defaultAdapter on createClient().",
        );
      }

      const adapter = adapters.get(adapterName);
      if (!adapter) {
        throw new Error(
          `Adapter "${adapterName}" is not registered. Available: ${[...adapters.keys()].join(", ") || "none"}`,
        );
      }

      const transformer = new Transformer().use(adapter);
      const { adapter: _a, ...transformOpts } = options ?? {};
      return transformer.transform<TInput, TOutput>(data, {
        ...defaultTransformOptions,
        ...transformOpts,
      });
    },

    createTransformer(): Transformer {
      return new Transformer();
    },
  };
}
