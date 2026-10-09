# Veyntis deployment and cutover checklist

## Confirmed identity
- [x] GitHub repository renamed to [timothynn/Veyntis](https://github.com/timothynn/Veyntis).
- [x] Vercel frontend project renamed to `veyntis`.
- [x] Public frontend hostname selected: [veyntis.vercel.app](https://veyntis.vercel.app/).
- [x] Website's canonical link, Open Graph URL, robots.txt and sitemap aligned in source code.

## Still requires account-level verification
- [ ] Ensure Vercel frontend production alias `veyntis.vercel.app` serves the latest deployment (cannot confirm through source code).
- [ ] Set the **existing backend** project environment variable `API_ORIGIN=https://veyntis.vercel.app` for production (and appropriate preview origins if needed); redeploy backend.
- [ ] Confirm that frontend `VITE_API_BASE_URL` is still pointing at the existing backend project URL; only change it if backend URL changes. Redeploy frontend after a change.
- [ ] Confirm Vercel frontend/backend Git integration still tracks `timothynn/Veyntis` after GitHub rename.
- [x] The two Vercel projects are now named `veyntis` and `veyntis-backend` (confirmed via Vercel project listing).
- [ ] Check that `VITE_API_BASE_URL` points to the actual backend hostname, expected `https://veyntis-backend.vercel.app`, and redeploy frontend if adjusted.
- [ ] Verify a sending domain and set `LEAD_NOTIFICATION_FROM` accordingly; don't use an old or unverified address.
- [ ] Verify Veyntis name, trademark and future custom-domain availability before formal brand registration.
- [ ] Update booking, CRM provider labels and public external links when new URLs are known.
- [ ] Preserve historical database records, API routes and `aivanta-*` sessionStorage keys unless a migration is justified.

## Additional production audit — 2026-10-09
- [ ] Confirm `DATABASE_URL` points to an active and migrated database. The connected Supabase project named `aivanta` currently reports `INACTIVE`.
- [x] Fix same-tab assessment/chat → contact handoff.
- [x] Make demo capability selection interactive.
- [x] Refuse serverless lead submissions without a persistent database instead of acknowledging transient storage.
- [x] Validate lead-response shape so static HTML (SPA fallback) cannot falsely produce a success confirmation.
- [x] Prevent failed email notifications from causing a false failure after a lead has been stored.
- [x] Disable redundant automatic GitHub Pages deploy workflow (Vercel remains production).
- [ ] Diagnose GitHub Actions jobs failing before any runner steps; this may require GitHub account/repository settings.
- [ ] Verify end-to-end lead intake, persistent storage, email notifications and Vite frontend API base URL.

## End-to-end smoke tests
- [ ] Load `https://veyntis.vercel.app/` on mobile and desktop, test navigation, accessibility and page layout.
- [ ] Check `/robots.txt` and `/sitemap.xml` respond with the new hostname.
- [ ] Verify `/og-image.svg`, favicon and social preview.
- [ ] Use the interactive Custom App / CRM / DMS / ERP demo.
- [ ] Complete assessment and ensure its context appears in the contact form.
- [ ] Submit a controlled test lead; verify storage and notification.
- [ ] Check chatbot and opportunity brief generation.
- [ ] Check `/status` and `/admin` as authorized.
- [ ] Run `npm ci && npm run typecheck && npm test && npm run build`.

## Business safeguards
- Do not claim unverified customer engagements, testimonials or performance numbers.
- Do not expose employer clients or confidential implementation details.
- Review employment conflict-of-interest / intellectual-property commitments before client work.

## API explorer and realistic launch checks

- [x] Added an API overview at backend `/` and OpenAPI 3 description at `/openapi.json`.
- [x] Added Swagger-style `/docs` API explorer; its frontend assets are CDN-hosted with direct JSON fallback.
- [x] Added a candid About the Studio section rather than presenting hypothetical projects as previous clients.
- [ ] Verify backend Vercel Root Directory is `server` and Fastify entrypoint is detected correctly.
- [ ] Verify public backend routes `/`, `/docs`, `/openapi.json`, `/api/health` respond on production hostname.
- [ ] Confirm backend `DATABASE_URL` is configured for the ACTIVE_HEALTHY Veyntis Supabase project, and `VITE_API_BASE_URL` points to `https://veyntis-backend.vercel.app`.
- [ ] Confirm contact email deliverability (verified sender and recipient) and successfully persist a consenting, controlled test enquiry.
- [ ] Replace generic copy with actual documented deliverables, a founder/team introduction, a real contact method, an enquiry response SLA, and approved case studies as earned.
- [ ] Publish full data protection/privacy terms describing controller identity, retention periods, vendors and enquiry rights before accepting sensitive business enquiries.
- [ ] Fix GitHub Actions runner initialization before relying on CI; Vercel checks confirm deployments, not test suite results.
