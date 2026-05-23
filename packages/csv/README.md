# @syncport/csv

CSV export adapter for [Syncport](https://github.com/pakizahsaqib/syncport) — transform JSON into comma-separated text.

## Install

```bash
npm install @syncport/core @syncport/csv
```

## Quick start

```typescript
import { Transformer } from "@syncport/core";
import { CsvAdapter } from "@syncport/csv";

const { content, columns, rowCount } = new Transformer()
  .use(new CsvAdapter({ columns: ["name", "email"] }))
  .transform({ name: "Ali", email: "ali@gmail.com" });
```

## Links

- [Playground](https://syncport.vercel.app/playground) — try CSV export live
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [@syncport/core](https://www.npmjs.com/package/@syncport/core)

## License

MIT
