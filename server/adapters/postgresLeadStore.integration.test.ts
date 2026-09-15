// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { PostgresLeadStore } from './postgresLeadStore';
import { createLeadIntake } from '../domain/lead';

const connectionString = process.env.TEST_DATABASE_URL;
describe.skipIf(!connectionString)('PostgreSQL lead persistence', () => {
  const schema = `aivanta_test_${randomUUID().replace(/-/g, '')}`;
  let pool: Pool;
  let admin: Pool;
  beforeAll(async () => {
    if (!connectionString || new URL(connectionString).pathname !== '/aivanta_test') throw new Error('TEST_DATABASE_URL must use a dedicated aivanta_test database.');
    admin = new Pool({ connectionString });
    await admin.query(`create schema ${schema}`);
    pool = new Pool({ connectionString, options: `-c search_path=${schema},public` });
    for (const file of ['001_init.sql', '002_opportunity_briefs.sql', '003_lead_qualification.sql']) {
      await pool.query(await readFile(new URL(`../migrations/${file}`, import.meta.url), 'utf8'));
    }
  });
  afterAll(async () => {
    await pool?.end();
    if (admin) { await admin.query(`drop schema if exists ${schema} cascade`); await admin.end(); }
  });
  it('persists one enquiry across concurrent retries and rejects conflicting reuse after reconnecting', async () => {
    const notifier = { notifyLeadCreated: vi.fn().mockResolvedValue(undefined) };
    const store = new PostgresLeadStore(pool);
    const submit = createLeadIntake(store, notifier);
    const input = { submissionId: randomUUID(), name: 'Demo Operator', email: 'demo@example.com', company: '', industry: 'Logistics', message: 'Please discuss shipment preparation.', goals: ['Document intelligence'], source: 'integration_test' };
    const [first, retry] = await Promise.all([submit(input), submit(input)]);
    expect(first).toEqual(retry);
    expect(notifier.notifyLeadCreated).toHaveBeenCalledOnce();
    const reconnect = new Pool({ connectionString, options: `-c search_path=${schema},public` });
    try {
      const persistentStore = new PostgresLeadStore(reconnect);
      expect(await persistentStore.listLeads()).toHaveLength(1);
      const next = createLeadIntake(persistentStore, notifier);
      expect(await next(input)).toEqual(first);
      await expect(next({ ...input, message: 'Different request using the same key.' })).rejects.toThrow('already used');
      expect(await persistentStore.listLeads()).toHaveLength(1);
    } finally { await reconnect.end(); }
  });
});
