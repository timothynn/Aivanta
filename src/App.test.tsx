import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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

  it('opens the chatbot and sends a message', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: { role: 'assistant', content: 'Aivanta supports AI integration.' } }),
    } as Response);

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open aivanta assistant chat/i }));
    expect(screen.getByText('Aivanta Assistant')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Message Aivanta assistant'), {
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
    expect(await screen.findByText('Aivanta supports AI integration.')).toBeInTheDocument();
  });
});
