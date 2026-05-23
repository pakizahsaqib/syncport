import type { Adapter } from "../adapter.js";
import { applyMapping } from "../mapping/apply-mapping.js";
import type { JsonRecord, MappingConfig, TransformOptions, ValidationResult } from "../types.js";
import { assertValid, validateSchema } from "../validation/index.js";
import type { SchemaConfig } from "../validation/index.js";
import { sanitizeData } from "./sanitize.js";
import type {
  PipelineContext,
  PipelineExportOptions,
  PipelineLog,
  PipelineMiddleware,
  PipelineResult,
  SanitizeOptions,
} from "./types.js";

function byteSize(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return 0;
  }
}

function applyMappingToData<T>(data: T, config: MappingConfig): T {
  if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === "object" && item !== null
        ? applyMapping(item as JsonRecord, config)
        : item,
    ) as T;
  }

  if (typeof data === "object" && data !== null) {
    return applyMapping(data as JsonRecord, config) as T;
  }

  return data;
}

function validateData(data: unknown, schema: SchemaConfig): ValidationResult {
  if (Array.isArray(data)) {
    const issues = data.flatMap((item, index) => {
      if (typeof item !== "object" || item === null) {
        return [
          {
            path: `[${index}]`,
            message: "Expected object record",
            code: "invalid_type",
          },
        ];
      }
      const result = validateSchema(item as JsonRecord, schema);
      return result.issues.map((issue) => ({
        ...issue,
        path: `[${index}].${issue.path}`,
      }));
    });
    return { valid: issues.length === 0, issues };
  }

  if (typeof data === "object" && data !== null) {
    return validateSchema(data as JsonRecord, schema);
  }

  return {
    valid: false,
    issues: [{ path: "", message: "Expected object or array of objects", code: "invalid_type" }],
  };
}

/**
 * Fluent transformation pipeline with mapping, validation, sanitization, and adapter export.
 */
export class TransformPipeline<TInput = unknown> {
  private data: TInput;
  private mappingConfig?: MappingConfig;
  private validationSchema?: SchemaConfig;
  private sanitizeOpts?: SanitizeOptions;
  private customSanitize?: (data: unknown) => unknown;
  private adapter?: Adapter;
  private readonly middlewares: PipelineMiddleware[] = [];
  private readonly debugHooks: Array<(log: PipelineLog) => void> = [];
  private readonly logs: PipelineLog[] = [];

  constructor(data: TInput) {
    this.data = data;
  }

  /** Apply declarative field mapping */
  map(config: MappingConfig): this {
    this.mappingConfig = config;
    return this;
  }

  /** Configure schema validation for the next export */
  validate(schema: SchemaConfig): this {
    this.validationSchema = schema;
    return this;
  }

  /** Configure data sanitization */
  sanitize(options?: SanitizeOptions): this;
  sanitize(fn: (data: unknown) => unknown): this;
  sanitize(optionsOrFn?: SanitizeOptions | ((data: unknown) => unknown)): this {
    if (typeof optionsOrFn === "function") {
      this.customSanitize = optionsOrFn;
    } else {
      this.sanitizeOpts = optionsOrFn ?? {};
    }
    return this;
  }

  /** Register destination adapter */
  use(adapter: Adapter): this {
    this.adapter = adapter;
    return this;
  }

  /** Alias for use() — attach adapter for transform stage */
  transform(adapter: Adapter): this {
    return this.use(adapter);
  }

  /** Add middleware executed before adapter transform */
  middleware(fn: PipelineMiddleware): this {
    this.middlewares.push(fn);
    return this;
  }

  /** Subscribe to pipeline debug logs */
  onDebug(hook: (log: PipelineLog) => void): this {
    this.debugHooks.push(hook);
    return this;
  }

  /** Run pipeline synchronously and return result */
  export(options?: PipelineExportOptions): PipelineResult {
    if (options?.async) {
      throw new Error("Use exportAsync() when options.async is true");
    }
    return this.runPipeline(options);
  }

  /** Run pipeline with async middleware support */
  async exportAsync(options?: PipelineExportOptions): Promise<PipelineResult> {
    return this.runPipelineAsync(options);
  }

  private createContext(stage: string): PipelineContext {
    const logs = this.logs;
    return {
      logs,
      stage,
      addLog: (entry) => {
        const log: PipelineLog = { ...entry, timestamp: Date.now() };
        logs.push(log);
        for (const hook of this.debugHooks) {
          hook(log);
        }
      },
    };
  }

  private log(ctx: PipelineContext, level: PipelineLog["level"], message: string, data?: unknown): void {
    ctx.addLog({ level, message, stage: ctx.stage, data });
  }

  private runPipeline(options?: PipelineExportOptions): PipelineResult {
    const start = performance.now();
    const inputSizeBytes = byteSize(this.data);
    let current: unknown = this.data;
    let validation: ValidationResult | null = null;

    const ctx = this.createContext("init");
    this.log(ctx, "info", "Pipeline started", { inputSizeBytes });

    if (this.mappingConfig) {
      const mapCtx = this.createContext("map");
      current = applyMappingToData(current, this.mappingConfig);
      this.log(mapCtx, "debug", "Field mapping applied");
    }

    if (this.validationSchema) {
      const validateCtx = this.createContext("validate");
      validation = validateData(current, this.validationSchema);
      this.log(validateCtx, validation.valid ? "info" : "warn", "Validation completed", validation);

      if (!validation.valid && options?.strict !== false && !options?.skipValidation) {
        assertValid(validation);
      }
    }

    if (this.customSanitize) {
      const sanitizeCtx = this.createContext("sanitize");
      current = this.customSanitize(current);
      this.log(sanitizeCtx, "debug", "Custom sanitization applied");
    } else if (this.sanitizeOpts !== undefined) {
      const sanitizeCtx = this.createContext("sanitize");
      current = sanitizeData(current, this.sanitizeOpts);
      this.log(sanitizeCtx, "debug", "Data sanitized");
    }

    for (const mw of this.middlewares) {
      const mwCtx = this.createContext("middleware");
      const result = mw(current, mwCtx);
      if (result instanceof Promise) {
        throw new Error("Async middleware requires exportAsync()");
      }
      current = result;
    }

    if (this.adapter) {
      const transformCtx = this.createContext("transform");

      if (!options?.skipValidation && this.adapter.validate) {
        const adapterValidation = this.adapter.validate(current);
        if (!adapterValidation.valid) {
          validation = adapterValidation;
          this.log(transformCtx, "warn", "Adapter validation issues", adapterValidation);
          if (options?.strict !== false) {
            assertValid(adapterValidation);
          }
        }
      }

      current = this.adapter.transform(current, options);
      this.log(transformCtx, "info", `Adapter "${this.adapter.name}" transform complete`);
    }

    const durationMs = performance.now() - start;
    const outputSizeBytes = byteSize(current);

    this.log(this.createContext("export"), "info", "Pipeline export complete", {
      durationMs,
      outputSizeBytes,
    });

    return {
      data: current,
      logs: [...this.logs],
      validation,
      durationMs,
      adapter: this.adapter?.name ?? null,
      inputSizeBytes,
      outputSizeBytes,
    };
  }

  private async runPipelineAsync(options?: PipelineExportOptions): Promise<PipelineResult> {
    const start = performance.now();
    const inputSizeBytes = byteSize(this.data);
    let current: unknown = this.data;
    let validation: ValidationResult | null = null;

    const ctx = this.createContext("init");
    this.log(ctx, "info", "Pipeline started (async)", { inputSizeBytes });

    if (this.mappingConfig) {
      current = applyMappingToData(current, this.mappingConfig);
      this.log(this.createContext("map"), "debug", "Field mapping applied");
    }

    if (this.validationSchema) {
      validation = validateData(current, this.validationSchema);
      if (!validation.valid && options?.strict !== false && !options?.skipValidation) {
        assertValid(validation);
      }
    }

    if (this.customSanitize) {
      current = this.customSanitize(current);
    } else if (this.sanitizeOpts !== undefined) {
      current = sanitizeData(current, this.sanitizeOpts);
    }

    for (const mw of this.middlewares) {
      const mwCtx = this.createContext("middleware");
      current = await mw(current, mwCtx);
    }

    if (this.adapter) {
      if (!options?.skipValidation && this.adapter.validate) {
        const adapterValidation = this.adapter.validate(current);
        if (!adapterValidation.valid) {
          validation = adapterValidation;
          if (options?.strict !== false) {
            assertValid(adapterValidation);
          }
        }
      }
      current = this.adapter.transform(current, options);
    }

    const durationMs = performance.now() - start;

    return {
      data: current,
      logs: [...this.logs],
      validation,
      durationMs,
      adapter: this.adapter?.name ?? null,
      inputSizeBytes,
      outputSizeBytes: byteSize(current),
    };
  }

}

/** Create a fluent transformation pipeline from input data */
export function transform<T>(data: T): TransformPipeline<T> {
  return new TransformPipeline(data);
}
