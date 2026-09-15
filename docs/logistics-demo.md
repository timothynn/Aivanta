# Logistics offer and Shipment File Check

Implemented 14 September 2026. Open `/logistics` for the focused offer and `/logistics#shipment-check` for the working sample.

## Business scope

Aivanta remains a broader AI integration consultancy. Logistics is the first focused offer. The page presents a short introductory conversation, a paid fixed-scope assessment with a fee agreed before work begins, and a separately scoped pilot. Support hours and operating costs are agreed per engagement. CAA engineering experience is described without employer, client or regulator endorsements.

The first sample is deliberately low-cost to operate: it runs in the browser with invented text documents, no model calls, uploads, customer data, external integrations or recurring monitoring. It provides evidence of an implemented review workflow, not proven extraction accuracy or client outcomes.

## Try the sample

1. Choose conflicting package counts, missing gross weight, or matching documents.
2. Check the file. Inspect the commercial invoice, packing list and bill of lading using the source buttons.
3. Compare the four agreed fields: shipment reference, consignee, packages and gross weight in kg. Net weight is not used as a substitute. Duplicate labels and missing/invalid values are flagged.
4. Correct values and write a resolution note for any disagreement, missing field or changed value. Approve every field and enter a demo reviewer name.
5. Download JSON containing the reviewed values, original issues, document/line evidence, reviewer and timestamp. Editing documents clears all prior findings and approvals; editing reviewed values or notes clears that field's approval.

These labelled text samples do not model all real freight documents. There is no claim that every invoice contains these fields, that these checks establish customs compliance, or that the demo handles document versions and production access control. The parser is replaceable by evaluated extraction when real pilot requirements and authorized data are available.

## Enquiry reliability

- Questionnaire and assistant context use explicit same-page events; optional session storage also supports navigating between pages. Malformed stored content is ignored.
- Attached context is displayed separately and can be removed without losing the visitor's draft. Chat context is attached only on its explicit consultation action. The latest 2,000 conversation characters are included in the enquiry; a structured brief is sent separately.
- Same-attempt retries reuse a UUID. Existing PostgreSQL primary-key uniqueness prevents duplicate leads, including concurrent requests. Different content with the same identifier is rejected.
- Persisted leads succeed even when notification fails. Operators must review saved enquiries/logs; a durable notification queue is deferred.
- Production API configuration must include durable persistence, notification settings and an admin token. Provider delivery and deployed connectivity still need deployment verification.

## Next business step

Use the demo in workflow discovery. Ask an operator to identify what is realistic, what is missing, and which existing tool should receive the approved output. Request authorized historical examples only after agreeing data handling. Then scope a private extraction evaluation and one client-approved import/export contract.

Supplier invoice reconciliation, deadline monitoring, status drafting and quote preparation remain discovery candidates. They are not represented as working features on this site. See [GitHub learning guide](logistics-github-learning-guide.md) for open-source business models and a practical study sequence.

## Verification completed

- `npm run typecheck`: passed.
- `npm test` with an isolated PostgreSQL 18 database: 32 tests passed across 11 files, including persistence across reconnects, concurrent retry handling, conflict responses, notification failures, context handoff, source discrepancies and approval/export gates.
- `npm run build`: passed, including the generated logistics route entry point.
- `npm run build:api`: passed.
- Browser: source mismatch, reviewed JSON download, mobile layout without horizontal overflow, and successful enquiry through the local frontend/API verified. The built `/logistics/` route also rendered successfully.
- `git diff --check`: passed.

No external email was sent in testing. Live model extraction, real-client integrations and production deployment were not performed. The local database integration test used a fresh temporary cluster; no existing or client database was accessed.
