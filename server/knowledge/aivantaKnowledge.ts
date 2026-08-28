export type KnowledgeEntry = {
  title: string;
  keywords: string[];
  content: string;
};

export const aivantaKnowledge: KnowledgeEntry[] = [
  {
    title: 'Aivanta positioning',
    keywords: ['aivanta', 'what do you do', 'consultancy', 'company'],
    content: 'Aivanta is an AI software consultancy focused on turning existing business applications into intelligent, AI-enabled systems. The approach is integration-first: work with existing applications, data, documents, APIs, and workflows rather than requiring a wholesale platform replacement.',
  },
  {
    title: 'AI transformation assessment',
    keywords: ['assessment', 'roadmap', 'strategy', 'discover'],
    content: 'The AI Transformation Assessment is a focused discovery engagement. Aivanta reviews an existing application, workflow, data, and knowledge environment, identifies practical AI opportunities, prioritizes them by value and feasibility, and proposes a sensible next step such as a focused pilot.',
  },
  {
    title: 'AI integration',
    keywords: ['integration', 'api', 'application', 'existing software'],
    content: 'Aivanta can add AI capabilities around existing software through application APIs, business services, databases, documents, search, and controlled AI workflows. Typical capabilities include assistants, intelligent search, summarization, document intelligence, recommendations, and workflow assistance.',
  },
  {
    title: 'Agentic workflows',
    keywords: ['agent', 'agentic', 'workflow', 'automation', 'tool calling'],
    content: 'Agentic workflows use AI to assist with bounded multi-step work. Aivanta emphasizes explicit capabilities, permissions, human oversight, evaluation, and measurable outcomes rather than unrestricted autonomous access.',
  },
  {
    title: 'Document and knowledge intelligence',
    keywords: ['documents', 'rag', 'knowledge', 'search', 'dms'],
    content: 'Aivanta can turn enterprise documents and knowledge into searchable, context-aware experiences using retrieval, source-aware answers, summarization, comparison, and structured extraction. The long-term architecture can evolve from curated retrieval to embeddings and vector search as a use case requires it.',
  },
  {
    title: 'Responsible AI',
    keywords: ['security', 'responsible', 'governance', 'privacy', 'human'],
    content: 'Aivanta treats responsible AI as part of engineering: human oversight for consequential decisions, grounded answers where possible, controlled system actions, appropriate access boundaries, evaluation, monitoring, and protection of confidential information.',
  },
  {
    title: 'Engagement paths',
    keywords: ['pilot', 'scale', 'engagement', 'project', 'pricing', 'cost'],
    content: 'Aivanta uses three practical engagement paths: Discover through an AI Transformation Assessment, Prove through a focused AI Pilot, and Scale through broader AI Transformation. Pricing depends on scope, existing architecture, data, integrations, and required controls, so the first step is usually a focused assessment rather than a fixed generic package.',
  },
  {
    title: 'Industries',
    keywords: ['aviation', 'financial', 'logistics', 'professional services', 'enterprise'],
    content: 'Aivanta is intended for businesses with existing software, data, documents, and workflows, especially complex or regulated environments. Areas of interest include aviation, professional services, financial services, logistics, and enterprise software.',
  },
];

export function retrieveKnowledge(query: string, limit = 4): KnowledgeEntry[] {
  const terms = normalize(query).split(/\\s+/).filter(Boolean);
  const scored = aivantaKnowledge.map((entry) => {
    const haystack = normalize(`${entry.title} ${entry.keywords.join(' ')} ${entry.content}`);
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
    return { entry, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
