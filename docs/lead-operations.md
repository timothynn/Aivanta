# Aivanta Lead Operations

Aivanta uses a lightweight internal lead pipeline instead of a full CRM at this stage.

## Qualification

New leads receive a deterministic 0–100 qualification score and one of:

- `high-intent` — 70–100
- `promising` — 45–69
- `early` — 0–44

The score rewards explicit business context, a stated company/industry, selected AI goals, completion of the assessment or assistant discovery flow, an opportunity brief, and a sufficiently detailed problem description.

The score is a prioritization aid only. It does not replace human sales qualification and should not make automated claims about a prospect's willingness or ability to buy.

## Pipeline

Lead status remains:

`new → contacted → qualified → closed`

Qualification label and pipeline status are intentionally separate. A high-intent lead can still be `new` until a human contacts and evaluates it.

## Opportunity Brief

When available, the structured AI Opportunity Brief is stored with the lead and displayed in the admin console. It can later be mapped into a CRM record or discovery-session brief.

## Booking

The public site supports an optional `VITE_BOOKING_URL`. Until a scheduling provider is configured, the site falls back to the contact flow.

## Next CRM step

Keep the current schema and API as the internal source of truth until lead volume justifies a CRM integration. A future adapter can sync qualified leads to a CRM without changing the public website flow.
