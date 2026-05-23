import type { FieldMapping, JsonRecord, MappingConfig } from "../types.js";

function resolveFieldMapping(
  mapping: FieldMapping,
  sourceKey: string,
  source: JsonRecord,
): { target: string; value: unknown } {
  if (typeof mapping === "string") {
    return { target: mapping, value: source[sourceKey] };
  }

  const raw = source[sourceKey];
  const value = mapping.transform ? mapping.transform(raw, source) : raw;
  return { target: mapping.target, value };
}

/**
 * Apply a declarative field mapping from source record to a flat target record.
 */
export function applyMapping(source: JsonRecord, config: MappingConfig): JsonRecord {
  const result: JsonRecord = { ...(config.defaults ?? {}) };

  for (const [sourceKey, mapping] of Object.entries(config.fields)) {
    const { target, value } = resolveFieldMapping(mapping, sourceKey, source);
    if (value !== undefined) {
      result[target] = value;
    }
  }

  return result;
}

/**
 * Nest flat mapped values under a dot-path (e.g. "properties.firstname").
 */
export function nestByPath(flat: JsonRecord, rootKey: string): JsonRecord {
  const nested: JsonRecord = {};
  const root: JsonRecord = {};

  for (const [key, value] of Object.entries(flat)) {
    if (key.startsWith(`${rootKey}.`)) {
      const nestedKey = key.slice(rootKey.length + 1);
      nested[nestedKey] = value;
    } else {
      root[key] = value;
    }
  }

  if (Object.keys(nested).length > 0) {
    root[rootKey] = nested;
  }

  return root;
}
