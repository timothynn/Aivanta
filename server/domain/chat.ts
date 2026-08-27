import { z } from 'zod';

const roles = ['user', 'assistant'] as const;

export const chatMessageSchema = z.object({
  role: z.enum(roles),
  content: z.string().trim().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export type ChatResponse = {
  message: ChatMessage;
};

export type ChatAssistant = {
  reply(messages: ChatMessage[]): Promise<ChatResponse>;
};

export function createSupportChat(assistant: ChatAssistant) {
  return async function sendMessage(input: unknown): Promise<ChatResponse> {
    const request = chatRequestSchema.parse(input);
    return assistant.reply(request.messages);
  };
}
