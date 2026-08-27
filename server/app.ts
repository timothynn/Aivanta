import cors from '@fastify/cors';
import Fastify from 'fastify';
import { ZodError } from 'zod';
import type { AppConfig } from './config.js';
import { createSupportChat, type ChatAssistant } from './domain/chat.js';
import { createLeadIntake, type LeadNotifier, type LeadStore } from './domain/lead.js';
import { createRateLimit } from './rateLimit.js';

type AppDependencies = {
  config: AppConfig;
  chatAssistant: ChatAssistant;
  leadStore: LeadStore;
  leadNotifier: LeadNotifier;
};

export async function createApp({ config, chatAssistant, leadStore, leadNotifier }: AppDependencies) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });
  const sendChatMessage = createSupportChat(chatAssistant);
  const submitLead = createLeadIntake(leadStore, leadNotifier);

  await app.register(cors, {
    origin: config.apiOrigin,
    methods: ['GET', 'POST'],
  });

  app.get('/api/health', async () => ({ ok: true }));

  app.post('/api/chat', { preHandler: createRateLimit(30, 60_000) }, async (request, reply) => {
    try {
      const result = await sendChatMessage(request.body);
      return reply.send({ ok: true, message: result.message });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          ok: false,
          message: 'Please enter a message and try again.',
          issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
        });
      }

      request.log.error(error);
      return reply.code(502).send({
        ok: false,
        message: 'The assistant is unavailable right now. Please use the contact form and Aivanta will follow up.',
      });
    }
  });

  app.post('/api/leads', { preHandler: createRateLimit(12, 60_000) }, async (request, reply) => {
    try {
      const result = await submitLead(request.body);
      return reply.code(201).send({ ok: true, leadId: result.leadId });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          ok: false,
          message: 'Please check the form and try again.',
          issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        ok: false,
        message: 'Unable to submit the request right now.',
      });
    }
  });

  return app;
}
