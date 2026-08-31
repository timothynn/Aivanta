# Aivanta API

Fastify backend for the Aivanta website.

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

Create a second Vercel project from the same GitHub repository and set:

- **Root Directory:** `server`
- **Framework Preset:** Fastify (or use Vercel's automatic detection)
- **Build Command:** leave empty/default
- **Output Directory:** leave empty/default

The Vercel entrypoint is `server/index.ts`, which exports the Fastify app and only calls `listen()` outside Vercel. Vercel's current Node backend model detects framework entrypoints and deploys them as backend functions. 

Set these environment variables in the API project:

```text
API_ORIGIN=https://aivanta-beryl.vercel.app
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

After deployment, verify:

```text
https://<api-project>.vercel.app/api/health
```

Expected response:

```json
{"ok":true,"service":"aivanta-api"}
```

Then set the frontend project's `VITE_API_BASE_URL` to the API project's production URL and redeploy the frontend.
