import type { JsonRecord } from "../types.js";

export interface SanitizeOptions {
  /** Remove keys with undefined or null values */
  stripNullish?: boolean;
  /** Trim string values */
  trimStrings?: boolean;
  /** Remove empty string values */
  stripEmptyStrings?: boolean;
}

const DEFAULT_SANITIZE: SanitizeOptions = {
  stripNullish: true,
  trimStrings: true,
  stripEmptyStrings: false,
};

function sanitizeValue(value: unknown, options: SanitizeOptions): unknown {
  if (value === null || value === undefined) {
    return options.stripNullish ? undefined : value;
  }

  if (typeof value === "string") {
    const trimmed = options.trimStrings ? value.trim() : value;
    if (options.stripEmptyStrings && trimmed === "") {
      return undefined;
    }
    return trimmed;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item, options))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    return sanitizeRecord(value as JsonRecord, options);
  }

  return value;
}

function sanitizeRecord(record: JsonRecord, options: SanitizeOptions): JsonRecord {
  const result: JsonRecord = {};

  for (const [key, value] of Object.entries(record)) {
    const sanitized = sanitizeValue(value, options);
    if (sanitized === undefined && options.stripNullish) {
      continue;
    }
    if (sanitized !== undefined) {
      result[key] = sanitized;
    }
  }

  return result;
}

/** Sanitize a record or array of records */
export function sanitizeData<T>(data: T, options?: SanitizeOptions): T {
  const opts = { ...DEFAULT_SANITIZE, ...options };

  if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === "object" && item !== null
        ? sanitizeRecord(item as JsonRecord, opts)
        : sanitizeValue(item, opts),
    ) as T;
  }

  if (typeof data === "object" && data !== null) {
    return sanitizeRecord(data as JsonRecord, opts) as T;
  }

  return sanitizeValue(data, opts) as T;
}
