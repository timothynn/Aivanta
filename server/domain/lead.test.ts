import { describe, expect, it, vi } from 'vitest';
import { InMemoryLeadStore } from '../adapters/inMemoryLeadStore';
import { createLeadIntake, type LeadNotifier } from './lead';

const validSubmission = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Example Co',
  industry: 'Enterprise Software',
  message: 'We want to add AI to an internal workflow.',
  goals: ['AI integration'],
  source: 'test',
};

describe('createLeadIntake', () => {
  it('deduplicates concurrent retries and rejects reuse of an identifier for different content', async () => {
    const store = new InMemoryLeadStore();
    const notify = vi.fn().mockResolvedValue(undefined);
    const submit = createLeadIntake(store, { notifyLeadCreated: notify });
    const input = { ...validSubmission, submissionId: '4a2e63b1-050f-497a-b312-fce4ea5cd730' };
    const results = await Promise.all([submit(input), submit(input)]);
    expect(results[0]).toEqual(results[1]);
    expect(store.leads).toHaveLength(1);
    expect(notify).toHaveBeenCalledOnce();
    await expect(submit({ ...input, message: 'A different enquiry with the same identifier.' })).rejects.toThrow('already used');
    expect(store.leads).toHaveLength(1);
  });
  it('acknowledges a stored enquiry even if its email notification fails', async () => {
    const store = new InMemoryLeadStore();
    const notify = vi.fn().mockRejectedValue(new Error('Provider unavailable'));
    const submitLead = createLeadIntake(store, { notifyLeadCreated: notify });
    await expect(submitLead(validSubmission)).resolves.toEqual({ leadId: expect.any(String) });
    expect(store.leads).toHaveLength(1);
  });
  it('stores a valid lead and notifies the configured notifier', async () => {
    const store = new InMemoryLeadStore();
    const notifier: LeadNotifier = {
      notifyLeadCreated: vi.fn().mockResolvedValue(undefined),
    };

    const submitLead = createLeadIntake(store, notifier);
    const result = await submitLead(validSubmission);

    expect(result.leadId).toEqual(store.leads[0].id);
    expect(store.leads[0]).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      status: 'new',
    });
    expect(notifier.notifyLeadCreated).toHaveBeenCalledWith(store.leads[0]);
  });

  it('rejects invalid lead data before storing anything', async () => {
    const store = new InMemoryLeadStore();
    const notifier: LeadNotifier = {
      notifyLeadCreated: vi.fn().mockResolvedValue(undefined),
    };

    const submitLead = createLeadIntake(store, notifier);

    await expect(submitLead({ ...validSubmission, email: 'not-an-email' })).rejects.toThrow();
    expect(store.leads).toHaveLength(0);
    expect(notifier.notifyLeadCreated).not.toHaveBeenCalled();
  });
});
