import { ArrowRight, ArrowUpRight, Check, Layers3, Workflow, BrainCircuit } from 'lucide-react';

const sources = ['Applications', 'Documents', 'APIs & data'];
const intelligence = ['Grounded AI', 'Knowledge retrieval', 'Guarded agents'];
const outcomes = ['Less manual work', 'Faster discovery', 'Better decisions'];

export function Hero() {
  return <section className="hero vy-hero" aria-labelledby="hero-title">
    <div className="hero-grid" aria-hidden="true" />
    <div className="container hero-inner vy-hero-inner">
      <div className="hero-copy">
        <p className="eyebrow eyebrow--light">01 / Applied AI &amp; systems engineering</p>
        <h1 id="hero-title">Your systems already work.<br /><span>Make them work smarter.</span></h1>
        <p className="hero-subcopy">We engineer useful AI into the applications, data and workflows your business already relies on. No unnecessary rebuilds. No AI for the sake of AI.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#contact">Discuss a project <ArrowUpRight size={17} aria-hidden="true" /></a>
          <a className="button button--ghost" href="#demo">See how it works <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="vy-hero-micro"><span className="vy-signal" /> Nairobi-based engineering studio <span className="vy-micro-divider">/</span> Built for real operations</div>
      </div>
      <div className="vy-system">
        <div className="vy-system-head"><span>ENGINEERED INTELLIGENCE / CONCEPTUAL FLOW</span><span className="vy-system-state"><span className="vy-signal" /> HUMAN-IN-CONTROL</span></div>
        <div className="vy-system-flow">
          <div className="vy-system-node">
            <span className="vy-node-label"><Layers3 size={16} /> EXISTING SYSTEMS</span>
            {sources.map(item => <div className="vy-flow-line" key={item}><span className="vy-flow-square" />{item}</div>)}
          </div>
          <span className="vy-flow-arrow" aria-hidden="true">→</span>
          <div className="vy-system-node vy-system-node--active">
            <span className="vy-node-label"><BrainCircuit size={16} /> INTELLIGENCE LAYER</span>
            {intelligence.map(item => <div className="vy-flow-line" key={item}><span className="vy-flow-dot" />{item}</div>)}
          </div>
          <span className="vy-flow-arrow" aria-hidden="true">→</span>
          <div className="vy-system-node">
            <span className="vy-node-label"><Workflow size={16} /> BETTER OPERATIONS</span>
            {outcomes.map(item => <div className="vy-flow-line" key={item}><Check size={13} />{item}</div>)}
          </div>
        </div>
        <div className="vy-system-foot">EXISTING INFRASTRUCTURE <span>·</span> CONTROLLED ACTIONS <span>·</span> MEASURABLE VALUE</div>
      </div>
    </div>
  </section>;
}
