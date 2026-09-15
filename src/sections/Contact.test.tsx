import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Assessment } from './Assessment';
import { Contact } from './Contact';
import { Chatbot } from '../components/Chatbot';

beforeEach(() => {
  sessionStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
});

it('carries an assistant brief into an enquiry only after the consultation action', async () => {
  const brief = { summary: 'Check shipment packs.', system: 'Forwarding system', users: 'Operators', painPoint: 'Re-keying documents', dataSources: 'Invoices', opportunities: ['Document checking'], recommendedStart: 'One workflow assessment', considerations: ['Human review'] };
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => ({ ok: true, json: async () =>
    String(url).endsWith('/api/opportunity-brief') ? { brief } : String(url).endsWith('/api/chat') ? { ok: true, message: { role: 'assistant', content: 'Tell me about the shipment workflow.' } } : { ok: true, leadId: 'lead-1' } } as Response));
  render(<><Chatbot /><Contact /></>);
  fireEvent.click(screen.getByRole('button', { name: 'Open Aivanta assistant chat' }));
  for (const message of ['We use a forwarding system.', 'We re-key invoice data.']) {
    fireEvent.change(screen.getByLabelText('Message Aivanta assistant'), { target: { value: message } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.queryByText('Thinking through the use case…')).not.toBeInTheDocument());
  }
  fireEvent.click(await screen.findByRole('button', { name: 'Prepare opportunity brief' }));
  const carry = await screen.findByRole('button', { name: 'Carry this into a consultation' });
  expect(screen.queryByLabelText('Assistant discovery summary')).not.toBeInTheDocument();
  fireEvent.click(carry);
  expect(screen.getByLabelText('Assistant discovery summary')).toHaveTextContent('One workflow assessment');
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Demo Operator' } });
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'demo@example.com' } });
  fireEvent.change(screen.getByLabelText('What should AI improve?'), { target: { value: 'Please discuss a document checking pilot.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Start a conversation' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.objectContaining({ body: expect.stringContaining('"opportunityBrief"') })));
  expect(screen.queryByLabelText('Assistant discovery summary')).not.toBeInTheDocument();
});

it('reuses the enquiry identifier after a lost response', async () => {
  let attempts = 0;
  const bodies: string[] = [];
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
    if (String(url).endsWith('/api/leads')) {
      bodies.push(String(options?.body));
      if (attempts++ === 0) throw new Error('Connection lost');
    }
    return { ok: true, json: async () => ({ ok: true, leadId: 'lead-1' }) } as Response;
  });
  render(<Contact />);
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Demo Operator' } });
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'demo@example.com' } });
  fireEvent.change(screen.getByLabelText('What should AI improve?'), { target: { value: 'Please discuss a shipment workflow.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Start a conversation' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Connection lost');
  fireEvent.click(screen.getByRole('button', { name: 'Start a conversation' }));
  await screen.findByText(/Request received/);
  expect(JSON.parse(bodies[0]).submissionId).toBe(JSON.parse(bodies[1]).submissionId);
});
afterEach(() => vi.restoreAllMocks());

it('carries an assessment completed on the same page into the submitted enquiry without replacing the draft', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ ok: true, leadId: 'lead-1' }) } as Response);
  render(<><Assessment /><Contact /></>);
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Demo Operator' } });
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'demo@example.com' } });
  fireEvent.change(screen.getByLabelText('What should AI improve?'), { target: { value: 'Keep this draft about shipment preparation.' } });
  for (const answer of ['Custom application', 'Save time on repetitive work', 'Documents', 'Pilot one workflow']) {
    fireEvent.click(screen.getByRole('button', { name: answer }));
    fireEvent.click(screen.getByRole('button', { name: /^(Continue|See recommendation)$/ }));
  }
  fireEvent.click(screen.getByRole('button', { name: /Continue to (assessment|conversation)/ }));
  expect(screen.getByLabelText('What should AI improve?')).toHaveValue('Keep this draft about shipment preparation.');
  fireEvent.click(screen.getByRole('button', { name: 'Start a conversation' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.objectContaining({ body: expect.stringContaining('Custom application') })));
  expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.objectContaining({ body: expect.stringContaining('Keep this draft about shipment preparation.') }));
});
