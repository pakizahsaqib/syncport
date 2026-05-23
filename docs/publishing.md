# Publishing Guide

## Prerequisites

- npm account with access to `@syncport` scope (or your org scope)
- `pnpm` and Node.js 18+
- Logged in: `npm login`

## Versioning

Packages use [Semantic Versioning](https://semver.org/). Bump versions in each package `package.json` before publish.

Recommended: use [Changesets](https://github.com/changesets/changesets) for coordinated releases (optional follow-up).

## Build before publish

```bash
pnpm install
pnpm build
pnpm test
```

## Publish order

Publish dependencies first:

1. `@syncport/core`
2. `@syncport/hubspot`, `@syncport/airtable`, `@syncport/csv`, `@syncport/sheets`, `@syncport/xlsx`
3. `@syncport/sdk`

From each package directory:

```bash
cd packages/core
pnpm publish --access public
```

Or from root with pnpm filter:

```bash
pnpm --filter @syncport/core publish --access public
pnpm --filter @syncport/hubspot publish --access public
pnpm --filter @syncport/airtable publish --access public
pnpm --filter @syncport/csv publish --access public
pnpm --filter @syncport/sheets publish --access public
pnpm --filter @syncport/xlsx publish --access public
pnpm --filter @syncport/sdk publish --access public
```

## package.json checklist

Each published package includes:

- `name`: `@syncport/<package>`
- `version`: semver (bump before each publish)
- `description`: unique one-line summary for npm search
- `keywords`: shared + package-specific terms for npm discoverability
- `homepage`: `https://syncport.vercel.app/playground`
- `repository`: git URL with `directory` pointing at `packages/<name>`
- `bugs`: GitHub issues URL
- `publishConfig.access`: `"public"`
- `exports`: ESM + CJS + types
- `files`: `["dist", "README.md"]` (README appears on the npm package page)
- `sideEffects`: `false` for tree shaking

Repo changes do not update npm until you publish a new version.

## CI suggestion

```yaml
- run: pnpm install
- run: pnpm build
- run: pnpm test
- run: pnpm publish -r --access public
  if: github.ref == 'refs/heads/main'
```

Use `NPM_TOKEN` in CI secrets.
