# @syncport/sdk

High-level Syncport client for registering adapters and exporting data with a simple API.

## Install

```bash
npm install @syncport/sdk @syncport/core @syncport/hubspot
```

Add optional adapters as needed (`@syncport/csv`, `@syncport/airtable`, etc.).

## Quick start

```typescript
import { createClient } from "@syncport/sdk";
import { HubspotAdapter } from "@syncport/hubspot";
import { CsvAdapter } from "@syncport/csv";

const client = createClient({ defaultAdapter: "hubspot" });
client.register(new HubspotAdapter());
client.register(new CsvAdapter());

const hubspot = client.exportData({ name: "Ali", email: "ali@gmail.com" });

const csv = client.exportData([{ name: "Ali", email: "ali@gmail.com" }], {
  adapter: "csv",
});
```

## Links

- [Playground](https://syncport.vercel.app/playground) — try all adapters in the browser
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [@syncport/core](https://www.npmjs.com/package/@syncport/core)

## License

MIT
