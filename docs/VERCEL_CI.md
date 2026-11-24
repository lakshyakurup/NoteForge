# Vercel CI setup (NoteForge)

NoteForge is configured for **Vercel CI** via Turborepo task tags.

## What we added

| File | Purpose |
|------|---------|
| `turbo.json` | Task graph; `lint`, `typecheck`, `test` tagged with `"ci"` |
| `package.json` | `turbo` devDependency + `npm run ci` |
| `.github/workflows/ci.yml` | Fallback GitHub Actions (still useful for forks / open source) |

## Enable Vercel CI (one-time, on your machine)

1. Install / update Vercel CLI:
   ```bash
   npm i -g vercel@latest
   ```
2. From the repo root (linked to your Vercel project):
   ```bash
   vercel link   # if not already linked
   vercel ci enable
   ```
3. Push to `main`. Vercel CI will run every task tagged `"ci"` in `turbo.json`.

## Tasks that run in Vercel CI

- `lint` → `next lint`
- `typecheck` → `tsc --noEmit`
- `test` → `vitest run`

`build` is **not** tagged `ci` by default (Vercel already builds on deploy). Add `"tags": ["ci"]` under `build` in `turbo.json` if you want a full production build in CI as well.

## Local check

```bash
npm install
npm run ci
```

## Dashboard

Team → **CI** tab on Vercel shows runs and logs after `vercel ci enable`.
