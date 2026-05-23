import type { Adapter, JsonRecord, TransformOptions } from "@syncport/core";
import * as XLSX from "xlsx";
import type { XlsxExportOptions, XlsxExportPayload, XlsxRowInput } from "./types.js";

function resolveColumns(rows: JsonRecord[], explicit?: string[]): string[] {
  if (explicit && explicit.length > 0) {
    return explicit;
  }
  const keys = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      keys.add(key);
    }
  }
  return [...keys].sort();
}

function recordsToAoA(rows: JsonRecord[], columns: string[]): unknown[][] {
  return [columns, ...rows.map((row) => columns.map((col) => row[col] ?? ""))];
}

function toBase64(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  if (typeof btoa !== "undefined") {
    return btoa(binary);
  }
  return Buffer.from(bytes).toString("base64");
}

/**
 * Generates XLSX workbooks from JSON records (browser and Node compatible).
 */
export class XlsxAdapter implements Adapter<XlsxRowInput | XlsxRowInput[], XlsxExportPayload> {
  readonly name = "xlsx";

  private readonly defaultOptions: XlsxExportOptions;

  constructor(options?: XlsxExportOptions) {
    this.defaultOptions = options ?? {};
  }

  transform(
    data: XlsxRowInput | XlsxRowInput[],
    options?: TransformOptions,
  ): XlsxExportPayload {
    const opts = { ...this.defaultOptions, ...(options as XlsxExportOptions | undefined) };
    const workbook = XLSX.utils.book_new();
    let totalRows = 0;
    const sheetNames: string[] = [];

    const sheetConfigs =
      opts.sheets ??
      [
        {
          name: opts.sheetName ?? "Export",
          data,
        },
      ];

    for (const sheet of sheetConfigs) {
      const records = (Array.isArray(sheet.data) ? sheet.data : [sheet.data]) as JsonRecord[];
      const columns = resolveColumns(records, opts.columns);
      const aoa = recordsToAoA(records, columns);
      const worksheet = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
      sheetNames.push(sheet.name);
      totalRows += records.length;
    }

    const arrayBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    }) as ArrayBuffer;
    const base64 = toBase64(arrayBuffer);

    return {
      base64,
      sheetNames,
      rowCount: totalRows,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }
}
