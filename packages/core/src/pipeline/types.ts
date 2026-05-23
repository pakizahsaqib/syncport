import type { Adapter } from "../adapter.js";
import type { JsonRecord, MappingConfig, TransformOptions, ValidationResult } from "../types.js";
import type { SchemaConfig } from "../validation/index.js";
import type { SanitizeOptions } from "./sanitize.js";

export type PipelineLogLevel = "info" | "warn" | "error" | "debug";

export interface PipelineLog {
  level: PipelineLogLevel;
  message: string;
  stage: string;
  timestamp: number;
  data?: unknown;
}

export type PipelineMiddleware<T = unknown> = (
  data: T,
  context: PipelineContext,
) => T | Promise<T>;

export interface PipelineContext {
  logs: PipelineLog[];
  stage: string;
  addLog: (log: Omit<PipelineLog, "timestamp">) => void;
}

export interface PipelineExportOptions extends TransformOptions {
  /** Run middleware and hooks asynchronously */
  async?: boolean;
}

export interface PipelineResult<TOutput = unknown> {
  data: TOutput;
  logs: PipelineLog[];
  validation: ValidationResult | null;
  durationMs: number;
  adapter: string | null;
  inputSizeBytes: number;
  outputSizeBytes: number;
}

export interface PipelineState<T = unknown> {
  data: T;
  mapping?: MappingConfig;
  schema?: SchemaConfig;
  sanitizeOptions?: SanitizeOptions;
  adapter?: Adapter;
  middlewares: PipelineMiddleware[];
  debugHooks: Array<(log: PipelineLog) => void>;
}

export type { JsonRecord, MappingConfig, SchemaConfig, SanitizeOptions };
