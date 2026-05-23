export interface CsvRowInput {
  [key: string]: unknown;
}

export interface CsvExportOptions {
  /** Column order in output CSV */
  columns?: string[];
  /** Include header row (default: true) */
  header?: boolean;
  /** Field delimiter (default: ",") */
  delimiter?: string;
}

export interface CsvExportPayload {
  /** CSV string ready for file write or HTTP response */
  content: string;
  /** Resolved column headers */
  columns: string[];
  /** Number of data rows (excluding header) */
  rowCount: number;
}
