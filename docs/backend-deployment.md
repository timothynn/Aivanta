# Veyntis backend deployment

## Current architecture

The production frontend is a Vite build. The Fastify API lives in `server/` and is built separately with `npm run build:api`.

The frontend uses `VITE_API_BASE_URL` when configured; otherwise it calls `/api/...` on the same origin.

## Important deployment finding

The repository's root `vercel.json` rewrites frontend requests to `/index.html` for SPA routing. The frontend and Fastify backend are deployed as separate Vercel projects. The root frontend build (`npm run build`) does not itself deploy `server/index.ts`.

A production deployment is connected to the Fastify backend only when `VITE_API_BASE_URL` points to a separately deployed API, or when a future Vercel serverless adapter is introduced.

## Recommended production setup

For the current architecture, maintain the Fastify API as a separate Vercel project and configure:

```text
VITE_API_BASE_URL=https://<api-host>
```

Set the backend `API_ORIGIN=https://veyntis.vercel.app` in its production environment. Backend environment variables should also include the PostgreSQL connection, AI provider, admin token, CRM configuration, and notification settings.

## Health check

The frontend now exposes `/status`, which calls:

```text
GET <VITE_API_BASE_URL>/api/health
```

This is the fastest way to verify whether the deployed website can reach its configured backend.

## Future option

A Vercel-native API adapter can be introduced later if keeping frontend and backend in one deployment becomes desirable. Keep the existing application/domain layers independent from the hosting adapter so the same Fastify business logic can be reused.
