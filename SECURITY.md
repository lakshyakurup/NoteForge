# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ |
| < 1.0   | ❌ |

## Reporting a vulnerability

Please open a **private** security advisory on GitHub or email the maintainer. Do not open public issues for sensitive reports.

We aim to respond within 7 days.

## Notes for deployers

- Never commit `.env.local`.
- Restrict API keys by HTTP referrer / IP when the provider allows it.
- Rate-limit `/api/generate` at the edge (Vercel / Cloudflare) in production.
