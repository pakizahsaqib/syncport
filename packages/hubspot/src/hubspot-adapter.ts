import type { Adapter, TransformOptions, ValidationResult } from "@syncport/core";
import { validateSchema } from "@syncport/core";
import type { HubspotContactInput, HubspotContactPayload } from "./types.js";

const CONTACT_SCHEMA = {
  fields: {
    email: {
      required: false,
      type: "string" as const,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "email must be a valid email address when provided",
    },
  },
};

function splitName(name: string): { firstname: string; lastname?: string } {
  const parts = name.trim().split(/\s+/);
  const firstname = parts[0] ?? "";
  const lastname = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
  return lastname !== undefined ? { firstname, lastname } : { firstname };
}

/**
 * Transforms generic JSON contact records into HubSpot contact API payloads.
 */
export class HubspotAdapter implements Adapter<HubspotContactInput, HubspotContactPayload> {
  readonly name = "hubspot";

  validate(data: HubspotContactInput): ValidationResult {
    if (data.email) {
      return validateSchema(
        { email: data.email },
        CONTACT_SCHEMA,
      );
    }
    return { valid: true, issues: [] };
  }

  transform(data: HubspotContactInput, _options?: TransformOptions): HubspotContactPayload {
    const properties: HubspotContactPayload["properties"] = {};

    if (data.email !== undefined) {
      properties.email = String(data.email);
    }
    if (data.phone !== undefined) {
      properties.phone = String(data.phone);
    }
    if (data.company !== undefined) {
      properties.company = String(data.company);
    }

    if (data.firstname !== undefined) {
      properties.firstname = String(data.firstname);
      if (data.lastname !== undefined) {
        properties.lastname = String(data.lastname);
      }
    } else if (data.name !== undefined) {
      const { firstname, lastname } = splitName(String(data.name));
      properties.firstname = firstname;
      if (lastname !== undefined) {
        properties.lastname = lastname;
      }
    }

    return { properties };
  }
}
