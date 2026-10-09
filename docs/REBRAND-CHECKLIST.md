# Veyntis deployment and cutover checklist

The repository is intentionally still named `timothynn/Aivanta` until GitHub repository settings are changed by its owner. The prior deployment and sender domains must stay functional until the new ones are verified.

## Before changing the public URL
- [ ] Verify **Veyntis** business name, trademark, domain and social handle availability.
- [ ] Purchase and connect the chosen domain in Vercel.
- [ ] Confirm whether the `aivanta` frontend and `aivanta-backend` Vercel projects should be renamed.
- [ ] Update the backend's `API_ORIGIN` for the new frontend URL.
- [ ] Update frontend `VITE_API_BASE_URL` only if the API hostname changes.
- [ ] Update `public/sitemap.xml` and `public/robots.txt` to point to the final canonical URL.
- [ ] Update the canonical URL and absolute Open Graph image URL once the final domain is known.
- [ ] Verify the email sender domain with the provider, then update `LEAD_NOTIFICATION_FROM` and `LEAD_NOTIFICATION_TO` as needed.
- [ ] Update any CRM integration names, booking URLs and partner links once verified.
- [ ] Review any `aivanta-*` sessionStorage keys only after an explicit client-state migration plan; legacy keys preserve in-progress lead briefs.
- [ ] Preserve database schema, API endpoints, historical lead events, and operational secrets.

## Smoke tests
- [ ] Open the homepage on mobile and desktop; verify all anchor links and responsive nav.
- [ ] Cycle Custom App / CRM / Document system / ERP scenarios in the demo.
- [ ] Complete the opportunity assessment and verify it populates the contact context.
- [ ] Submit a test lead and confirm it persists and notifies the configured recipient.
- [ ] Test the assistant and opportunity brief flow; verify the Veyntis name in replies.
- [ ] Verify `/status`, `/admin`, privacy and AI-use content.
- [ ] Validate the SEO title, favicon and Open Graph image on the final domain.
- [ ] Run `npm ci && npm run typecheck && npm test && npm run build`.

## Legal and data
- The brand has not been independently trademark-cleared.
- Do not publish employer client names, confidential work or invented performance metrics.
- Confirm any employment-related conflict of interest and IP ownership before taking clients.
