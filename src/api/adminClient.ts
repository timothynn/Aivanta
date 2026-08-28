export type AdminLead = {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  message: string;
  goals: string[];
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
  updatedAt: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export async function listAdminLeads(token: string): Promise<AdminLead[]> {
  const response = await fetch(`${apiBaseUrl}/api/admin/leads`, { headers: { authorization: `Bearer ${token}` } });
  const body = (await response.json().catch(() => null)) as { leads?: AdminLead[]; message?: string };
  if (!response.ok) throw new Error(body.message ?? 'Unable to load leads.');
  return body.leads ?? [];
}

export async function updateAdminLeadStatus(token: string, id: string, status: AdminLead['status']): Promise<AdminLead> {
  const response = await fetch(`${apiBaseUrl}/api/admin/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const body = (await response.json().catch(() => null)) as { lead?: AdminLead; message?: string };
  if (!response.ok || !body.lead) throw new Error(body.message ?? 'Unable to update lead.');
  return body.lead;
}
