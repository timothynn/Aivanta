import { Pool } from 'pg';
import { InMemoryAnalyticsStore, PostgresAnalyticsStore } from './adapters/postgresAnalyticsStore.js';
import { InMemoryLeadStore } from './adapters/inMemoryLeadStore.js';
import { PostgresLeadStore } from './adapters/postgresLeadStore.js';
import { ConsoleLeadNotifier, ResendLeadNotifier } from './adapters/notifiers.js';
import { createConfiguredSupportChatAssistant } from './adapters/supportChatAssistant.js';
import { createApp } from './app.js';
import { readConfig } from './config.js';

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

await app.listen({ host: '0.0.0.0', port: config.port });
