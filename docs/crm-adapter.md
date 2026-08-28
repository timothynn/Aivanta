# Aivanta CRM adapter

Aivanta keeps its internal lead store independent from CRM vendors through the `CrmAdapter` contract.

## Providers

### none

Default. Leads stay in Aivanta's PostgreSQL/in-memory lead store.

### webhook

Posts the complete `lead.created` event to a configurable webhook. This can connect Aivanta to Zapier, Make, n8n, a custom integration service, or another CRM without changing application code.

### hubspot

The first concrete CRM implementation. New leads are searched by email; an existing HubSpot contact is updated, otherwise a new contact is created. The adapter currently uses HubSpot's CRM v3 contact object endpoints.

HubSpot's current public CRM APIs support contact creation, update, and search through the CRM objects APIs. New integrations should keep provider-specific calls behind this adapter so future HubSpot API version changes do not leak into the rest of Aivanta.

## Configuration

```text
CRM_PROVIDER=hubspot
HUBSPOT_ACCESS_TOKEN=...
```

or:

```text
CRM_PROVIDER=webhook
CRM_WEBHOOK_URL=https://...
CRM_WEBHOOK_SECRET=...
```

## Reliability behavior

The lead is persisted locally before CRM synchronization. If the CRM is unavailable, the lead remains available in Aivanta and the failure is logged. This prevents a third-party CRM outage from losing an enquiry.

## Future extensions

1. Company upsert and contact-company association.
2. Deal creation from high-intent leads.
3. CRM status synchronization back into Aivanta.
4. Background retry queue for failed syncs.
5. OAuth-based installation for client-specific CRM accounts.
6. Provider adapters for other CRMs without changing the lead domain.
