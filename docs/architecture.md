# Syncport Architecture

## Overview

Syncport is a modular monorepo built around a small **core transformation engine** and pluggable **adapters** for destination-specific payloads.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  JSON input │ ──► │ Transformer  │ ──► │ Adapter (target)│
└─────────────┘     │  + validate  │     │ HubSpot, CSV…   │
                    └──────────────┘     └─────────────────┘
```

## Packages

| Package | Role |
|---------|------|
| `@syncport/core` | `Transformer`, `Adapter` interface, mapping & validation utilities |
| `@syncport/hubspot` | HubSpot contact `properties` payloads |
| `@syncport/airtable` | Airtable `fields` payloads |
| `@syncport/csv` | CSV string export |
| `@syncport/sdk` | `createClient()`, `exportData()`, adapter registry |

## Adapter contract

Every integration implements `Adapter<TInput, TOutput>`:

- `name` — unique identifier (`"hubspot"`, `"csv"`, …)
- `transform(data)` — map source JSON to destination shape
- `validate?(data)` — optional pre-flight validation

## Extension points (future)

New destinations follow the same pattern:

1. Create `packages/<name>/` with `tsup`, Vitest, and workspace dependency on `@syncport/core`.
2. Implement `Adapter` with typed input/output interfaces.
3. Register in SDK or use via `Transformer.use()`.

Planned integrations (Salesforce, Zoho, Notion, Google Sheets) slot in as new packages without changing core.

## Cross-cutting concerns

- **Queue workers / webhooks**: Run `exportData()` or `transform()` in workers; payloads are plain JSON/CSV strings.
- **Cloud API**: Wrap `@syncport/sdk` in an HTTP layer; adapters remain stateless.
- **Validation**: Core `validateSchema` + per-adapter rules; `Transformer` respects `strict` option.

## Build graph

TurboRepo runs `build` with `dependsOn: ["^build"]` so dependents always compile against fresh upstream `dist/` output.
