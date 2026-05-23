import { AirtableAdapter } from "@syncport/airtable";
import {
  transform,
  type MappingConfig,
  type PipelineLog,
  type ValidationResult,
} from "@syncport/core";
import { CsvAdapter } from "@syncport/csv";
import { HubspotAdapter } from "@syncport/hubspot";
import { SheetsAdapter } from "@syncport/sheets";
import { XlsxAdapter } from "@syncport/xlsx";
import type { AdapterId } from "./presets";

export interface TransformInput {
  data: unknown;
  adapterId: AdapterId;
  mapping: MappingConfig;
  validateEnabled: boolean;
  sanitizeEnabled: boolean;
  strict: boolean;
}

export interface TransformOutput {
  output: unknown;
  logs: PipelineLog[];
  validation: ValidationResult | null;
  durationMs: number;
  inputSizeBytes: number;
  outputSizeBytes: number;
  adapterStatus: "success" | "error";
  error?: string;
}

const BULK_ADAPTERS: AdapterId[] = ["csv", "sheets", "xlsx"];

function mergeValidation(
  current: ValidationResult | null,
  next: ValidationResult | null,
): ValidationResult | null {
  if (!next) return current;
  if (!current) return next;
  return {
    valid: current.valid && next.valid,
    issues: [...current.issues, ...next.issues],
  };
}

function getAdapter(id: AdapterId) {
  switch (id) {
    case "hubspot":
      return new HubspotAdapter();
    case "airtable":
      return new AirtableAdapter();
    case "csv":
      return new CsvAdapter();
    case "sheets":
      return new SheetsAdapter();
    case "xlsx":
      return new XlsxAdapter();
    default:
      throw new Error(`Unknown adapter: ${id}`);
  }
}

function buildPipeline(data: unknown, input: TransformInput, logs: PipelineLog[]) {
  let pipeline = transform(data).map(input.mapping);

  if (input.sanitizeEnabled) {
    pipeline = pipeline.sanitize();
  }

  if (input.validateEnabled) {
    pipeline = pipeline.validate({
      fields: {
        email: {
          required: false,
          type: "string",
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      },
    });
  }

  return pipeline.use(getAdapter(input.adapterId)).onDebug((log) => logs.push(log));
}

export function runTransform(input: TransformInput): TransformOutput {
  const logs: PipelineLog[] = [];

  try {
    const parsed = input.data;
    const isArray = Array.isArray(parsed);
    const exportOptions = {
      skipValidation: !input.validateEnabled,
      strict: input.strict,
    };

    if (BULK_ADAPTERS.includes(input.adapterId)) {
      const bulkData = isArray ? parsed : [parsed];
      const result = buildPipeline(bulkData, input, logs).export(exportOptions);
      return {
        output: result.data,
        logs: [...logs, ...result.logs],
        validation: result.validation,
        durationMs: result.durationMs,
        inputSizeBytes: result.inputSizeBytes,
        outputSizeBytes: result.outputSizeBytes,
        adapterStatus: "success",
      };
    }

    const records = isArray ? parsed : [parsed];
    const outputs: unknown[] = [];
    let totalDuration = 0;
    let inputSize = 0;
    let outputSize = 0;
    let validation: ValidationResult | null = null;

    for (const record of records) {
      const result = buildPipeline(record, input, logs).export(exportOptions);
      outputs.push(result.data);
      totalDuration += result.durationMs;
      inputSize += result.inputSizeBytes;
      outputSize += result.outputSizeBytes;
      validation = mergeValidation(validation, result.validation);
    }

    return {
      output: isArray ? outputs : outputs[0],
      logs,
      validation,
      durationMs: totalDuration,
      inputSizeBytes: inputSize,
      outputSizeBytes: outputSize,
      adapterStatus: "success",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logs.push({
      level: "error",
      message,
      stage: "error",
      timestamp: Date.now(),
    });

    const validationFromError = parseValidationError(message);

    return {
      output: null,
      logs,
      validation: validationFromError,
      durationMs: 0,
      inputSizeBytes: 0,
      outputSizeBytes: 0,
      adapterStatus: "error",
      error: message,
    };
  }
}

/** Parse "Validation failed: field: msg; field2: msg2" from strict pipeline errors */
function parseValidationError(message: string): ValidationResult | null {
  const prefix = "Validation failed: ";
  if (!message.startsWith(prefix)) return null;

  const issues = message
    .slice(prefix.length)
    .split("; ")
    .map((part) => {
      const colon = part.indexOf(": ");
      if (colon === -1) return { path: "", message: part };
      return {
        path: part.slice(0, colon),
        message: part.slice(colon + 2),
      };
    })
    .filter((i) => i.message);

  return issues.length > 0 ? { valid: false, issues } : null;
}

export function parseJsonInput(raw: string): {
  data: unknown | null;
  error: string | null;
} {
  if (!raw.trim()) {
    return { data: null, error: null };
  }
  try {
    return { data: JSON.parse(raw) as unknown, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
}
