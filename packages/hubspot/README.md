# @syncport/hubspot

HubSpot CRM adapter for [Syncport](https://github.com/pakizahsaqib/syncport) — transform JSON into HubSpot contact-style payloads.

## Install

```bash
npm install @syncport/core @syncport/hubspot
```

## Quick start

```typescript
import { transform } from "@syncport/core";
import { HubspotAdapter } from "@syncport/hubspot";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .use(new HubspotAdapter())
  .export();
```

## Links

- [Playground](https://syncport.vercel.app/playground) — try HubSpot output live
- [GitHub](https://github.com/pakizahsaqib/syncport)
- [@syncport/core](https://www.npmjs.com/package/@syncport/core)

## License

MIT
