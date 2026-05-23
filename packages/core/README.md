# @syncport/core

Generic transformation engine, mapping system, and adapter architecture for [Syncport](https://github.com/pakizahsaqib/syncport).

## Install

```bash
npm install @syncport/core
```

## Quick start

```typescript
import { transform } from "@syncport/core";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .export();
```

Pair with destination adapters (`@syncport/hubspot`, `@syncport/csv`, etc.) via `.use(adapter)`.

## Features

- Fluent `transform()` pipeline API
- Field mapping and validation
- Pluggable `Adapter` interface for CRM and export targets

## Links

- [Playground](https://syncport.vercel.app/playground) — try transforms in the browser
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [Report issues](https://github.com/pakizahsaqib/syncport/issues)

## License

MIT
