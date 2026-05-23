import type { JsonRecord, TransformOptions, ValidationResult } from "./types.js";

/**
 * Adapter contract for destination-specific transforms.
 * Implement this interface in integration packages (HubSpot, Airtable, etc.).
 */
export interface Adapter<TInput = unknown, TOutput = unknown> {
  /** Unique adapter identifier (e.g. "hubspot", "csv") */
  readonly name: string;

  /** Transform source data into destination-specific payload */
  transform(data: TInput, options?: TransformOptions): TOutput;

  /** Optional pre-transform validation */
  validate?(data: TInput): ValidationResult;
}

/** Type guard for Adapter instances */
export function isAdapter(value: unknown): value is Adapter {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof (value as Adapter).name === "string" &&
    "transform" in value &&
    typeof (value as Adapter).transform === "function"
  );
}
