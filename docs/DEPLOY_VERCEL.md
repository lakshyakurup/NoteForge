# Deploy NoteForge on Vercel

## 1. Import the project

1. Open [vercel.com/new](https://vercel.com/new)
2. Import `lakshyakurup/NoteForge`
3. Framework preset: **Next.js** (auto-detected via `vercel.json`)
4. Root directory: `.` (default)

## 2. Environment variables

In **Project → Settings → Environment Variables**, add:

| Name | Required | Environments | Notes |
|------|----------|--------------|--------|
| `GEMINI_API_KEY` | One of the two AI keys | Production, Preview | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `OPENAI_API_KEY` | One of the two AI keys | Production, Preview | [OpenAI](https://platform.openai.com/api-keys) |
| `AI_PROVIDER` | Optional | Production, Preview | `gemini` or `openai` |
| `NEXT_PUBLIC_DEMO_MODE` | Optional | Preview | `true` for judge demos without keys |

> Server-only keys (`GEMINI_*`, `OPENAI_*`) must **not** use the `NEXT_PUBLIC_` prefix.

## 3. Deploy

Click **Deploy**. After the first success:

- Production URL: `https://<project>.vercel.app`
- Health check: `GET /api/health` → `{ ok: true, ai: { ready: true/false } }`

## 4. Custom domain (optional)

**Project → Settings → Domains** → add your domain and follow DNS instructions.

## 5. Vercel CI (optional)

```bash
npx vercel link
npx vercel ci enable
```

See [VERCEL_CI.md](./VERCEL_CI.md).

## 6. Troubleshooting

| Symptom | Fix |
|---------|------|
| Vulnerable Next.js warning | Ensure `next` is `15.5.29+` (already in `package.json`) |
| AI generation 500 | Check env vars are set for that environment; hit `/api/health` |
| Build needs lockfile | Run `npm install` locally and commit `package-lock.json` |
| PDF upload fails in prod | Browser-only `pdfjs`; ensure HTTPS and allow pop-ups for export |
