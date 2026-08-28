import cors from '@fastify/cors';
import Fastify from 'fastify';
import { ZodError } from 'zod';
import type { AppConfig } from './config.js';
import { createSupportChat, chatRequestSchema, type ChatAssistant } from './domain/chat.js';
import { createAnalytics, type AnalyticsStore } from './domain/analytics.js';
import { createLeadIntake, leadStatusSchema, type LeadNotifier, type LeadStore } from './domain/lead.js';
import { createRateLimit } from './rateLimit.js';
import { generateOpportunityBrief } from './opportunityBrief.js';

type AppDependencies = {
  config: AppConfig;
  chatAssistant: ChatAssistant;
  leadStore: LeadStore;
  leadNotifier: LeadNotifier;
  analyticsStore?: AnalyticsStore;
};

export async function createApp({ config, chatAssistant, leadStore, leadNotifier, analyticsStore }: AppDependencies) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test', bodyLimit: 100_000 });
  const sendChatMessage = createSupportChat(chatAssistant);
  const submitLead = createLeadIntake(leadStore, leadNotifier);
  const recordAnalytics = analyticsStore ? createAnalytics(analyticsStore) : null;

  await app.register(cors, { origin: config.apiOrigin, methods: ['GET', 'POST', 'PATCH'] });
  app.get('/api/health', async () => ({ ok: true }));

  app.post('/api/events', { preHandler: createRateLimit(60, 60_000) }, async (request, reply) => {
    if (!recordAnalytics) return reply.code(204).send();
    try {
      await recordAnalytics(request.body);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof ZodError) return reply.code(400).send({ ok: false, message: 'Invalid event.' });
      request.log.error(error); return reply.code(500).send({ ok: false, message: 'Unable to record the event.' });
    }
  });

  app.post('/api/chat', { preHandler: createRateLimit(30, 60_000) }, async (request, reply) => {
    try {
      const result = await sendChatMessage(request.body);
      return reply.send({ ok: true, message: result.message });
    } catch (error) {
      if (error instanceof ZodError) return reply.code(400).send({ ok: false, message: 'Please enter a message and try again.', issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })) });
      request.log.error(error); return reply.code(502).send({ ok: false, message: 'The assistant is unavailable right now. Please use the contact form and Aivanta will follow up.' });
    }
  });

  app.post('/api/opportunity-brief', { preHandler: createRateLimit(10, 60_000) }, async (request, reply) => {
    try {
      const input = chatRequestSchema.parse(request.body);
      const brief = await generateOpportunityBrief(config, input.messages);
      return reply.send({ ok: true, brief });
    } catch (error) {
      if (error instanceof ZodError) return reply.code(400).send({ ok: false, message: 'Please provide a valid discovery conversation.' });
      request.log.error(error); return reply.code(502).send({ ok: false, message: 'Unable to prepare the opportunity brief right now.' });
    }
  });

  app.post('/api/leads', { preHandler: createRateLimit(12, 60_000) }, async (request, reply) => {
    try {
      const result = await submitLead(request.body);
      return reply.code(201).send({ ok: true, leadId: result.leadId });
    } catch (error) {
      if (error instanceof ZodError) return reply.code(400).send({ ok: false, message: 'Please check the form and try again.', issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })) });
      request.log.error(error); return reply.code(500).send({ ok: false, message: 'Unable to submit the request right now.' });
    }
  });

  app.get('/api/admin/leads', async (request, reply) => {
    if (!isAdmin(request.headers.authorization, config.adminToken)) return reply.code(401).send({ ok: false, message: 'Unauthorized' });
    const leads = await leadStore.listLeads();
    return reply.send({ ok: true, leads });
  });

  app.get('/api/admin/analytics', async (request, reply) => {
    if (!isAdmin(request.headers.authorization, config.adminToken)) return reply.code(401).send({ ok: false, message: 'Unauthorized' });
    if (!analyticsStore) return reply.send({ ok: true, summary: null });
    return reply.send({ ok: true, summary: await analyticsStore.getSummary() });
  });

  app.patch('/api/admin/leads/:id', async (request, reply) => {
    if (!isAdmin(request.headers.authorization, config.adminToken)) return reply.code(401).send({ ok: false, message: 'Unauthorized' });
    try {
      const body = request.body as { status?: unknown };
      const status = leadStatusSchema.parse(body.status);
      const params = request.params as { id: string };
      const lead = await leadStore.updateLeadStatus(params.id, status);
      if (!lead) return reply.code(404).send({ ok: false, message: 'Lead not found' });
      return reply.send({ ok: true, lead });
    } catch (error) {
      if (error instanceof ZodError) return reply.code(400).send({ ok: false, message: 'Invalid lead status.' });
      request.log.error(error); return reply.code(500).send({ ok: false, message: 'Unable to update the lead.' });
    }
  });

  return app;
}

function isAdmin(authorization: string | undefined, expectedToken: string | undefined): boolean {
  return Boolean(expectedToken && authorization === `Bearer ${expectedToken}`);
}
