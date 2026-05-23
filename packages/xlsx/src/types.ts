export interface XlsxRowInput {
  [key: string]: unknown;
}

export interface XlsxSheetConfig {
  name: string;
  data: XlsxRowInput | XlsxRowInput[];
}

export interface XlsxExportOptions {
  columns?: string[];
  sheetName?: string;
  /** Multiple named sheets */
  sheets?: XlsxSheetConfig[];
}

export interface XlsxExportPayload {
  /** Base64-encoded workbook for browser download */
  base64: string;
  /** Sheet names in workbook */
  sheetNames: string[];
  rowCount: number;
  mimeType: string;
}
