import type { LeadRecord } from './lead.js';

export type CrmSyncResult = { provider: string; externalId?: string };

export type CrmAdapter = {
  syncLead(lead: LeadRecord): Promise<CrmSyncResult>;
};
