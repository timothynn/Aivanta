# Aivanta production setup: Supabase + Vercel

Aivanta is deployed as two Vercel projects from the same repository:

- **Aivanta Web** — repository root, React/Vite frontend.
- **Aivanta Backend** — `server/` root directory, Fastify API.

## 1. Supabase

The Supabase project URL is useful for Supabase client integrations, but the Fastify API uses PostgreSQL through `DATABASE_URL`.

In Supabase, open **Connect** and copy a PostgreSQL connection string. For a Vercel/serverless backend, prefer the transaction pooler connection when appropriate (typically port `6543`). Do not commit the connection string or database password.

Apply migrations in this order from the Supabase SQL Editor:

```text
server/migrations/001_init.sql
server/migrations/002_opportunity_briefs.sql
server/migrations/003_lead_qualification.sql
```

## 2. Aivanta Backend Vercel project

Project: `aivanta-backend`

Root Directory:

```text
server
```

Server-side environment variables:

```text
DATABASE_URL=<Supabase PostgreSQL connection string>
API_ORIGIN=https://aivanta-beryl.vercel.app
ADMIN_TOKEN=<random secret>

AI_VENDOR=openai
OPENAI_API_KEY=<secret>
OPENAI_MODEL=<model>
AI_RETRIEVAL=semantic
AI_EMBEDDING_MODEL=text-embedding-3-small

CRM_PROVIDER=hubspot
HUBSPOT_ACCESS_TOKEN=<secret>

RESEND_API_KEY=<secret>
LEAD_NOTIFICATION_TO=<your notification email>
LEAD_NOTIFICATION_FROM=<verified sender>
```

Only the variables needed for enabled integrations need to be set.

## 3. Aivanta Web Vercel project

Project: existing Aivanta frontend.

Add:

```text
VITE_API_BASE_URL=https://aivanta-backend.vercel.app
```

Redeploy the frontend after changing the variable.

## 4. Verify connectivity

Backend:

```text
https://aivanta-backend.vercel.app/api/health
```

Frontend status page:

```text
https://aivanta-beryl.vercel.app/status
```

Then test the end-to-end flow:

```text
Assistant -> Opportunity Brief -> Contact -> PostgreSQL -> CRM
```

## 5. Security notes

- The database password should never be placed in GitHub.
- Rotate any credential that has been exposed in chat, screenshots, logs, or source control.
- Keep `DATABASE_URL`, AI provider keys, HubSpot tokens, Resend keys, and `ADMIN_TOKEN` server-side only.
- Do not use a `VITE_` prefix for secrets.
- Prefer least-privilege integration credentials.
