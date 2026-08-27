import { Pool } from 'pg';
import type { LeadRecord, LeadStore, LeadSubmission } from '../domain/lead.js';

export class PostgresLeadStore implements LeadStore {
  constructor(private readonly pool: Pool) {}

  async createLead(submission: LeadSubmission): Promise<LeadRecord> {
    const result = await this.pool.query<{
      id: string;
      name: string;
      email: string;
      company: string | null;
      industry: string | null;
      message: string;
      goals: string[];
      source: string;
      status: LeadRecord['status'];
      created_at: Date;
      updated_at: Date;
    }>(
      `insert into leads (name, email, company, industry, message, goals, source)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id, name, email, company, industry, message, goals, source, status, created_at, updated_at`,
      [
        submission.name,
        submission.email,
        submission.company || null,
        submission.industry || null,
        submission.message,
        submission.goals,
        submission.source,
      ],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      company: row.company ?? '',
      industry: row.industry ?? '',
      message: row.message,
      goals: row.goals,
      source: row.source,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
