# Veyntis API

Fastify backend for the Veyntis website.

## Local development

From the repository root:

```bash
npm run dev:api
```

From this directory:

```bash
npm install
npm run dev
```

## Vercel deployment

The backend is deployed as the separate Vercel project `veyntis-backend` (formerly `aivanta-backend`). If you reconnect or recreate it from the renamed GitHub repository, set:

- **Root Directory:** `server`
- **Framework Preset:** Fastify (or use Vercel's automatic detection)
- **Build Command:** leave empty/default
- **Output Directory:** leave empty/default

The Vercel entrypoint is `server/index.ts`, which exports the Fastify app and only calls `listen()` outside Vercel. Vercel's current Node backend model detects framework entrypoints and deploys them as backend functions. 

Set these environment variables in the API project:

```text
API_ORIGIN=https://veyntis.vercel.app
DATABASE_URL=...
ADMIN_TOKEN=...
AI_VENDOR=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5
AI_RETRIEVAL=semantic
AI_EMBEDDING_MODEL=text-embedding-3-small
CRM_PROVIDER=hubspot
HUBSPOT_ACCESS_TOKEN=...
RESEND_API_KEY=...
LEAD_NOTIFICATION_TO=...
LEAD_NOTIFICATION_FROM=...
```

After updating `API_ORIGIN` in the backend project's production environment, redeploy that project and verify:

```text
https://<api-project>.vercel.app/api/health
```

Expected response:

```json
{"ok":true,"service":"veyntis-api"}
```

Then set the frontend project's `VITE_API_BASE_URL` to the API project's production URL and redeploy the frontend.

## Public API documentation

- `https://veyntis-backend.vercel.app/` — backend overview
- `https://veyntis-backend.vercel.app/docs` — OpenAPI explorer (Swagger UI loaded from a third-party CDN; direct JSON link provided if blocked)
- `https://veyntis-backend.vercel.app/openapi.json` — OpenAPI 3.0 specification
- `https://veyntis-backend.vercel.app/api/health` — liveness only, not a database check

Documentation is public; admin endpoints require the `ADMIN_TOKEN` bearer header. Do not enter the production admin token into an untrusted client or shared browser.

**Vercel configuration:** Set root directory to `server`, use the Fastify framework/entrypoint `index.ts`, and verify that requests are routed to the Fastify handler. Successful builds alone do not prove that these endpoints are reachable. If the hostname gives a 404 before reaching Fastify, inspect project Root Directory, Framework Preset and build output.
