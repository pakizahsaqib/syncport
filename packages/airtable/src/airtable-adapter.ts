import type { Adapter, JsonRecord, TransformOptions } from "@syncport/core";
import { applyMapping } from "@syncport/core";
import type { AirtableRecordInput, AirtableRecordPayload } from "./types.js";

/**
 * Transforms generic JSON into Airtable record field payloads.
 */
export class AirtableAdapter implements Adapter<AirtableRecordInput, AirtableRecordPayload> {
  readonly name = "airtable";

  transform(data: AirtableRecordInput, _options?: TransformOptions): AirtableRecordPayload {
    const fields = applyMapping(data as JsonRecord, {
      fields: {
        name: "Name",
        email: "Email",
        phone: "Phone",
      },
    });

    return { fields: fields as AirtableRecordPayload["fields"] };
  }
}
