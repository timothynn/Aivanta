import { Pool } from 'pg';
import type { AppConfig } from './config.js';

export function createDatabasePool(config: AppConfig): Pool | null {
  if (!config.databaseUrl) return null;

  return new Pool({
    connectionString: config.databaseUrl,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
    ssl: isSupabaseDatabase(config.databaseUrl) ? { rejectUnauthorized: false } : undefined,
  });
}

function isSupabaseDatabase(connectionString: string): boolean {
  return connectionString.includes('.supabase.co') || connectionString.includes('.pooler.supabase.com');
}
