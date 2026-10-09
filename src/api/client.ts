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

export type LeadPayload = {
  name: string;
  email: string;
  company?: string;
  industry?: string;
  message: string;
  goals: string[];
  source: string;
  opportunityBrief?: OpportunityBrief;
};

export type LeadResponse = { ok: true; leadId: string };
export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatResponse = { ok: true; message: ChatMessage };
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export async function trackEvent(name: string, metadata: Record<string, string> = {}): Promise<void> {
  try { await fetch(`${apiBaseUrl}/api/events`, { method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true, body: JSON.stringify({ name, path: window.location.pathname, metadata }) }); } catch { /* Analytics must never interfere with the user experience. */ }
}

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const response = await fetch(`${apiBaseUrl}/api/leads`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
      ? body.message : 'Unable to submit the request. Please try again.';
    throw new Error(message);
  }
  // A Vite SPA fallback can respond 200 with HTML when the API URL is missing.
  // Never show "Request received" without a confirmed server-generated lead ID.
  if (!body || typeof body !== 'object' || !('ok' in body) || body.ok !== true ||
      !('leadId' in body) || typeof body.leadId !== 'string' || !body.leadId.trim()) {
    throw new Error('The enquiry could not be confirmed. Please check the API connection and try again.');
  }
  return body as LeadResponse;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await fetch(`${apiBaseUrl}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages }) });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
      ? body.message : 'The assistant is unavailable right now.';
    throw new Error(message);
  }
  if (!body || typeof body !== 'object' || !('ok' in body) || body.ok !== true ||
      !('message' in body) || !body.message || typeof body.message !== 'object' ||
      !('role' in body.message) || body.message.role !== 'assistant' ||
      !('content' in body.message) || typeof body.message.content !== 'string') {
    throw new Error('The assistant returned an invalid response. Please check the API connection.');
  }
  return body as ChatResponse;
}

export async function generateOpportunityBrief(messages: ChatMessage[]): Promise<OpportunityBrief> {
  const response = await fetch(`${apiBaseUrl}/api/opportunity-brief`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages }) });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok || !body || typeof body !== 'object' || !('brief' in body)) { const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string' ? body.message : 'Unable to prepare the opportunity brief right now.'; throw new Error(message); }
  return body.brief as OpportunityBrief;
}
