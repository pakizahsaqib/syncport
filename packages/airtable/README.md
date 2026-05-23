# @syncport/airtable

Airtable adapter for [Syncport](https://github.com/pakizahsaqib/syncport) — transform JSON into Airtable record fields.

## Install

```bash
npm install @syncport/core @syncport/airtable
```

## Quick start

```typescript
import { transform } from "@syncport/core";
import { AirtableAdapter } from "@syncport/airtable";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .use(new AirtableAdapter())
  .export();
```

## Links

- [Playground](https://syncport.vercel.app/playground) — try Airtable output live
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [@syncport/core](https://www.npmjs.com/package/@syncport/core)

## License

MIT
