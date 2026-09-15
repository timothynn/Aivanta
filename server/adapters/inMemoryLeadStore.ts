import { randomUUID } from 'node:crypto';
import { qualifyLead } from '../domain/qualification.js';
import type { LeadRecord, LeadStatus, LeadStore, LeadSubmission } from '../domain/lead.js';
import { assertSameSubmission } from '../domain/lead.js';

export class InMemoryLeadStore implements LeadStore {
  readonly leads: LeadRecord[] = [];

  async createLead(submission: LeadSubmission): Promise<{ lead: LeadRecord; created: boolean }> {
    const existing = submission.submissionId ? this.leads.find((lead) => lead.id === submission.submissionId) : undefined;
    if (existing) { assertSameSubmission(existing, submission); return { lead: existing, created: false }; }
    const now = new Date();
    const qualification = qualifyLead(submission);
    const lead: LeadRecord = { ...submission, id: submission.submissionId ?? randomUUID(), status: 'new', qualificationScore: qualification.score, qualificationLabel: qualification.label, qualificationReasons: qualification.reasons, createdAt: now, updatedAt: now };
    this.leads.push(lead);
    return { lead, created: true };
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
