# @syncport/sheets

Google Sheets row adapter for [Syncport](https://github.com/pakizahsaqib/syncport) — browser-compatible JSON to sheet-ready rows.

## Install

```bash
npm install @syncport/core @syncport/sheets
```

## Quick start

```typescript
import { transform } from "@syncport/core";
import { SheetsAdapter } from "@syncport/sheets";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .use(new SheetsAdapter())
  .export();
```

## Links

- [Playground](https://syncport.vercel.app/playground) — try Google Sheets output live
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [@syncport/core](https://www.npmjs.com/package/@syncport/core)

## License

MIT
