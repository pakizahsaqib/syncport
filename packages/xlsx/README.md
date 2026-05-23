# @syncport/xlsx

XLSX workbook export adapter for [Syncport](https://github.com/pakizahsaqib/syncport) — transform JSON into Excel-compatible workbooks (SheetJS).

## Install

```bash
npm install @syncport/core @syncport/xlsx
```

## Quick start

```typescript
import { transform } from "@syncport/core";
import { XlsxAdapter } from "@syncport/xlsx";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .use(new XlsxAdapter())
  .export();
```

## Links

- [Playground](https://syncport.vercel.app/playground) — try XLSX export live
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [@syncport/core](https://www.npmjs.com/package/@syncport/core)

## License

MIT
