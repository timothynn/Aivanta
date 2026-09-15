import { z } from 'zod';
import type { CrmAdapter } from './crm.js';

const opportunityBriefSchema = z.object({
  summary: z.string().max(1000),
  system: z.string().max(240),
  users: z.string().max(240),
  painPoint: z.string().max(1000),
  dataSources: z.string().max(500),
  opportunities: z.array(z.string().max(240)).max(8),
  recommendedStart: z.string().max(240),
  considerations: z.array(z.string().max(240)).max(8),
});

export const leadSubmissionSchema = z.object({
  submissionId: z.uuid().optional(),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  industry: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000),
  goals: z.array(z.string().trim().min(1).max(80)).max(10).default([]),
  source: z.string().trim().min(1).max(120).default('homepage_contact_form'),
  opportunityBrief: opportunityBriefSchema.optional(),
});

export const leadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'closed']);
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type OpportunityBrief = z.infer<typeof opportunityBriefSchema>;
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export type LeadRecord = LeadSubmission & {
  id: string;
  status: LeadStatus;
  qualificationScore: number;
  qualificationLabel: 'early' | 'promising' | 'high-intent';
  qualificationReasons: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type LeadStore = {
  createLead(submission: LeadSubmission): Promise<{ lead: LeadRecord; created: boolean }>;
  listLeads(): Promise<LeadRecord[]>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null>;
};

export type LeadNotifier = {
  notifyLeadCreated(lead: LeadRecord): Promise<void>;
};

export type LeadIntakeResult = { leadId: string };

export class SubmissionConflict extends Error {}

export function assertSameSubmission(existing: LeadRecord, submission: LeadSubmission) {
  const schema = leadSubmissionSchema.omit({ submissionId: true });
  const normalized = (input: LeadSubmission) => JSON.stringify(schema.parse({ ...input, company: input.company || '', industry: input.industry || '' }));
  if (normalized(existing) !== normalized(submission)) throw new SubmissionConflict('This request identifier was already used. Please submit a new enquiry.');
}

export function createLeadIntake(store: LeadStore, notifier: LeadNotifier, crm?: CrmAdapter) {
  return async function submitLead(input: unknown): Promise<LeadIntakeResult> {
    const submission = leadSubmissionSchema.parse(input);
    const { lead, created } = await store.createLead(submission);
    if (!created) return { leadId: lead.id };
    try {
      await notifier.notifyLeadCreated(lead);
    } catch {
      console.warn('Lead notification failed; review the saved enquiry in admin.', { leadId: lead.id });
    }
    if (crm) {
      try {
        await crm.syncLead(lead);
      } catch (error) {
        console.warn('CRM sync failed; lead remains stored locally.', { leadId: lead.id, error });
      }
    }
    return { leadId: lead.id };
  };
}
