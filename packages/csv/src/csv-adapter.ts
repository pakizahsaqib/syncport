import type { Adapter, JsonRecord, TransformOptions } from "@syncport/core";
import type { CsvExportOptions, CsvExportPayload, CsvRowInput } from "./types.js";

function escapeCell(value: unknown, delimiter: string): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes('"') || str.includes("\n") || str.includes(delimiter)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function resolveColumns(data: JsonRecord | JsonRecord[], explicit?: string[]): string[] {
  if (explicit && explicit.length > 0) {
    return explicit;
  }
  const rows = Array.isArray(data) ? data : [data];
  const keys = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      keys.add(key);
    }
  }
  return [...keys].sort();
}

/**
 * Transforms JSON records into CSV export payloads.
 */
export class CsvAdapter implements Adapter<CsvRowInput | CsvRowInput[], CsvExportPayload> {
  readonly name = "csv";

  private readonly defaultOptions: CsvExportOptions;

  constructor(options?: CsvExportOptions) {
    this.defaultOptions = options ?? {};
  }

  transform(
    data: CsvRowInput | CsvRowInput[],
    options?: TransformOptions,
  ): CsvExportPayload {
    const opts = { ...this.defaultOptions, ...(options as CsvExportOptions | undefined) };
    const delimiter = opts.delimiter ?? ",";
    const header = opts.header !== false;
    const rows = (Array.isArray(data) ? data : [data]) as JsonRecord[];
    const columns = resolveColumns(rows, opts.columns);

    const lines: string[] = [];

    if (header) {
      lines.push(columns.map((c) => escapeCell(c, delimiter)).join(delimiter));
    }

    for (const row of rows) {
      lines.push(
        columns.map((col) => escapeCell(row[col], delimiter)).join(delimiter),
      );
    }

    const content = lines.join("\n");
    const rowCount = header ? Math.max(0, lines.length - 1) : lines.length;

    return { content, columns, rowCount };
  }
}
