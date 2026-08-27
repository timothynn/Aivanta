import { randomUUID } from 'node:crypto';
import type { LeadRecord, LeadStore, LeadSubmission } from '../domain/lead.js';

export class InMemoryLeadStore implements LeadStore {
  readonly leads: LeadRecord[] = [];

  async createLead(submission: LeadSubmission): Promise<LeadRecord> {
    const now = new Date();
    const lead: LeadRecord = {
      ...submission,
      id: randomUUID(),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    this.leads.push(lead);
    return lead;
  }
}
