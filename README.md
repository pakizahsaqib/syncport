# Syncport

**Developer-first data transformation and export engine** — convert generic JSON into CRM-compatible payloads (HubSpot, Airtable, CSV, and more).

[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)]()

## Features

- **Generic transformation engine** — fluent `Transformer` API
- **Adapter architecture** — plug in destination-specific packages
- **Mapping utilities** — declarative field maps and nesting
- **Validation** — schema checks before transform
- **Dual builds** — ESM + CommonJS with TypeScript declarations
- **Tree-shakeable** — modular `@syncport/*` packages

## Installation

```bash
# Core only
pnpm add @syncport/core

# With adapters
pnpm add @syncport/core @syncport/hubspot @syncport/csv

# High-level SDK
pnpm add @syncport/sdk @syncport/hubspot
```

## Quick start

```typescript
import { Transformer } from "@syncport/core";
import { HubspotAdapter } from "@syncport/hubspot";

const transformer = new Transformer();

const result = transformer.use(new HubspotAdapter()).transform({
  name: "Ali",
  email: "ali@gmail.com",
});

console.log(result);
// {
//   properties: {
//     firstname: "Ali",
//     email: "ali@gmail.com"
//   }
// }
```

## SDK usage

```typescript
import { createClient } from "@syncport/sdk";
import { HubspotAdapter } from "@syncport/hubspot";
import { CsvAdapter } from "@syncport/csv";

const client = createClient({ defaultAdapter: "hubspot" });
client.register(new HubspotAdapter());
client.register(new CsvAdapter());

const hubspot = client.exportData({ name: "Ali", email: "ali@gmail.com" });

const csv = client.exportData(
  [{ name: "Ali", email: "ali@gmail.com" }],
  { adapter: "csv" },
);
```

## CSV export

```typescript
import { Transformer } from "@syncport/core";
import { CsvAdapter } from "@syncport/csv";

const { content, columns, rowCount } = new Transformer()
  .use(new CsvAdapter({ columns: ["name", "email"] }))
  .transform({ name: "Ali", email: "ali@gmail.com" });
```

## Monorepo structure

```
syncport/
├── packages/
│   ├── core/       @syncport/core
│   ├── hubspot/    @syncport/hubspot
│   ├── airtable/   @syncport/airtable
│   ├── csv/        @syncport/csv
│   └── sdk/        @syncport/sdk
├── examples/basic/
└── docs/
```

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm lint

# Run example
pnpm --filter @syncport/example-basic start
```

## Creating an adapter

1. Add a package under `packages/` depending on `@syncport/core`.
2. Implement the `Adapter` interface:

```typescript
import type { Adapter } from "@syncport/core";

export class MyCrmAdapter implements Adapter<MyInput, MyOutput> {
  readonly name = "mycrm";

  transform(data: MyInput): MyOutput {
    return { /* destination payload */ };
  }
}
```

3. Export types for input/output payloads.
4. Add Vitest tests and wire into Turbo `build` / `test`.

See [docs/architecture.md](./docs/architecture.md) for design details.

## Publishing

See [docs/publishing.md](./docs/publishing.md) for npm release steps and package order.

## Roadmap

- Salesforce, Zoho, Notion, Google Sheets adapters
- Webhook delivery helpers
- Queue worker recipes
- Hosted Cloud API

## Contributing

1. Fork and clone the repo
2. `pnpm install && pnpm build && pnpm test`
3. Create a feature branch
4. Add tests for new behavior
5. Open a PR with a clear description

Please follow existing TypeScript strict mode and ESLint/Prettier configs.

## License

MIT
