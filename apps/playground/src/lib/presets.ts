import type { MappingConfig } from "@syncport/core";

export type AdapterId = "hubspot" | "airtable" | "csv" | "sheets" | "xlsx";

export type StructurePresetId = "contacts" | "companies" | "deals" | "orders" | "tickets";

export interface AdapterMeta {
  id: AdapterId;
  name: string;
  description: string;
  outputType: string;
  icon: string;
}

export const ADAPTERS: AdapterMeta[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM contact & company payloads",
    outputType: "JSON API",
    icon: "hubspot",
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Record fields for Airtable bases",
    outputType: "JSON Records",
    icon: "airtable",
  },
  {
    id: "csv",
    name: "CSV",
    description: "Comma-separated export",
    outputType: "text/csv",
    icon: "csv",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    description: "Row matrix for Sheets API",
    outputType: "Sheet Rows",
    icon: "sheets",
  },
  {
    id: "xlsx",
    name: "XLSX",
    description: "Excel workbook export",
    outputType: "application/vnd.ms-excel",
    icon: "xlsx",
  },
];

export const STRUCTURE_PRESETS: Record<
  StructurePresetId,
  { label: string; mapping: MappingConfig }
> = {
  contacts: {
    label: "Contacts",
    mapping: {
      fields: {
        name: "name",
        email: "email",
        phone: "phone",
        company: "company",
      },
    },
  },
  companies: {
    label: "Companies",
    mapping: {
      fields: {
        company: "name",
        domain: "domain",
        industry: "industry",
        employees: "employee_count",
      },
    },
  },
  deals: {
    label: "Deals",
    mapping: {
      fields: {
        title: "dealname",
        amount: "amount",
        stage: "dealstage",
        closeDate: "closedate",
      },
    },
  },
  orders: {
    label: "Orders",
    mapping: {
      fields: {
        orderId: "order_id",
        customer: "customer_name",
        email: "email",
        total: "amount",
        status: "status",
      },
    },
  },
  tickets: {
    label: "Tickets",
    mapping: {
      fields: {
        ticketId: "ticket_id",
        subject: "subject",
        requester: "requester_email",
        priority: "priority",
        status: "status",
      },
    },
  },
};
