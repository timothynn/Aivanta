import { z } from 'zod';

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
  createLead(submission: LeadSubmission): Promise<LeadRecord>;
  listLeads(): Promise<LeadRecord[]>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null>;
};

export type LeadNotifier = {
  notifyLeadCreated(lead: LeadRecord): Promise<void>;
};

export type LeadIntakeResult = { leadId: string };

export function createLeadIntake(store: LeadStore, notifier: LeadNotifier) {
  return async function submitLead(input: unknown): Promise<LeadIntakeResult> {
    const submission = leadSubmissionSchema.parse(input);
    const lead = await store.createLead(submission);
    await notifier.notifyLeadCreated(lead);
    return { leadId: lead.id };
  };
}
