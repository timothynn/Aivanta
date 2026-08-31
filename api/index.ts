import { Pool } from 'pg';
import { createConfiguredSupportChatAssistant } from '../server/adapters/supportChatAssistant.js';
import { ConsoleLeadNotifier, ResendLeadNotifier } from '../server/adapters/notifiers.js';
import { InMemoryAnalyticsStore, PostgresAnalyticsStore } from '../server/adapters/postgresAnalyticsStore.js';
import { InMemoryLeadStore } from '../server/adapters/inMemoryLeadStore.js';
import { PostgresLeadStore } from '../server/adapters/postgresLeadStore.js';
import { createApp } from '../server/app.js';
import { readConfig } from '../server/config.js';

const config = readConfig();
const pool = config.databaseUrl ? new Pool({ connectionString: config.databaseUrl }) : null;
const leadStore = pool ? new PostgresLeadStore(pool) : new InMemoryLeadStore();
const analyticsStore = pool ? new PostgresAnalyticsStore(pool) : new InMemoryAnalyticsStore();
const app = await createApp({
  config,
  chatAssistant: createConfiguredSupportChatAssistant(config),
  leadStore,
  leadNotifier: config.resendApiKey ? new ResendLeadNotifier(config) : new ConsoleLeadNotifier(),
  analyticsStore,
});

export default async function handler(request: Parameters<typeof app.ready>[0], response: unknown) {
  await app.ready();
  return app.server.emit('request', request as never, response as never);
}
