import type { Adapter, JsonRecord, TransformOptions } from "@syncport/core";
import type { SheetsExportOptions, SheetsExportPayload, SheetsRowInput } from "./types.js";

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

function rowToValues(row: JsonRecord, columns: string[]): unknown[] {
  return columns.map((col) => {
    const value = row[col];
    return value === undefined || value === null ? "" : value;
  });
}

/**
 * Converts JSON records into Google Sheets–ready row matrices.
 */
export class SheetsAdapter implements Adapter<SheetsRowInput | SheetsRowInput[], SheetsExportPayload> {
  readonly name = "sheets";

  private readonly defaultOptions: SheetsExportOptions;

  constructor(options?: SheetsExportOptions) {
    this.defaultOptions = options ?? {};
  }

  transform(
    data: SheetsRowInput | SheetsRowInput[],
    options?: TransformOptions,
  ): SheetsExportPayload {
    const opts = { ...this.defaultOptions, ...(options as SheetsExportOptions | undefined) };
    const header = opts.header !== false;
    const records = (Array.isArray(data) ? data : [data]) as JsonRecord[];
    const columns = resolveColumns(records, opts.columns);
    const headers = columns;
    const rows = records.map((row) => rowToValues(row, columns));
    const values = header ? [headers, ...rows] : rows;
    const sheetName = opts.sheetName ?? "Sheet1";
    const endCol = columnLetter(columns.length);
    const endRow = values.length;
    const range = `${sheetName}!A1:${endCol}${endRow}`;

    return {
      headers,
      rows,
      values,
      range,
      rowCount: rows.length,
    };
  }
}

function columnLetter(index: number): string {
  let n = index;
  let label = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label || "A";
}
