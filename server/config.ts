export type AiVendor = 'local' | 'openai' | 'gemini';
export type RetrievalMode = 'keyword' | 'semantic';

export type AppConfig = {
  apiOrigin: string;
  databaseUrl?: string;
  adminToken?: string;
  aiVendor: AiVendor;
  aiApiKey?: string;
  aiModel: string;
  geminiApiKey?: string;
  geminiModel: string;
  openaiApiKey?: string;
  openaiModel: string;
  retrievalMode: RetrievalMode;
  embeddingModel: string;
  resendApiKey?: string;
  leadNotificationTo?: string;
  leadNotificationFrom: string;
  port: number;
};

export function readConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const explicitVendor = parseAiVendor(env.AI_VENDOR);
  const aiVendor = explicitVendor ?? (env.GEMINI_API_KEY ? 'gemini' : env.OPENAI_API_KEY || env.AI_API_KEY ? 'openai' : 'local');
  const retrievalMode = env.AI_RETRIEVAL === 'semantic' ? 'semantic' : 'keyword';
  return {
    apiOrigin: env.API_ORIGIN ?? 'http://localhost:5173',
    databaseUrl: env.DATABASE_URL,
    adminToken: env.ADMIN_TOKEN,
    aiVendor,
    aiApiKey: env.AI_API_KEY,
    aiModel: env.AI_MODEL ?? '',
    geminiApiKey: env.GEMINI_API_KEY,
    geminiModel: env.GEMINI_MODEL ?? env.AI_MODEL ?? 'gemini-2.0-flash',
    openaiApiKey: env.OPENAI_API_KEY,
    openaiModel: env.OPENAI_MODEL ?? env.AI_MODEL ?? 'gpt-5',
    retrievalMode,
    embeddingModel: env.AI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
    resendApiKey: env.RESEND_API_KEY,
    leadNotificationTo: env.LEAD_NOTIFICATION_TO,
    leadNotificationFrom: env.LEAD_NOTIFICATION_FROM ?? 'Aivanta <hello@aivanta.ai>',
    port: Number(env.PORT ?? 8787),
  };
}

function parseAiVendor(value: string | undefined): AiVendor | undefined {
  if (value === 'local' || value === 'openai' || value === 'gemini') return value;
  return undefined;
}
