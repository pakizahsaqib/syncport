export interface SheetsRowInput {
  [key: string]: unknown;
}

export interface SheetsExportOptions {
  /** Column order; auto-generated from data when omitted */
  columns?: string[];
  /** Include header row in output (default: true) */
  header?: boolean;
  /** A1 notation range hint for API uploads */
  sheetName?: string;
}

export interface SheetsExportPayload {
  /** Header row for Google Sheets */
  headers: string[];
  /** Data rows (excluding header) */
  rows: unknown[][];
  /** Values including header when header is true */
  values: unknown[][];
  /** Suggested A1 range */
  range: string;
  rowCount: number;
}
