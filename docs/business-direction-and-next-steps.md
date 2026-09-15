# Aivanta: business direction and next implementation steps

Assessment date: 11 September 2026. Based on the repository, the supplied research, and current primary-source research. This is a proposed direction, not evidence of customer demand or approval to build the pilot.

## Recommendation

Keep Aivanta as an engineering-led AI integration consultancy. Make the first sellable offer narrow: **shipment document checking and preparation for logistics teams, connected to the tools they already use**. Validate it with LPC and the relevant KLN Kenya contact before committing to a production build.

The business should initially sell a repeatable service: paid workflow assessment, fixed-scope pilot, then separately priced support and improvements. Reuse implementation patterns internally; defer a multi-customer SaaS product until repeated paid engagements justify one.

Suggested logistics-page copy:

> Spend less time re-keying shipment documents and chasing missing information. Aivanta helps logistics teams check shipment files and prepare reviewed data for their existing systems.

This promises a direction of value, not an unmeasured percentage or automatic regulatory clearance.

## What the repository actually contains

The React/TypeScript frontend already has a substantial homepage, a four-question assessment, contact form, conversational discovery assistant, and admin interface. Fastify/PostgreSQL code supports leads, qualification, notifications, analytics, opportunity briefs and CRM adapters. These are implemented foundations, not proof of a working production deployment.

The Labs cards are illustrative links into the assessment. The transformation selector changes explanatory content. Neither processes customer documents. The assistant retrieves curated Aivanta company information; it is not a shipment-document intelligence pipeline.

The strongest existing assets are the clear integration positioning, separation of backend adapters, and explicit prohibition on invented case studies. Preserve them. Stop expanding the marketing back office while testing demand.

## How I would modify the supplied advice

1. **Focus the offer without narrowing the whole company permanently.** Keep the broader brand; give logistics a dedicated landing page and demonstration. Aviation can remain background experience where appropriate.
2. **Keep the introductory conversation free and brief.** Sell a paid assessment only once there is a specific workflow, business owner and data-access path. Charging for all early conversations makes learning unnecessarily difficult.
3. **Do not infer buying authority from company size.** Approach LPC first if access is better, but explore a warm KLN introduction now. Confirm legal entity, sponsor and approval path before proposing a build.
4. **Spreadsheets are a valid starting point.** Email and CSV can be a bounded integration surface. A missing ERP does not automatically require a digitization programme; missing stable shipment identifiers and ownership are the more important blockers.
5. **Build a shipment-specific demonstration, not generic document chat.** Show evidence, inconsistencies, review and export. Use synthetic documents publicly; use authorized samples in a private evaluation.
6. **Publish after listening.** Conversations and one relevant demonstration should precede a large publishing schedule. Turn actual, nonconfidential findings into a short practical article.

Company and Kenyan trade-system corrections are recorded in [the market research](logistics-market-research.md).

## Competitive implication

CargoWise already markets AI commercial-invoice ingestion and integrated compliance workflows. This establishes competitive overlap, not adoption or availability at either prospect. Ask what their existing vendor already offers, what is licensed, and why it does not solve the specific workflow before proposing custom extraction. Aivanta can also earn revenue by configuring or integrating an existing capability when that is the better solution. [CargoWise ComplianceWise](https://www.cargowise.com/solutions/cargowise-customs/compliancewise/)

For future air-cargo integrations, IATA ONE Record provides a shipment data-sharing model and secured API specification. It is a possible compatibility direction if the client's partners use it, not a requirement to implement in the first pilot. [IATA ONE Record](https://www.iata.org/one-record)

## Opportunity order

These are hypotheses, not validated LPC or KLN pain points.

| Priority | Opportunity | Evidence needed before building | Pilot outcome |
| --- | --- | --- | --- |
| 1 | Shipment document checking and reviewed export | Repetitive re-entry; representative packs; stable shipment IDs; usable target import | Less total preparation and review time; measured field and discrepancy accuracy |
| 2 | Supplier invoice / job-cost reconciliation | Approved charges, supplier invoices and job-cost records | Supported discrepancies and missed billable charges for finance review |
| 3 | Free-time and release exception monitoring | Reliable events, actual carrier/terminal terms and an accountable operator | Timely actionable alerts, with false alerts and stale inputs measured |
| 4 | Shipment status reply drafts | Authorized current shipment events and repeated enquiries | Less response effort without unsupported status claims |
| 5 | Quote preparation | Current rate cards, validity dates, exclusions and approved margin rules | Faster reviewed quotes with deterministic calculations |
| Later | HS classification, regulatory knowledge, warehouse/transit automation | Current authoritative sources, specialist reviewers and required operational feeds | A separately evaluated capability with an explicit owner |

Invoice reconciliation deserves discovery because it can be evaluated against historical documents and often needs less live integration than monitoring. This is a hypothesis to compare with document checking, not a claim of known losses.

For deadline monitoring, model carrier demurrage, detention and terminal/CFS storage separately according to actual terms. Do not invent a universal free-time clock or attribute every delay to the forwarder. Estimated avoided charges are not realized savings without evidence.

## First pilot: Shipment File Check

Choose one team's inbound sea-freight workflow as a starting assumption; switch if discovery supports another mode. Start with commercial invoices, packing lists and bills of lading. Exclude unusual cargo and additional document classes until the initial scope works.

User flow:

1. Open a shipment and select its document pack.
2. Extract agreed fields, showing the source document/page for each value.
3. Compare equivalent references, parties, package counts, units and weights; verify arithmetic deterministically.
4. Show missing or conflicting information with supporting evidence and an owner.
5. Let the operator correct and approve values.
6. Export an agreed CSV/JSON template; add one approved system connector only after its contract is known.

Do not compare gross weight to net weight as if they were identical; do not treat invoice value as automatically equivalent to customs value. Route ambiguity to review. Requirements such as certificates depend on the actual goods and procedure; they cannot be universally inferred from three PDFs.

Keep customs filing, autonomous HS classification, duty determination, external message sending and production database writes outside the initial pilot.

### Proposed implementation boundary

- Reuse React, TypeScript, Fastify and PostgreSQL rather than rewriting the stack.
- Keep marketing chat and client document processing as separate modules and deployment/security boundaries. The public lead-admin bearer token is not client-workspace authentication.
- Add document storage, bounded background extraction, schema validation, source references, deterministic checks, human review and audit records.
- Represent shipment ID, document/version, extracted value, source location, discrepancy, reviewer and export receipt explicitly.
- Begin with one client deployment and client-approved access controls. Avoid building SaaS billing, tenant provisioning or a general agent framework.
- Treat document text as untrusted input. It must not authorize tools or override workflow rules. No model needs write access to a government system.
- Use versioned, repeatable exports and duplicate detection. Keep the client system authoritative; make processing failures visible and retryable.
- Agree data location, processors, access, deletion, retention and operating responsibilities before real documents enter the pilot. See the market research for the Kenya-specific legal sources and applicability caveats.

### Evaluation and stopping rules

Collect approximately 20–30 authorized representative historical packs for initial feasibility. Split development examples from unseen evaluation packs, including poor scans, amendments, missing pages and inconsistent units. This is an initial feasibility set, not enough to establish production reliability across all cargo.

Measure field-level accuracy by field, discrepancy precision/recall, unsupported values, total operator time including corrections, completion/failure rate, processing cost and support effort. Source links should resolve correctly. Unknown values should remain unknown.

Agree quantitative acceptance thresholds with the process owner after establishing the manual baseline. Every exported record requires human approval in the pilot. Stop or narrow scope if review takes as long as manual work, the existing vendor already solves the problem economically, data access cannot be approved, or nobody owns the workflow.

## Commercial design and side-hustle capacity

Offer a short introductory call, followed by a fixed-scope paid assessment with a workflow map, measured baseline, access/integration findings, a small sample evaluation and a go/no-go pilot specification. Quote the pilot separately. Credit part of the assessment fee against the pilot only if the economics support it.

Derive a fee from capped delivery hours, sustainable hourly return, external costs and contingency; compare this against measured client benefit. Do not copy an unsupported market price into the site. Publish a fixed fee or starting price once the scope and delivery effort are defensible.

Count saved staff time as capacity, not automatically cash savings. A useful model is monthly jobs multiplied by net minutes saved divided by 60, multiplied by agreed loaded hourly cost, less ongoing operating costs. Add recoveries or avoided charges only with evidence and without double counting.

Run one pilot at a time. Specify business-hours support, who handles incidents, included changes and usage costs. A deadline-critical 24/7 operational promise is a poor first commitment alongside another job.

## Next 30 days, subject to access and available hours

| Sequence | Work | Completion gate |
| --- | --- | --- |
| Week 1 | Speak with LPC and the relevant KLN contact; observe one real workflow; identify systems and existing features | Named operator and sponsor, repeated pain, sample-access path and baseline |
| Week 1 | Repair the existing enquiry journey and local checks | Contact capture persists and reaches the intended recipient; assessment context arrives; checks pass |
| Week 2 | Add a logistics landing page and synthetic Shipment File Check demonstration | A prospect can understand the offer and inspect one useful result in about a minute |
| Week 2 | Scope and sell one assessment | Agreed deliverables, fee, effort cap and data-handling terms |
| Weeks 3–4 | Complete assessment and evaluate a private thin workflow on authorized samples | Evidence-based paid pilot proposal or explicit no-go |

These are planning windows, not a promise of production delivery within a month. Start a production pilot only after the commercial and data-access gates are satisfied.

### Concrete repository backlog

1. Correct stale test configuration fixtures and reconcile use of `Array.at` with the TypeScript library target. Include the API build in CI alongside frontend validation.
2. Repair assessment/chat context handoff: Contact reads session storage only at mount, while the other sections write it later on the same page. Use shared state or an explicit event instead of expecting storage to rerender React.
3. Record a successful persisted enquiry independently of notification failure and make retries safe. Currently lead creation precedes an awaited email call; a notification failure can produce an error after saving the lead and encourage duplicate submissions.
4. Verify production persistence, notification settings and API connectivity. Missing database/email configuration currently permits in-memory or console fallbacks. Vercel rewrites serve the SPA; they do not deploy Fastify.
5. Remove duplicate page-view recording from `src/main.tsx` and `src/App.tsx`. Update deployment documentation, which incorrectly says there is no `vercel.json`.
6. Simplify the primary CTA to a workflow conversation. The assessment is already bypassable; shorten or deemphasize it rather than treating it as a mandatory funnel gate. Distinguish the questionnaire from the paid assessment.
7. Add a logistics route in the current pathname routing and verify direct navigation on the chosen host. Adjust hero, engagement and Labs content; align the assistant's company knowledge with the revised offer.
8. Build the bounded demonstration, then the private pilot module only after discovery. Pause CRM/lead-scoring expansion.

## Discovery questions that determine the next build

- Show one recent shipment from first email through handoff: where is information copied, corrected or chased?
- What is the system of record, and which import/export/API features and vendor AI modules are available?
- How many comparable jobs occur each month, and how long do preparation and correction take?
- Which mistakes actually caused rework or charges, and who bears those charges?
- Who operates the workflow, who owns the budget and who approves data access/integration?
- Can a representative set of historical documents be used legally for a private evaluation?
- What result would justify paying for the pilot, and what result should make us stop?

## Verification

Completed local checks:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Failed: two test fixtures omit required AppConfig fields; two Array.at usages exceed the ES2020 library target |
| `npm test` | 11 passed, 1 failed: health endpoint test expects only `{ ok: true }`, while the response also includes `service` |
| `npm run build` | Passed: Vite production frontend built successfully |
| `npm run build:api` | Failed: the two Array.at / ES2020 errors |

The successful frontend bundle is not evidence that the API builds or that the deployed contact form works. Live deployment and client systems were not tested. The context-handoff and notification findings above come from code inspection, not newly added regression tests.

No product implementation was performed as part of this assessment; only research and planning documents were added. Existing untracked logs were left alone.
