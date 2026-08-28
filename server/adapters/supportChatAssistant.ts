import type { AppConfig } from '../config.js';
import { retrieveKnowledge } from '../knowledge/aivantaKnowledge.js';
import type { ChatAssistant, ChatMessage, ChatResponse } from '../domain/chat.js';

const supportInstructions = [
  'You are Aivanta Assistant, the AI transformation discovery guide for Aivanta.',
  'Help visitors identify practical AI opportunities in the software, data, documents, and workflows their business already uses.',
  'Be concise, practical, professional, and human. Avoid AI hype and unsupported claims.',
  'Use the supplied Aivanta knowledge context as the primary source for company-specific claims. Do not invent services, customers, case studies, prices, testimonials, integrations, or outcomes.',
  'Guide the conversation toward a lightweight discovery brief by learning the existing application, workflow or user group, pain point or desired outcome, and useful information sources.',
  'Ask one useful discovery question at a time. Do not interrogate the visitor with a long checklist.',
  'When enough context is available, summarize the opportunity in plain language and suggest a practical starting point such as an assessment, focused pilot, document intelligence capability, assistant, or bounded workflow agent.',
  'Do not claim a human has been booked or contacted. If the visitor wants follow-up, direct them to the contact form and explain that conversation context can be carried into it.',
  'Do not request confidential client data, credentials, trade secrets, regulated personal data, or sensitive production records.',
].join(' ');

function withKnowledge(messages: ChatMessage[]): ChatMessage[] {
  const latest = messages.at(-1)?.content ?? '';
  const entries = retrieveKnowledge(latest);
  if (!entries.length) return messages;
  const context = entries.map((entry) => `### ${entry.title}\n${entry.content}`).join('\n\n');
  return [
    ...messages,
    { role: 'user', content: `Aivanta knowledge context for this turn. Use it to ground company-specific answers.\n\n${context}` },
  ];
}

export class LocalSupportChatAssistant implements ChatAssistant {
  async reply(messages: ChatMessage[]): Promise<ChatResponse> {
    const userMessages = messages.filter((message) => message.role === 'user');
    const latest = userMessages.at(-1)?.content.toLowerCase() ?? '';
    const turn = userMessages.length;

    if (latest.includes('price') || latest.includes('cost')) {
      return { message: { role: 'assistant', content: 'Pricing depends on the systems involved, scope, and level of integration. A focused assessment is usually the best first step. What application or workflow would you most like to improve?' } };
    }
    if (turn === 1) return { message: { role: 'assistant', content: 'Aivanta can help add AI to existing applications without starting with a platform rewrite. What system or application would you like to make more intelligent?' } };
    if (turn === 2) return { message: { role: 'assistant', content: 'What is the biggest pain point in that workflow today — for example, searching for information, repetitive work, document review, customer support, or a multi-step process?' } };
    if (turn === 3) return { message: { role: 'assistant', content: 'What information would the AI need to work with: database records, documents, APIs, emails/files, or another source?' } };
    return { message: { role: 'assistant', content: 'Based on what you have shared, this looks like a good candidate for a focused AI transformation assessment. Use “Prepare consultation brief” below when you are ready.' } };
  }
}

export class OpenAISupportChatAssistant implements ChatAssistant {
  constructor(private readonly config: AppConfig) {}
  async reply(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.config.openaiApiKey && !this.config.aiApiKey) throw new Error('OPENAI_API_KEY or AI_API_KEY is required for OpenAI chat responses.');
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { authorization: `Bearer ${this.config.openaiApiKey ?? this.config.aiApiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.config.openaiModel || this.config.aiModel || 'gpt-5',
        instructions: supportInstructions,
        input: withKnowledge(messages).map((message) => ({ role: message.role, content: message.content })),
      }),
    });
    const body = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) throw new Error(`OpenAI response failed with ${response.status}`);
    return { message: { role: 'assistant', content: extractOutputText(body) || 'I can help identify a practical AI opportunity. What application or workflow are you exploring?' } };
  }
}

export class GeminiSupportChatAssistant implements ChatAssistant {
  constructor(private readonly config: AppConfig) {}
  async reply(messages: ChatMessage[]): Promise<ChatResponse> {
    const apiKey = this.config.geminiApiKey ?? this.config.aiApiKey;
    if (!apiKey) throw new Error('GEMINI_API_KEY or AI_API_KEY is required for Gemini chat responses.');
    const model = this.config.geminiModel || this.config.aiModel || 'gemini-2.0-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: supportInstructions }] },
        contents: withKnowledge(messages).map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.content }] })),
      }),
    });
    const body = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) throw new Error(`Gemini response failed with ${response.status}`);
    return { message: { role: 'assistant', content: extractGeminiText(body) || 'I can help identify a practical AI opportunity. What application or workflow are you exploring?' } };
  }
}

export function createConfiguredSupportChatAssistant(config: AppConfig): ChatAssistant {
  if (config.aiVendor === 'gemini') return new GeminiSupportChatAssistant(config);
  if (config.aiVendor === 'openai') return new OpenAISupportChatAssistant(config);
  return new LocalSupportChatAssistant();
}

function extractOutputText(body: unknown): string {
  if (body && typeof body === 'object' && 'output_text' in body && typeof body.output_text === 'string') return body.output_text.trim();
  if (!body || typeof body !== 'object' || !('output' in body) || !Array.isArray(body.output)) return '';
  return body.output.flatMap((item) => {
    if (!item || typeof item !== 'object' || !('content' in item) || !Array.isArray(item.content)) return [];
    return item.content.flatMap((part: unknown) => part && typeof part === 'object' && 'type' in part && part.type === 'output_text' && 'text' in part && typeof part.text === 'string' ? [part.text] : []);
  }).join('\n').trim();
}

function extractGeminiText(body: unknown): string {
  if (!body || typeof body !== 'object' || !('candidates' in body) || !Array.isArray(body.candidates)) return '';
  return body.candidates.flatMap((candidate: unknown) => {
    if (!candidate || typeof candidate !== 'object' || !('content' in candidate) || !candidate.content || typeof candidate.content !== 'object' || !('parts' in candidate.content) || !Array.isArray(candidate.content.parts)) return [];
    return candidate.content.parts.flatMap((part: unknown) => part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' ? [part.text] : []);
  }).join('\n').trim();
}
