import type { Adapter, TransformOptions, Transformer } from "@syncport/core";

export interface SyncportClientOptions {
  /** Default adapter name when exporting */
  defaultAdapter?: string;
  /** Default transform options */
  transformOptions?: TransformOptions;
}

export interface ExportDataOptions extends TransformOptions {
  /** Adapter name registered on the client */
  adapter?: string;
}

export interface SyncportClient {
  register(adapter: Adapter): void;
  getAdapter(name: string): Adapter | undefined;
  listAdapters(): string[];
  exportData<TInput = unknown, TOutput = unknown>(
    data: TInput,
    options?: ExportDataOptions,
  ): TOutput;
  createTransformer(): Transformer;
}
