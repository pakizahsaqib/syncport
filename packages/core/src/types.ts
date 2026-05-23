/** Generic record shape for source and target payloads */
export type JsonRecord = Record<string, unknown>;

/** Field mapping from source key to target key or transform */
export type FieldMapping =
  | string
  | {
      target: string;
      transform?: (value: unknown, source: JsonRecord) => unknown;
    };

/** Mapping configuration for adapters */
export interface MappingConfig {
  fields: Record<string, FieldMapping>;
  defaults?: JsonRecord;
}

/** Validation issue returned by validators */
export interface ValidationIssue {
  path: string;
  message: string;
  code?: string;
}

/** Result of validation */
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

/** Options passed to transform pipeline */
export interface TransformOptions {
  strict?: boolean;
  skipValidation?: boolean;
}
