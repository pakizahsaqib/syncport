export interface AirtableRecordInput {
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

/** Airtable API record create payload */
export interface AirtableRecordPayload {
  fields: {
    Name?: string;
    Email?: string;
    Phone?: string;
    [key: string]: unknown;
  };
}
