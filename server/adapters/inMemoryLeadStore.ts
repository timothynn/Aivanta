import { randomUUID } from 'node:crypto';
import { qualifyLead } from '../domain/qualification.js';
import type { LeadRecord, LeadStatus, LeadStore, LeadSubmission } from '../domain/lead.js';

export class InMemoryLeadStore implements LeadStore {
  readonly leads: LeadRecord[] = [];

  async createLead(submission: LeadSubmission): Promise<LeadRecord> {
    const now = new Date();
    const qualification = qualifyLead(submission);
    const lead: LeadRecord = { ...submission, id: randomUUID(), status: 'new', qualificationScore: qualification.score, qualificationLabel: qualification.label, qualificationReasons: qualification.reasons, createdAt: now, updatedAt: now };
    this.leads.push(lead);
    return lead;
  }

  async listLeads(): Promise<LeadRecord[]> {
    return [...this.leads].sort((a, b) => b.qualificationScore - a.qualificationScore || b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null> {
    const lead = this.leads.find((item) => item.id === id);
    if (!lead) return null;
    lead.status = status;
    lead.updatedAt = new Date();
    return lead;
  }
}
