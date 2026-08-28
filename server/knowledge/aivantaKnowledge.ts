import type { AppConfig } from '../config.js';

export type KnowledgeEntry = { title: string; keywords: string[]; content: string };

export const aivantaKnowledge: KnowledgeEntry[] = [
  { title: 'Aivanta positioning', keywords: ['aivanta', 'what do you do', 'consultancy', 'company'], content: 'Aivanta is an AI software consultancy focused on turning existing business applications into intelligent, AI-enabled systems. The approach is integration-first: work with existing applications, data, documents, APIs, and workflows rather than requiring a wholesale platform replacement.' },
  { title: 'AI transformation assessment', keywords: ['assessment', 'roadmap', 'strategy', 'discover'], content: 'The AI Transformation Assessment is a focused discovery engagement. Aivanta reviews an existing application, workflow, data, and knowledge environment, identifies practical AI opportunities, prioritizes them by value and feasibility, and proposes a sensible next step such as a focused pilot.' },
  { title: 'AI integration', keywords: ['integration', 'api', 'application', 'existing software'], content: 'Aivanta can add AI capabilities around existing software through application APIs, business services, databases, documents, search, and controlled AI workflows. Typical capabilities include assistants, intelligent search, summarization, document intelligence, recommendations, and workflow assistance.' },
  { title: 'Agentic workflows', keywords: ['agent', 'agentic', 'workflow', 'automation', 'tool calling'], content: 'Agentic workflows use AI to assist with bounded multi-step work. Aivanta emphasizes explicit capabilities, permissions, human oversight, evaluation, and measurable outcomes rather than unrestricted autonomous access.' },
  { title: 'Document and knowledge intelligence', keywords: ['documents', 'rag', 'knowledge', 'search', 'dms'], content: 'Aivanta can turn enterprise documents and knowledge into searchable, context-aware experiences using retrieval, source-aware answers, summarization, comparison, and structured extraction. Semantic retrieval is optional and uses embeddings when an OpenAI key and AI_RETRIEVAL=semantic are configured.' },
  { title: 'Responsible AI', keywords: ['security', 'responsible', 'governance', 'privacy', 'human'], content: 'Aivanta treats responsible AI as part of engineering: human oversight for consequential decisions, grounded answers where possible, controlled system actions, appropriate access boundaries, evaluation, monitoring, and protection of confidential information.' },
  { title: 'Engagement paths', keywords: ['pilot', 'scale', 'engagement', 'project', 'pricing', 'cost'], content: 'Aivanta uses three practical engagement paths: Discover through an AI Transformation Assessment, Prove through a focused AI Pilot, and Scale through broader AI Transformation. Pricing depends on scope, existing architecture, data, integrations, and required controls.' },
  { title: 'Industries', keywords: ['aviation', 'financial', 'logistics', 'professional services', 'enterprise'], content: 'Aivanta is intended for businesses with existing software, data, documents, and workflows, especially complex or regulated environments. Areas of interest include aviation, professional services, financial services, logistics, and enterprise software.' },
];

let embeddingCache: number[][] | null = null;
let embeddingPromise: Promise<number[][] | null> | null = null;

export async function retrieveKnowledge(query: string, config: AppConfig, limit = 4): Promise<KnowledgeEntry[]> {
  if (config.retrievalMode === 'semantic' && config.openaiApiKey) {
    const semantic = await semanticRetrieve(query, config, limit);
    if (semantic.length) return semantic;
  }
  return keywordRetrieve(query, limit);
}

function keywordRetrieve(query: string, limit: number): KnowledgeEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return aivantaKnowledge
    .map((entry) => ({ entry, score: terms.reduce((total, term) => total + (normalize(`${entry.title} ${entry.keywords.join(' ')} ${entry.content}`).includes(term) ? 1 : 0), 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

async function semanticRetrieve(query: string, config: AppConfig, limit: number): Promise<KnowledgeEntry[]> {
  try {
    const [queryEmbedding, documentEmbeddings] = await Promise.all([embedTexts([query], config), getDocumentEmbeddings(config)]);
    if (!queryEmbedding?.[0] || !documentEmbeddings || documentEmbeddings.length !== aivantaKnowledge.length) return [];
    return aivantaKnowledge
      .map((entry, index) => ({ entry, score: cosine(queryEmbedding[0], documentEmbeddings[index] ?? []) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter((item) => item.score > 0.18)
      .map((item) => item.entry);
  } catch {
    return [];
  }
}

async function getDocumentEmbeddings(config: AppConfig): Promise<number[][] | null> {
  if (embeddingCache) return embeddingCache;
  if (embeddingPromise) return embeddingPromise;
  embeddingPromise = embedTexts(aivantaKnowledge.map((entry) => `${entry.title}\n${entry.content}`), config);
  embeddingCache = await embeddingPromise;
  embeddingPromise = null;
  return embeddingCache;
}

async function embedTexts(inputs: string[], config: AppConfig): Promise<number[][] | null> {
  if (!config.openaiApiKey) return null;
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { authorization: `Bearer ${config.openaiApiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: config.embeddingModel, input: inputs }),
  });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok || !body || typeof body !== 'object' || !('data' in body) || !Array.isArray(body.data)) return null;
  return body.data.map((item: unknown) => item && typeof item === 'object' && 'embedding' in item && Array.isArray(item.embedding) ? item.embedding.map(Number) : null).filter((item): item is number[] => Array.isArray(item));
}

function cosine(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0; let aa = 0; let bb = 0;
  for (let i = 0; i < a.length; i += 1) { dot += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; }
  return aa && bb ? dot / (Math.sqrt(aa) * Math.sqrt(bb)) : 0;
}

function normalize(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
