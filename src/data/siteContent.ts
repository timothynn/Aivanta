import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileText,
  Grid2X2,
  Layers3,
  Plane,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Workflow,
} from 'lucide-react';

export type IconName =
  | 'bank'
  | 'bot'
  | 'briefcase'
  | 'chart'
  | 'check'
  | 'database'
  | 'document'
  | 'grid'
  | 'layers'
  | 'plane'
  | 'rocket'
  | 'search'
  | 'shield'
  | 'sparkles'
  | 'target'
  | 'truck'
  | 'workflow';

export const iconMap: Record<IconName, LucideIcon> = {
  bank: Banknote,
  bot: Bot,
  briefcase: BriefcaseBusiness,
  chart: BarChart3,
  check: CheckCircle2,
  database: Database,
  document: FileText,
  grid: Grid2X2,
  layers: Layers3,
  plane: Plane,
  rocket: Rocket,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
  target: Target,
  truck: Truck,
  workflow: Workflow,
};

export const services = [
  {
    number: '01',
    title: 'AI Application Assessment',
    body: 'Evaluate systems, data, and workflows to identify the highest-value AI opportunities.',
    icon: 'search',
  },
  {
    number: '02',
    title: 'AI Integration',
    body: 'Integrate practical AI capabilities into the applications and infrastructure already in use.',
    icon: 'layers',
  },
  {
    number: '03',
    title: 'Agentic Workflows',
    body: 'Build AI agents that can reason, act, and assist across real business workflows.',
    icon: 'bot',
  },
  {
    number: '04',
    title: 'Document & Knowledge Intelligence',
    body: 'Turn documents and knowledge into searchable, context-aware business systems.',
    icon: 'document',
  },
  {
    number: '05',
    title: 'AI Modernization',
    body: 'Evolve legacy applications into AI-enabled platforms with practical governance.',
    icon: 'chart',
  },
] as const;

export const processSteps = [
  ['01', 'Discover', 'Understand the business, systems, data, and goals.'],
  ['02', 'Identify', 'Find the highest-impact AI opportunities and prioritize them.'],
  ['03', 'Integrate', 'Bring AI into applications, data, and workflows.'],
  ['04', 'Validate', 'Test accuracy, security, performance, and business value.'],
  ['05', 'Deploy', 'Roll out with controls, training, and change management.'],
  ['06', 'Improve', 'Measure, learn, and optimize for better outcomes.'],
] as const;

export const industries = [
  ['Aviation', 'Complex operations. High standards.', 'plane'],
  ['Professional Services', 'Knowledge-driven. Client-focused.', 'briefcase'],
  ['Financial Services', 'Regulated. Secure. Data-intensive.', 'bank'],
  ['Logistics', 'Real-time operations. End-to-end visibility.', 'truck'],
  ['Enterprise Software', 'Building better software, faster and smarter.', 'grid'],
] as const;

export const whyAivanta = [
  ['Works with what you already have', 'Build on existing systems and investments.'],
  ['Domain-aware', 'AI that understands business context and data.'],
  ['Responsible by design', 'Human oversight, security, and privacy built in.'],
  ['Workflow-focused', 'Optimize for useful work, not demos.'],
  ['Engineering-led', 'Practical, scalable solutions built by engineers.'],
] as const;

export const traditionalApplication = ['User Interface', 'APIs', 'Business Logic', 'Database', 'Documents'] as const;

export const aiEnabledApplication = [
  'User Interface',
  'APIs',
  'Business Logic',
  'Database',
  'Documents',
  'AI Assistant',
  'Knowledge Retrieval',
  'Agentic Workflows',
  'Decision Support',
] as const;
