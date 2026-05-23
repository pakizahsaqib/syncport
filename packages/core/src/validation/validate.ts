import type { JsonRecord, ValidationIssue, ValidationResult } from "../types.js";

export interface FieldRule {
  required?: boolean;
  type?: "string" | "number" | "boolean" | "object" | "array";
  pattern?: RegExp;
  message?: string;
}

export interface SchemaConfig {
  fields: Record<string, FieldRule>;
}

/**
 * Validate a source record against a simple field schema.
 */
export function validateSchema(data: JsonRecord, schema: SchemaConfig): ValidationResult {
  const issues: ValidationIssue[] = [];

  for (const [field, rule] of Object.entries(schema.fields)) {
    const value = data[field];

    if (rule.required && (value === undefined || value === null || value === "")) {
      issues.push({
        path: field,
        message: rule.message ?? `${field} is required`,
        code: "required",
      });
      continue;
    }

    if (value === undefined || value === null) {
      continue;
    }

    if (rule.type) {
      const actual = Array.isArray(value) ? "array" : typeof value;
      if (actual !== rule.type) {
        issues.push({
          path: field,
          message: rule.message ?? `${field} must be of type ${rule.type}`,
          code: "invalid_type",
        });
      }
    }

    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      issues.push({
        path: field,
        message: rule.message ?? `${field} has invalid format`,
        code: "invalid_format",
      });
    }
  }

  return { valid: issues.length === 0, issues };
}

export function assertValid(result: ValidationResult): void {
  if (!result.valid) {
    const messages = result.issues.map((i) => `${i.path}: ${i.message}`).join("; ");
    throw new Error(`Validation failed: ${messages}`);
  }
}
