import type { AppConfig } from '../config.js';
import type { LeadRecord } from '../domain/lead.js';
import type { CrmAdapter, CrmSyncResult } from '../domain/crm.js';

export class NoopCrmAdapter implements CrmAdapter {
  async syncLead(_lead: LeadRecord): Promise<CrmSyncResult> {
    return { provider: 'none' };
  }
}

export class WebhookCrmAdapter implements CrmAdapter {
  constructor(private readonly config: AppConfig) {}

  async syncLead(lead: LeadRecord): Promise<CrmSyncResult> {
    if (!this.config.crmWebhookUrl) return { provider: 'webhook' };
    const response = await fetch(this.config.crmWebhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(this.config.crmWebhookSecret ? { 'x-aivanta-signature': this.config.crmWebhookSecret } : {}) },
      body: JSON.stringify({ event: 'lead.created', lead }),
    });
    if (!response.ok) throw new Error(`CRM webhook rejected lead with ${response.status}`);
    return { provider: 'webhook' };
  }
}

export class HubSpotCrmAdapter implements CrmAdapter {
  constructor(private readonly config: AppConfig) {}

  async syncLead(lead: LeadRecord): Promise<CrmSyncResult> {
    const token = this.config.hubspotAccessToken;
    if (!token) return { provider: 'hubspot' };
    const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
    const [firstName, ...lastParts] = lead.name.trim().split(/\s+/);
    const properties = {
      email: lead.email,
      firstname: firstName || lead.name,
      lastname: lastParts.join(' ') || '',
      company: lead.company || '',
      industry: lead.industry || '',
    };

    const search = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: lead.email }] }], limit: 1, properties: ['email', 'firstname', 'lastname', 'company', 'industry'] }),
    });
    if (!search.ok) throw new Error(`HubSpot contact search failed with ${search.status}`);
    const searchBody = await search.json() as { results?: Array<{ id: string }> };
    const existingId = searchBody.results?.[0]?.id;

    if (existingId) {
      const update = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(existingId)}`, {
        method: 'PATCH', headers, body: JSON.stringify({ properties }),
      });
      if (!update.ok) throw new Error(`HubSpot contact update failed with ${update.status}`);
      return { provider: 'hubspot', externalId: existingId };
    }

    const create = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST', headers, body: JSON.stringify({ properties }),
    });
    if (!create.ok) throw new Error(`HubSpot contact creation failed with ${create.status}`);
    const created = await create.json() as { id?: string };
    return { provider: 'hubspot', externalId: created.id };
  }
}

export function createCrmAdapter(config: AppConfig): CrmAdapter {
  if (config.crmProvider === 'hubspot' && config.hubspotAccessToken) return new HubSpotCrmAdapter(config);
  if (config.crmProvider === 'webhook' && config.crmWebhookUrl) return new WebhookCrmAdapter(config);
  return new NoopCrmAdapter();
}
