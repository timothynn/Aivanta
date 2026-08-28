import { ArrowRight, Bot, FileSearch, Workflow, ShieldCheck } from 'lucide-react';

const labs = [
  { title: 'AI-powered document review', description: 'Explore how retrieval, comparison, summaries, and source-aware answers can reduce the effort of working across business documents.', icon: FileSearch, tags: ['RAG', 'Document intelligence', 'Citations'] },
  { title: 'AI workflow assistant', description: 'See how a bounded agent can gather context, prepare work, and hand actions back to people for review and approval.', icon: Workflow, tags: ['Agents', 'Tool use', 'Human-in-the-loop'] },
  { title: 'Enterprise knowledge assistant', description: 'Turn scattered procedures, policies, and operational knowledge into a conversational layer over existing systems.', icon: Bot, tags: ['Knowledge', 'Search', 'Enterprise AI'] },
];

export function Labs() {
  return (
    <section id="labs" className="labs-section">
      <div className="container">
        <div className="section-heading labs-heading">
          <p className="eyebrow">AIVANTA LABS</p>
          <h2>See what intelligent software can look like.</h2>
          <p>These are illustrative product patterns, not claimed client case studies. They show the kinds of capabilities we can prototype around an existing application.</p>
        </div>
        <div className="labs-grid">
          {labs.map(({ title, description, icon: LabIcon, tags }) => (
            <article className="lab-card" key={title}>
              <div className="lab-icon"><LabIcon size={20} /></div>
              <span className="lab-label">ILLUSTRATIVE DEMO</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="lab-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a className="proof-link" href="#assessment">Explore this pattern <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
        <div className="labs-note"><ShieldCheck size={18} /><span>We only publish client outcomes, testimonials, or quantified results when they are real and approved for publication.</span></div>
      </div>
    </section>
  );
}
