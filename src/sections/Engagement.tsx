import { ArrowRight, CheckCircle2 } from 'lucide-react';

const tiers = [
  { name: 'Discover', title: 'AI Transformation Assessment', body: 'Map one application, workflow, or knowledge problem and leave with a practical set of AI opportunities to prioritize.', items: ['Application and workflow review', 'AI opportunity map', 'Prioritized pilot recommendation'] },
  { name: 'Prove', title: 'Focused AI Pilot', body: 'Build one narrow capability around a real workflow so the team can validate usefulness, risk, and technical fit before scaling.', items: ['One production-shaped use case', 'Evaluation and feedback loop', 'Scale recommendation'] },
  { name: 'Scale', title: 'AI Transformation', body: 'Extend proven capabilities across applications, data, documents, and business workflows with appropriate governance.', items: ['Architecture and integration', 'Agentic and knowledge capabilities', 'Operationalization and improvement'] },
];

const bookingUrl = import.meta.env.VITE_BOOKING_URL ?? '';

export function Engagement() {
  return (
    <section id="engagement" className="engagement-section">
      <div className="container">
        <div className="section-heading engagement-heading">
          <p className="eyebrow">HOW WE ENGAGE</p>
          <h2>Start small. Prove value. Scale what works.</h2>
          <p>Aivanta engagements are designed to reduce uncertainty before a larger transformation. Scope and pricing are tailored to the application, workflow, and constraints involved.</p>
        </div>
        <div className="engagement-grid">
          {tiers.map((tier, index) => (
            <article className={`engagement-card ${index === 1 ? 'engagement-card--featured' : ''}`} key={tier.name}>
              <span className="engagement-step">0{index + 1}</span>
              <span className="engagement-name">{tier.name}</span>
              <h3>{tier.title}</h3>
              <p>{tier.body}</p>
              <div className="engagement-list">{tier.items.map((item) => <div key={item}><CheckCircle2 size={15} />{item}</div>)}</div>
              <a className="button button--ghost-dark" href={index === 0 ? '#assessment' : '#contact'}>{index === 0 ? 'Start assessment' : 'Discuss this path'} <ArrowRight size={16} /></a>
            </article>
          ))}
        </div>
        <div className="booking-strip">
          <div><strong>Prefer a conversation first?</strong><span>Book a short discovery session and bring a problem, not a presentation.</span></div>
          {bookingUrl ? <a className="button button--primary" href={bookingUrl} target="_blank" rel="noreferrer">Book a discovery session <ArrowRight size={17} /></a> : <a className="button button--primary" href="#contact">Request a discovery session <ArrowRight size={17} /></a>}
        </div>
      </div>
    </section>
  );
}
