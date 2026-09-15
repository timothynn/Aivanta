import { describe, expect, it, vi } from 'vitest';
import { InMemoryLeadStore } from './adapters/inMemoryLeadStore';
import { createApp } from './app';
import type { AppConfig } from './config';
import type { ChatAssistant } from './domain/chat';
import type { LeadNotifier } from './domain/lead';

const config: AppConfig = {
  retrievalMode: 'keyword',
  embeddingModel: 'text-embedding-3-small',
  crmProvider: 'none',
  apiOrigin: 'http://localhost:5173',
  aiVendor: 'local',
  aiModel: '',
  geminiModel: 'gemini-2.0-flash',
  leadNotificationFrom: 'Aivanta <hello@aivanta.ai>',
  openaiModel: 'gpt-5',
  port: 8787,
};

const validBody = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Example Co',
  industry: 'Enterprise Software',
  message: 'We want to add AI to an internal workflow.',
  goals: ['AI integration'],
  source: 'test',
};

function createChatAssistant(): ChatAssistant {
  return {
    reply: vi.fn().mockResolvedValue({
      message: { role: 'assistant', content: 'Aivanta can help with that workflow.' },
    }),
  };
}

describe('createApp', () => {
  it('acknowledges retries and returns 409 for a reused identifier with different content', async () => {
    const app = await createApp({ config, chatAssistant: createChatAssistant(), leadStore: new InMemoryLeadStore(), leadNotifier: { notifyLeadCreated: vi.fn().mockResolvedValue(undefined) } });
    try {
      const body = { ...validBody, submissionId: 'bbb7d1db-3e9d-45b3-a6f7-63b9fa2b4961' };
      const first = await app.inject({ method: 'POST', url: '/api/leads', payload: body });
      const second = await app.inject({ method: 'POST', url: '/api/leads', payload: body });
      expect(first.statusCode).toBe(201);
      expect(second.json()).toEqual(first.json());
      const conflict = await app.inject({ method: 'POST', url: '/api/leads', payload: { ...body, message: 'Another workflow using the old identifier.' } });
      expect(conflict.statusCode).toBe(409);
    } finally { await app.close(); }
  });
  it('returns health status', async () => {
    const app = await createApp({
      config,
      chatAssistant: createChatAssistant(),
      leadStore: new InMemoryLeadStore(),
      leadNotifier: { notifyLeadCreated: vi.fn().mockResolvedValue(undefined) },
    });

    const response = await app.inject({ method: 'GET', url: '/api/health' });
    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true, service: 'aivanta-api' });
  });

  it('accepts valid lead submissions', async () => {
    const store = new InMemoryLeadStore();
    const notifier: LeadNotifier = {
      notifyLeadCreated: vi.fn().mockResolvedValue(undefined),
    };
    const app = await createApp({
      config,
      chatAssistant: createChatAssistant(),
      leadStore: store,
      leadNotifier: notifier,
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: validBody,
    });
    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ ok: true, leadId: store.leads[0].id });
    expect(notifier.notifyLeadCreated).toHaveBeenCalledOnce();
  });

  it('returns validation errors for invalid submissions', async () => {
    const app = await createApp({
      config,
      chatAssistant: createChatAssistant(),
      leadStore: new InMemoryLeadStore(),
      leadNotifier: { notifyLeadCreated: vi.fn().mockResolvedValue(undefined) },
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/leads',
      payload: { ...validBody, message: 'short' },
    });
    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ ok: false, message: 'Please check the form and try again.' });
  });

  it('responds to chatbot messages', async () => {
    const app = await createApp({
      config,
      chatAssistant: createChatAssistant(),
      leadStore: new InMemoryLeadStore(),
      leadNotifier: { notifyLeadCreated: vi.fn().mockResolvedValue(undefined) },
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { messages: [{ role: 'user', content: 'What services do you offer?' }] },
    });
    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      ok: true,
      message: { role: 'assistant', content: 'Aivanta can help with that workflow.' },
    });
  });
});
