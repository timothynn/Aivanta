import type { AppConfig } from '../config.js';
import type { ChatAssistant, ChatMessage, ChatResponse } from '../domain/chat.js';

const supportInstructions = [
  'You are Aivanta Assistant, the customer support chatbot for Aivanta.',
  'Help visitors understand Aivanta services, the AI transformation process, industries served, and how to start a consultation.',
  'Be concise, practical, and professional.',
  'Do not claim a human has been booked or contacted. If the visitor wants follow-up, ask them to use the contact form on the page.',
  'Do not request confidential client data, credentials, trade secrets, or regulated personal data.',
].join(' ');

export class LocalSupportChatAssistant implements ChatAssistant {
  async reply(messages: ChatMessage[]): Promise<ChatResponse> {
    const latest = messages[messages.length - 1]?.content.toLowerCase() ?? '';
    const topic = latest.includes('price') || latest.includes('cost')
      ? 'Pricing depends on scope, existing systems, and risk. The best next step is a focused assessment through the contact form.'
      : latest.includes('service')
        ? 'Aivanta helps with AI application assessment, AI integration, agentic workflows, document intelligence, and modernization.'
        : 'Aivanta helps turn existing software, data, documents, and workflows into practical AI-enabled systems.';

    return {
      message: {
        role: 'assistant',
        content: `${topic} What workflow or application are you exploring?`,
      },
    };
  }
}

export class OpenAISupportChatAssistant implements ChatAssistant {
  constructor(private readonly config: AppConfig) {}

  async reply(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.config.openaiApiKey && !this.config.aiApiKey) {
      throw new Error('OPENAI_API_KEY or AI_API_KEY is required for OpenAI chat responses.');
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.config.openaiApiKey ?? this.config.aiApiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.openaiModel || this.config.aiModel || 'gpt-5',
        instructions: supportInstructions,
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      }),
    });

    const body = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      throw new Error(`OpenAI response failed with ${response.status}`);
    }

    const outputText = extractOutputText(body);

    return {
      message: {
        role: 'assistant',
        content: outputText || 'I can help with Aivanta services, AI integration, and next steps. What are you exploring?',
      },
    };
  }
}

export class GeminiSupportChatAssistant implements ChatAssistant {
  constructor(private readonly config: AppConfig) {}

  async reply(messages: ChatMessage[]): Promise<ChatResponse> {
    const apiKey = this.config.geminiApiKey ?? this.config.aiApiKey;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY or AI_API_KEY is required for Gemini chat responses.');
    }

    const model = this.config.geminiModel || this.config.aiModel || 'gemini-2.0-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: supportInstructions }],
          },
          contents: messages.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
          })),
        }),
      },
    );

    const body = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      throw new Error(`Gemini response failed with ${response.status}`);
    }

    const outputText = extractGeminiText(body);

    return {
      message: {
        role: 'assistant',
        content: outputText || 'I can help with Aivanta services, AI integration, and next steps. What are you exploring?',
      },
    };
  }
}

export function createConfiguredSupportChatAssistant(config: AppConfig): ChatAssistant {
  if (config.aiVendor === 'gemini') {
    return new GeminiSupportChatAssistant(config);
  }

  if (config.aiVendor === 'openai') {
    return new OpenAISupportChatAssistant(config);
  }

  return new LocalSupportChatAssistant();
}

function extractOutputText(body: unknown): string {
  if (body && typeof body === 'object' && 'output_text' in body && typeof body.output_text === 'string') {
    return body.output_text.trim();
  }

  if (!body || typeof body !== 'object' || !('output' in body) || !Array.isArray(body.output)) {
    return '';
  }

  return body.output
    .flatMap((item) => {
      if (!item || typeof item !== 'object' || !('content' in item) || !Array.isArray(item.content)) {
        return [];
      }

      return item.content.flatMap((contentPart: unknown) => {
        if (
          contentPart &&
          typeof contentPart === 'object' &&
          'type' in contentPart &&
          contentPart.type === 'output_text' &&
          'text' in contentPart &&
          typeof contentPart.text === 'string'
        ) {
          return [contentPart.text];
        }

        return [];
      });
    })
    .join('\n')
    .trim();
}

function extractGeminiText(body: unknown): string {
  if (!body || typeof body !== 'object' || !('candidates' in body) || !Array.isArray(body.candidates)) {
    return '';
  }

  return body.candidates
    .flatMap((candidate: unknown) => {
      if (
        !candidate ||
        typeof candidate !== 'object' ||
        !('content' in candidate) ||
        !candidate.content ||
        typeof candidate.content !== 'object' ||
        !('parts' in candidate.content) ||
        !Array.isArray(candidate.content.parts)
      ) {
        return [];
      }

      return candidate.content.parts.flatMap((part: unknown) => {
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
          return [part.text];
        }

        return [];
      });
    })
    .join('\n')
    .trim();
}
