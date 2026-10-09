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
- [ ] Keep the backend hostname until verified; the frontend rename does not automatically rename its separate backend.
- [ ] Verify a sending domain and set `LEAD_NOTIFICATION_FROM` accordingly; don't use an old or unverified address.
- [ ] Verify Veyntis name, trademark and future custom-domain availability before formal brand registration.
- [ ] Update booking, CRM provider labels and public external links when new URLs are known.
- [ ] Preserve historical database records, API routes and `aivanta-*` sessionStorage keys unless a migration is justified.

## Additional production audit — 2026-10-09
- [ ] Confirm `DATABASE_URL` points to an active and migrated database. The connected Supabase project named `aivanta` currently reports `INACTIVE`.
- [x] Fix same-tab assessment/chat → contact handoff.
- [x] Make demo capability selection interactive.
- [x] Refuse serverless lead submissions without a persistent database instead of acknowledging transient storage.
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
