import { describe, expect, it, vi } from 'vitest';
import { createSupportChat, type ChatAssistant } from './chat';

describe('createSupportChat', () => {
  it('returns an assistant response for valid chat history', async () => {
    const assistant: ChatAssistant = {
      reply: vi.fn().mockResolvedValue({ message: { role: 'assistant', content: 'Aivanta can help.' } }),
    };

    const sendMessage = createSupportChat(assistant);
    const response = await sendMessage({ messages: [{ role: 'user', content: 'What do you do?' }] });

    expect(response.message.content).toBe('Aivanta can help.');
    expect(assistant.reply).toHaveBeenCalledWith([{ role: 'user', content: 'What do you do?' }]);
  });

  it('rejects invalid chat payloads', async () => {
    const assistant: ChatAssistant = {
      reply: vi.fn(),
    };
    const sendMessage = createSupportChat(assistant);

    await expect(sendMessage({ messages: [{ role: 'user', content: '' }] })).rejects.toThrow();
    expect(assistant.reply).not.toHaveBeenCalled();
  });
});
