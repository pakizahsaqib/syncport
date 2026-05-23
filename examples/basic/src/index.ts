import { Transformer } from "@syncport/core";
import { CsvAdapter, type CsvExportPayload } from "@syncport/csv";
import { HubspotAdapter } from "@syncport/hubspot";
import { createClient } from "@syncport/sdk";

type CsvRow = { name: string; email: string };

// --- Core API: fluent transformer ---
const transformer = new Transformer();

const hubspotResult = transformer.use(new HubspotAdapter()).transform({
  name: "Ali",
  email: "ali@gmail.com",
});

console.log("HubSpot payload:");
console.log(JSON.stringify(hubspotResult, null, 2));

// --- CSV export ---
const csvResult = new Transformer()
  .use(new CsvAdapter())
  .transform<CsvRow[], CsvExportPayload>([
    { name: "Ali", email: "ali@gmail.com" },
    { name: "Sara", email: "sara@example.com" },
  ]);

console.log("\nCSV export:");
console.log(csvResult.content);

// --- SDK client with adapter registration ---
const client = createClient({ defaultAdapter: "hubspot" });
client.register(new HubspotAdapter());
client.register(new CsvAdapter());

const sdkResult = client.exportData({
  name: "Ali",
  email: "ali@gmail.com",
});

console.log("\nSDK export (HubSpot):");
console.log(JSON.stringify(sdkResult, null, 2));
