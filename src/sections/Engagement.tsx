import { ArrowUpRight, Check } from 'lucide-react';

const tiers = [
  { name: 'Discover', title: 'Opportunity assessment', body: 'Understand one business problem and leave with a clear recommendation before committing to a larger build.', items: ['Workflow and system review', 'Feasibility and risk assessment', 'Prioritized implementation plan'] },
  { name: 'Prove', title: 'Focused AI pilot', body: 'Prototype one high-value capability, measure usefulness and technical fit, then decide whether to expand.', items: ['Scoped working pilot', 'Evaluation and human review', 'Clear go / no-go recommendation'] },
  { name: 'Scale', title: 'Production integration', body: 'Integrate validated intelligence into real applications with appropriate safeguards and ongoing measurement.', items: ['Architecture and API integration', 'Access controls and observability', 'Operational handover'] },
] as const;

export function Engagement() {
  return <section id="engagement" className="engagement-section"><div className="container">
    <div className="section-heading vy-split-heading">
      <div><p className="eyebrow">04 / Work together</p><h2>Start small. Prove value. Scale deliberately.</h2></div>
      <p>No vague transformation promises. Choose the smallest meaningful engagement and build from evidence.</p>
    </div>
    <div className="engagement-grid">{tiers.map((tier,i) => <article className={`engagement-card ${i===1?'engagement-card--featured':''}`} key={tier.name}>
      <span className="engagement-step">0{i+1}</span><span className="engagement-name">{tier.name}</span>
      <h3>{tier.title}</h3><p>{tier.body}</p>
      <div className="engagement-list">{tier.items.map(item => <div key={item}><Check size={15} />{item}</div>)}</div>
      <a className="vy-engagement-link" href={i===0?'#assessment':'#contact'}>{i===0?'Explore an assessment':'Discuss this engagement'} <ArrowUpRight size={16} aria-hidden="true" /></a>
    </article>)}</div>
  </div></section>;
}
