import type { AppConfig } from './config.js';
import type { ChatMessage } from './domain/chat.js';

export type OpportunityBrief = {
  summary: string;
  system: string;
  users: string;
  painPoint: string;
  dataSources: string;
  opportunities: string[];
  recommendedStart: string;
  considerations: string[];
};

const instructions = [
  'Create a concise AI opportunity brief from the visitor conversation.',
  'Do not invent facts that are not supported by the conversation. Use "Not identified" where needed.',
  'Keep recommendations practical and suitable for an existing business application.',
  'Consider assistants, retrieval/document intelligence, recommendations, and bounded workflow agents when appropriate.',
  'Include human oversight, permissions, grounding, evaluation, and data sensitivity considerations when relevant.',
  'Return valid JSON only with keys: summary, system, users, painPoint, dataSources, opportunities, recommendedStart, considerations.',
  'opportunities and considerations must be JSON string arrays.',
].join(' ');

export async function generateOpportunityBrief(config: AppConfig, messages: ChatMessage[]): Promise<OpportunityBrief> {
  if (config.aiVendor === 'local' || (!config.openaiApiKey && !config.aiApiKey && !config.geminiApiKey)) {
    return localBrief(messages);
  }

  const prompt = messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n');
  if (config.aiVendor === 'gemini') {
    return generateWithGemini(config, prompt);
  }
  return generateWithOpenAI(config, prompt);
}

async function generateWithOpenAI(config: AppConfig, prompt: string): Promise<OpportunityBrief> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: `Bearer ${config.openaiApiKey ?? config.aiApiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: config.openaiModel || config.aiModel || 'gpt-5',
      instructions,
      input: prompt,
    }),
  });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) throw new Error(`OpenAI opportunity brief failed with ${response.status}`);
  return parseBrief(extractOutputText(body));
}

async function generateWithGemini(config: AppConfig, prompt: string): Promise<OpportunityBrief> {
  const apiKey = config.geminiApiKey ?? config.aiApiKey;
  const model = config.geminiModel || config.aiModel || 'gemini-2.0-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey ?? '' },
    body: JSON.stringify({ system_instruction: { parts: [{ text: instructions }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
  });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) throw new Error(`Gemini opportunity brief failed with ${response.status}`);
  return parseBrief(extractGeminiText(body));
}

function localBrief(messages: ChatMessage[]): OpportunityBrief {
  const userText = messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ');
  return {
    summary: userText ? 'A focused AI transformation assessment is recommended based on the discovery conversation.' : 'Start with an AI transformation assessment around an existing application or workflow.',
    system: 'Not identified',
    users: 'Not identified',
    painPoint: userText || 'Not identified',
    dataSources: 'Not identified',
    opportunities: ['AI assistant', 'Knowledge retrieval', 'Bounded workflow assistance'],
    recommendedStart: 'AI Transformation Assessment',
    considerations: ['Human oversight', 'Access permissions', 'Grounded responses', 'Evaluation and monitoring'],
  };
}

function parseBrief(text: string): OpportunityBrief {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<OpportunityBrief>;
    return {
      summary: String(parsed.summary ?? 'Not identified'),
      system: String(parsed.system ?? 'Not identified'),
      users: String(parsed.users ?? 'Not identified'),
      painPoint: String(parsed.painPoint ?? 'Not identified'),
      dataSources: String(parsed.dataSources ?? 'Not identified'),
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities.map(String).slice(0, 6) : [],
      recommendedStart: String(parsed.recommendedStart ?? 'AI Transformation Assessment'),
      considerations: Array.isArray(parsed.considerations) ? parsed.considerations.map(String).slice(0, 6) : [],
    };
  } catch {
    return { ...localBrief([{ role: 'user', content: text }]), summary: text.slice(0, 500) || 'Not identified' };
  }
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
