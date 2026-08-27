import { Pool } from 'pg';
import { InMemoryLeadStore } from './adapters/inMemoryLeadStore.js';
import { PostgresLeadStore } from './adapters/postgresLeadStore.js';
import { ConsoleLeadNotifier, ResendLeadNotifier } from './adapters/notifiers.js';
import { createConfiguredSupportChatAssistant } from './adapters/supportChatAssistant.js';
import { createApp } from './app.js';
import { readConfig } from './config.js';

const config = readConfig();

const leadStore = config.databaseUrl
  ? new PostgresLeadStore(new Pool({ connectionString: config.databaseUrl }))
  : new InMemoryLeadStore();

const app = await createApp({
  config,
  chatAssistant: createConfiguredSupportChatAssistant(config),
  leadStore,
  leadNotifier: config.resendApiKey ? new ResendLeadNotifier(config) : new ConsoleLeadNotifier(),
});

await app.listen({ host: '0.0.0.0', port: config.port });
