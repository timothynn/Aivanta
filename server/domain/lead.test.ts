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
