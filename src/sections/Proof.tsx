import { ArrowRight, BarChart3, Bot, CheckCircle2, Database, FileText, Gauge, GitBranch, Layers3, LockKeyhole, Search, ShieldCheck, Workflow } from 'lucide-react';

const demoWork = [
  {
    label: 'ILLUSTRATIVE SCENARIO',
    title: 'AI-assisted document review',
    description: 'Turn large document collections into a searchable, context-aware knowledge experience with source-aware answers.',
    capabilities: ['Document retrieval', 'Summarization', 'Evidence linking'],
    icon: FileText,
  },
  {
    label: 'ILLUSTRATIVE SCENARIO',
    title: 'AI workflow assistant',
    description: 'Add a guided AI layer to an existing workflow so teams can retrieve context, prepare work, and move through routine steps faster.',
    capabilities: ['Tool-assisted tasks', 'Recommendations', 'Workflow support'],
    icon: Workflow,
  },
  {
    label: 'ILLUSTRATIVE SCENARIO',
    title: 'Enterprise knowledge assistant',
    description: 'Connect approved business knowledge to a conversational interface while keeping answers grounded in the information the organization already manages.',
    capabilities: ['RAG', 'Search', 'Context-aware answers'],
    icon: Search,
  },
] as const;

const integrations = [
  ['Application UI', 'Angular, React, Vue, or an existing web interface.', Layers3],
  ['APIs & services', '.NET, Node.js, Java, REST APIs, and existing business services.', GitBranch],
  ['Data', 'PostgreSQL, SQL Server, Oracle, and application data stores.', Database],
  ['Documents', 'DMS platforms, files, policies, manuals, reports, and knowledge bases.', FileText],
  ['AI layer', 'LLMs, RAG, tool calling, agents, search, and structured AI workflows.', Bot],
  ['Security', 'Application permissions, data boundaries, auditability, and controlled access.', LockKeyhole],
] as const;

const responsibleAi = [
  ['Human oversight', 'Use AI to assist people and prepare work; keep consequential decisions with accountable users.', ShieldCheck],
  ['Grounded answers', 'Prefer approved business data and source material over unsupported model-only answers.', Search],
  ['Controlled actions', 'Connect agents to explicit capabilities and permissions instead of unrestricted system access.', LockKeyhole],
  ['Evaluation & monitoring', 'Measure accuracy, usefulness, cost, latency, and failure modes before expanding usage.', BarChart3],
] as const;

const outcomes = [
  ['Cycle time', 'How long does the workflow take before and after AI assistance?', Gauge],
  ['Search effort', 'How much time does a user spend finding the information needed to work?', Search],
  ['Work completed', 'How many steps can be assisted, prepared, or safely automated?', Workflow],
  ['Quality signals', 'How accurate, useful, grounded, and consistent are the AI results?', CheckCircle2],
] as const;

export function Proof() {
  return (
    <section id="proof" className="proof-section">
      <div className="container">
        <div className="section-heading proof-heading">
          <p className="eyebrow">PROOF & TRUST</p>
          <h2>Practical AI, backed by engineering discipline.</h2>
          <p>We show what can be built, define how success will be measured, and design AI so it can fit responsibly into the systems you already run.</p>
        </div>

        <div className="proof-work-grid">
          {demoWork.map((item) => {
            const ItemIcon = item.icon;
            return (
              <article className="proof-work-card" key={item.title}>
                <div className="proof-card-top"><span>{item.label}</span><ItemIcon size={20} /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="proof-capabilities">{item.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>
                <a href="#assessment" className="proof-link">Explore this kind of use case <ArrowRight size={15} /></a>
              </article>
            );
          })}
        </div>

        <div className="proof-scorecard">
          <div className="proof-scorecard-copy">
            <p className="eyebrow">MEASURE WHAT MATTERS</p>
            <h3>Every AI pilot should have a scorecard.</h3>
            <p>Rather than promising generic productivity gains, start with a baseline, choose the outcomes that matter to the workflow, and measure the change.</p>
          </div>
          <div className="proof-outcome-grid">
            {outcomes.map(([title, text, Icon]) => <div className="proof-outcome" key={title}><span><Icon size={18} /></span><strong>{title}</strong><p>{text}</p></div>)}
          </div>
        </div>

        <div className="proof-integration">
          <div className="proof-subheading"><p className="eyebrow">INTEGRATES WITH YOUR STACK</p><h3>AI should fit your architecture, not replace it.</h3><p>Start with the systems and information you already have. Add an AI layer where it creates measurable value.</p></div>
          <div className="integration-grid">{integrations.map(([title, text, Icon]) => <article key={title}><span className="integration-icon"><Icon size={19} /></span><div><h4>{title}</h4><p>{text}</p></div></article>)}</div>
        </div>

        <div className="responsible-ai">
          <div className="responsible-head"><div><p className="eyebrow">RESPONSIBLE AI</p><h3>Designed for real business environments.</h3></div><div className="responsible-badge"><ShieldCheck size={17} /> Human-in-the-loop</div></div>
          <div className="responsible-grid">{responsibleAi.map(([title, text, Icon]) => <article key={title}><span className="responsible-icon"><Icon size={18} /></span><h4>{title}</h4><p>{text}</p></article>)}</div>
        </div>

        <div className="proof-trust-note">
          <div className="proof-trust-mark"><CheckCircle2 size={22} /></div>
          <div><strong>Client proof will be added as it becomes available.</strong><p>Until then, Aivanta presents illustrative scenarios and measurable engineering practices rather than invented testimonials or results.</p></div>
          <a className="button button--primary" href="#contact">Discuss a real use case <ArrowRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}
