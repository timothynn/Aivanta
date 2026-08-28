export type LeadPayload = {
  name: string;
  email: string;
  company?: string;
  industry?: string;
  message: string;
  goals: string[];
  source: string;
};

export type LeadResponse = { ok: true; leadId: string };
export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatResponse = { ok: true; message: ChatMessage };

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export async function trackEvent(name: string, metadata: Record<string, string> = {}): Promise<void> {
  try {
    await fetch(`${apiBaseUrl}/api/events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ name, path: window.location.pathname, metadata }),
    });
  } catch {
    // Analytics must never interfere with the user experience.
  }
}

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const response = await fetch(`${apiBaseUrl}/api/leads`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string' ? body.message : 'Unable to submit the request. Please try again.';
    throw new Error(message);
  }
  return body as LeadResponse;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await fetch(`${apiBaseUrl}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages }) });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string' ? body.message : 'The assistant is unavailable right now.';
    throw new Error(message);
  }
  return body as ChatResponse;
}
