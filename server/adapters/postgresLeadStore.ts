import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';
import { assertSameSubmission } from '../domain/lead.js';
import { qualifyLead } from '../domain/qualification.js';
import type { LeadRecord, LeadStatus, LeadStore, LeadSubmission } from '../domain/lead.js';

export class PostgresLeadStore implements LeadStore {
  constructor(private readonly pool: Pool) {}

  async createLead(submission: LeadSubmission): Promise<{ lead: LeadRecord; created: boolean }> {
    const qualification = qualifyLead(submission);
    const id = submission.submissionId ?? randomUUID();
    const result = await this.pool.query<LeadRow>(
      `insert into leads (name, email, company, industry, message, goals, source, opportunity_brief, qualification_score, qualification_label, qualification_reasons, id)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       on conflict (id) do nothing
       returning id, name, email, company, industry, message, goals, source, opportunity_brief, status, qualification_score, qualification_label, qualification_reasons, created_at, updated_at`,
      [submission.name, submission.email, submission.company || null, submission.industry || null, submission.message, submission.goals, submission.source, submission.opportunityBrief ? JSON.stringify(submission.opportunityBrief) : null, qualification.score, qualification.label, qualification.reasons, id],
    );
    if (result.rows.length) return { lead: toLeadRecord(result.rows[0]), created: true };
    const existing = await this.pool.query<LeadRow>('select * from leads where id = $1', [id]);
    if (!existing.rows[0]) throw new Error('Unable to retrieve the saved enquiry.');
    const lead = toLeadRecord(existing.rows[0]);
    assertSameSubmission(lead, submission);
    return { lead, created: false };
  }

  async listLeads(): Promise<LeadRecord[]> {
    const result = await this.pool.query<LeadRow>(
      `select id, name, email, company, industry, message, goals, source, opportunity_brief, status, qualification_score, qualification_label, qualification_reasons, created_at, updated_at
       from leads order by qualification_score desc, created_at desc limit 250`,
    );
    return result.rows.map(toLeadRecord);
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null> {
    const result = await this.pool.query<LeadRow>(
      `update leads set status = $2, updated_at = now()
       where id = $1
       returning id, name, email, company, industry, message, goals, source, opportunity_brief, status, qualification_score, qualification_label, qualification_reasons, created_at, updated_at`,
      [id, status],
    );
    return result.rowCount ? toLeadRecord(result.rows[0]) : null;
  }
}

type LeadRow = {
  id: string; name: string; email: string; company: string | null; industry: string | null;
  message: string; goals: string[]; source: string; opportunity_brief: LeadRecord['opportunityBrief'] | null;
  status: LeadStatus; qualification_score: number; qualification_label: LeadRecord['qualificationLabel'];
  qualification_reasons: string[]; created_at: Date; updated_at: Date;
};

function toLeadRecord(row: LeadRow): LeadRecord {
  return { id: row.id, name: row.name, email: row.email, company: row.company ?? '', industry: row.industry ?? '', message: row.message, goals: row.goals, source: row.source, opportunityBrief: row.opportunity_brief ?? undefined, status: row.status, qualificationScore: row.qualification_score, qualificationLabel: row.qualification_label, qualificationReasons: row.qualification_reasons, createdAt: row.created_at, updatedAt: row.updated_at };
}
