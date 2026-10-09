# VEYNTIS

**Website:** https://veyntis.vercel.app/  
**Repository:** https://github.com/timothynn/Veyntis

**Applied AI & Systems Engineering** · *Intelligence, engineered into your operations.*

Veyntis is an independent engineering studio focused on making existing business software more useful with practical AI. We connect applications, documents, data and workflows through well-scoped, measurable integrations.

> Your systems already work. Make them work smarter.

## What we engineer

| Solution | Outcome |
| --- | --- |
| **AI Integration** | AI features inside existing applications and APIs |
| **Workflow Intelligence** | Scoped automation, agent-assisted tasks and human approval |
| **Knowledge Systems** | Grounded search, document intelligence and accessible company knowledge |

## How we work

**Discover → Prove → Scale.** Start with one real workflow and a clear baseline; expand only after measuring results.

Focus domains include aviation, logistics, financial systems, professional services and enterprise software. These are areas of interest and expertise, **not** customer claims.

## Site and architecture

- **Frontend:** React 19, TypeScript, Vite, responsive CSS
- **Interactive:** system transformation demo, opportunity assessment, contact journey and business assistant
- **API:** Fastify, Postgres-backed leads/analytics when configured, AI provider adapters, optional CRM/email integrations
- **Safeguards:** permissions, source-aware answers, human review and honest example labeling

```bash
npm ci
npm run dev:full       # frontend + local API
npm run typecheck
npm test
npm run build
```

`VITE_API_BASE_URL` points the frontend at the deployed API when they use separate Vercel projects. See `server/README.md` and `docs/production-supabase-vercel.md`.

## Rollout

GitHub repository: `timothynn/Veyntis`. Frontend project: `veyntis`. Public web URL: `https://veyntis.vercel.app/`. The backend project is named `veyntis-backend`; its frontend-facing `VITE_API_BASE_URL`, active database configuration, verified email sender and legacy internal storage keys still require explicit verification; historical keys deliberately remain compatible. Follow [the cutover checklist](docs/REBRAND-CHECKLIST.md).

Client examples in this repository are illustrative unless explicitly documented otherwise. No confidential employer or customer implementations are represented.

Website code © its author. No additional license is implied.
