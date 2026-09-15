import { expect, it } from 'vitest';
import { readConfig } from './config';

it('refuses production startup without durable intake and notification configuration', () => {
  expect(() => readConfig({ NODE_ENV: 'production' })).toThrow('DATABASE_URL');
  expect(() => readConfig({ NODE_ENV: 'production', DATABASE_URL: 'configured', ADMIN_TOKEN: 'configured', RESEND_API_KEY: 'configured', LEAD_NOTIFICATION_TO: 'demo@example.com', LEAD_NOTIFICATION_FROM: 'demo@example.com', API_ORIGIN: 'https://example.com' })).not.toThrow();
  expect(readConfig({}).databaseUrl).toBeUndefined();
});
