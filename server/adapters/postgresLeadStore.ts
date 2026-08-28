import { Pool } from 'pg';
import type { LeadRecord, LeadStatus, LeadStore, LeadSubmission } from '../domain/lead.js';

export class PostgresLeadStore implements LeadStore {
  constructor(private readonly pool: Pool) {}

  async createLead(submission: LeadSubmission): Promise<LeadRecord> {
    const result = await this.pool.query<LeadRow>(
      `insert into leads (name, email, company, industry, message, goals, source)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id, name, email, company, industry, message, goals, source, status, created_at, updated_at`,
      [submission.name, submission.email, submission.company || null, submission.industry || null, submission.message, submission.goals, submission.source],
    );
    return toLeadRecord(result.rows[0]);
  }

  async listLeads(): Promise<LeadRecord[]> {
    const result = await this.pool.query<LeadRow>(
      `select id, name, email, company, industry, message, goals, source, status, created_at, updated_at
       from leads order by created_at desc limit 250`,
    );
    return result.rows.map(toLeadRecord);
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null> {
    const result = await this.pool.query<LeadRow>(
      `update leads set status = $2, updated_at = now()
       where id = $1
       returning id, name, email, company, industry, message, goals, source, status, created_at, updated_at`,
      [id, status],
    );
    return result.rowCount ? toLeadRecord(result.rows[0]) : null;
  }
}

type LeadRow = {
  id: string; name: string; email: string; company: string | null; industry: string | null;
  message: string; goals: string[]; source: string; status: LeadStatus; created_at: Date; updated_at: Date;
};

function toLeadRecord(row: LeadRow): LeadRecord {
  return { id: row.id, name: row.name, email: row.email, company: row.company ?? '', industry: row.industry ?? '', message: row.message, goals: row.goals, source: row.source, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at };
}
