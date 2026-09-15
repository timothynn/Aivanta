# Aivanta backend deployment

## Current architecture

The production frontend is a Vite build. The Fastify API lives in `server/` and is built separately with `npm run build:api`.

The frontend uses `VITE_API_BASE_URL` when configured; otherwise it calls `/api/...` on the same origin.

## Important deployment finding

The repository contains a `vercel.json` SPA rewrite. The default build is the Vite frontend (`npm run build`); this rewrite does not deploy `server/index.ts` as an API. `submitLead` validates the success payload, so an HTML fallback can no longer be mistaken for a saved enquiry.

A production deployment is connected to the Fastify backend only when `VITE_API_BASE_URL` points to a separately deployed API, or when a future Vercel serverless adapter is introduced.

## Recommended production setup

For the current architecture, deploy the Fastify API as a separate Node service and configure:

```text
VITE_API_BASE_URL=https://<api-host>
```

Set `NODE_ENV=production`. Startup now requires `DATABASE_URL`, `ADMIN_TOKEN`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_TO`, `LEAD_NOTIFICATION_FROM`, and `API_ORIGIN`. This prevents silent use of disposable memory storage or console-only notifications in production. Configure optional AI and CRM providers only when needed. Configuration presence does not verify database connectivity, email-domain verification or delivery.

Apply migrations 001–003 to the intended database using your existing migration procedure. The retry change uses the existing UUID primary key and needs no new schema migration. Do not apply test migrations to production.

The browser supplies a UUID for an enquiry attempt and reuses it for unchanged retries while the form remains mounted. PostgreSQL enforces uniqueness; conflicting payloads using the same identifier receive 409. Edits create a new attempt. A page reload starts a new attempt. A stored enquiry is acknowledged even if notification fails; the server logs the lead ID for manual review in admin. Email has a ten-second timeout and a provider idempotency key. There is no durable email retry queue yet; monitor saved enquiries and logs rather than assuming every notification arrives.

The build creates `dist/logistics/index.html` for direct static visits, with root-relative assets supporting `/logistics` and `/logistics/`. The site assumes root hosting (Vercel, a custom domain, or a root GitHub Pages site). A GitHub project subpath needs coordinated changes to navigation, asset paths and Vite base before deployment.

CI now runs typechecking, the API build, frontend build and tests including a disposable PostgreSQL service. Locally, the database integration test runs when `TEST_DATABASE_URL` points to a dedicated database named `aivanta_test`; it uses a unique temporary schema and removes only that schema after testing.

## Health check

The frontend now exposes `/status`, which calls:

```text
GET <VITE_API_BASE_URL>/api/health
```

This is the fastest way to verify whether the deployed website can reach its configured backend.

## Future option

A Vercel-native API adapter can be introduced later if keeping frontend and backend in one deployment becomes desirable. Keep the existing application/domain layers independent from the hosting adapter so the same Fastify business logic can be reused.
