import { afterEach, expect, it, vi } from 'vitest';
import { submitLead } from './client';
afterEach(() => vi.restoreAllMocks());
it('does not show success when a static host returns HTML or malformed JSON for an API call', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => { throw new Error('HTML'); } } as unknown as Response);
  await expect(submitLead({ name: 'Demo User', email: 'demo@example.com', message: 'Demo enquiry', goals: [], source: 'test' })).rejects.toThrow('Unable to confirm');
});
