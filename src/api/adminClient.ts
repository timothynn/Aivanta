export type OpportunityBrief = {
  summary: string;
  system: string;
  users: string;
  painPoint: string;
  dataSources: string;
  opportunities: string[];
  recommendedStart: string;
  considerations: string[];
};

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  message: string;
  goals: string[];
  source: string;
  opportunityBrief?: OpportunityBrief;
  qualificationScore: number;
  qualificationLabel: 'early' | 'promising' | 'high-intent';
  qualificationReasons: string[];
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
  updatedAt: string;
};

export type AdminAnalytics = {
  totalEvents: number;
  uniqueEventNames: number;
  topEvents: Array<{ name: string; count: number }>;
  recentEvents: Array<{ name: string; path: string; createdAt: string }>;
  funnel: { pageViews: number; assistantOpened: number; assessmentsStarted: number; assessmentsCompleted: number; briefsPrepared: number; leadsSubmitted: number };
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
async function readJson(response: Response): Promise<Record<string, unknown>> { return (await response.json().catch(() => null)) as Record<string, unknown>; }
export async function listAdminLeads(token: string): Promise<AdminLead[]> { const response = await fetch(`${apiBaseUrl}/api/admin/leads`, { headers: { authorization: `Bearer ${token}` } }); const body = await readJson(response); if (!response.ok) throw new Error(String(body.message ?? 'Unable to load leads.')); return (body.leads as AdminLead[] | undefined) ?? []; }
export async function updateAdminLeadStatus(token: string, id: string, status: AdminLead['status']): Promise<AdminLead> { const response = await fetch(`${apiBaseUrl}/api/admin/leads/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ status }) }); const body = await readJson(response); if (!response.ok || !body.lead) throw new Error(String(body.message ?? 'Unable to update lead.')); return body.lead as AdminLead; }
export async function getAdminAnalytics(token: string): Promise<AdminAnalytics | null> { const response = await fetch(`${apiBaseUrl}/api/admin/analytics`, { headers: { authorization: `Bearer ${token}` } }); const body = await readJson(response); if (!response.ok) throw new Error(String(body.message ?? 'Unable to load analytics.')); return (body.summary as AdminAnalytics | null | undefined) ?? null; }
