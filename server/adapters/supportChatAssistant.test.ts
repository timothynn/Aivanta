import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AppConfig } from '../config';
import { createConfiguredSupportChatAssistant, GeminiSupportChatAssistant, LocalSupportChatAssistant } from './supportChatAssistant';

const baseConfig: AppConfig = {
  apiOrigin: 'http://localhost:5173',
  aiVendor: 'gemini',
  aiModel: '',
  aiApiKey: 'generic-key',
  geminiApiKey: 'gemini-key',
  geminiModel: 'gemini-2.0-flash',
  leadNotificationFrom: 'Aivanta <hello@aivanta.ai>',
  openaiModel: 'gpt-5',
  port: 8787,
};

describe('support chat assistant adapters', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('selects Gemini when configured', () => {
    expect(createConfiguredSupportChatAssistant(baseConfig)).toBeInstanceOf(GeminiSupportChatAssistant);
    expect(createConfiguredSupportChatAssistant({ ...baseConfig, aiVendor: 'local' })).toBeInstanceOf(LocalSupportChatAssistant);
  });

  it('calls Gemini generateContent with the configured key and model', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Aivanta can help with Gemini-backed support.' }] } }],
      }),
    } as Response);

    const assistant = new GeminiSupportChatAssistant(baseConfig);
    const response = await assistant.reply([{ role: 'user', content: 'Can you help with support?' }]);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-goog-api-key': 'gemini-key' }),
      }),
    );
    expect(response.message.content).toBe('Aivanta can help with Gemini-backed support.');
  });
});
