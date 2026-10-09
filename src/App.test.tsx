import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('submits the contact form to the lead API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, leadId: 'lead-1' }),
    } as Response);

    render(<App />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Example Co' } });
    fireEvent.change(screen.getByLabelText('Industry'), { target: { value: 'Enterprise Software' } });
    fireEvent.click(screen.getByLabelText('AI integration'));
    fireEvent.change(screen.getByLabelText('What should AI improve?'), {
      target: { value: 'We want to add AI to an internal workflow.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /start a conversation/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/leads',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('jane@example.com'),
        }),
      );
    });
    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
  });

  it('does not acknowledge a successful HTML fallback as a saved lead', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => { throw new SyntaxError('Unexpected token <'); },
    } as Response);
    render(<App />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText('What should AI improve?'), {
      target: { value: 'Please help improve this workflow.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /start a conversation/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be confirmed');
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
  });

  it('carries an assessment into the already-mounted contact form', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ ok: true }) } as Response);
    render(<App />);
    const assessment = within(document.getElementById('assessment')!);
    fireEvent.click(assessment.getByRole('button', { name: 'CRM' }));
    fireEvent.click(assessment.getByRole('button', { name: /continue/i }));
    fireEvent.click(assessment.getByRole('button', { name: 'Save time on repetitive work' }));
    fireEvent.click(assessment.getByRole('button', { name: /continue/i }));
    fireEvent.click(assessment.getByRole('button', { name: 'Database' }));
    fireEvent.click(assessment.getByRole('button', { name: /continue/i }));
    fireEvent.click(assessment.getByRole('button', { name: 'Pilot one workflow' }));
    fireEvent.click(assessment.getByRole('button', { name: /see recommendation/i }));
    fireEvent.click(assessment.getByRole('button', { name: /continue to assessment/i }));
    expect((screen.getByLabelText('What should AI improve?') as HTMLTextAreaElement).value).toContain('System: CRM');
  });

  it('opens the chatbot and sends a message', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: { role: 'assistant', content: 'Veyntis supports AI integration.' } }),
    } as Response);

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open veyntis assistant chat/i }));
    expect(screen.getByText('Veyntis Assistant')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Message Veyntis assistant'), {
      target: { value: 'Can you help with integrations?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/chat',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Can you help with integrations?'),
        }),
      );
    });
    expect(await screen.findByText('Veyntis supports AI integration.')).toBeInTheDocument();
  });
});
