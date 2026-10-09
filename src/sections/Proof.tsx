import { ArrowUpRight, ClipboardCheck, GitBranch, ShieldCheck, Gauge } from 'lucide-react';

const principles = [
  { name: 'Fits your architecture', detail: 'Existing applications, APIs, data and permissions stay central to the solution.', Icon: GitBranch },
  { name: 'Controlled by design', detail: 'We propose grounded responses, scoped agent capabilities and human review where it matters.', Icon: ShieldCheck },
  { name: 'Measured, not assumed', detail: 'We define baselines for cycle time, quality, cost and usefulness before scaling.', Icon: Gauge },
] as const;

export function Proof() {
  return <section id="proof" className="proof-section vy-proof"><div className="container">
    <div className="section-heading vy-split-heading">
      <div><p className="eyebrow">05 / About the studio</p><h2>Independent by design. Engineering-led by choice.</h2></div>
      <p>Veyntis is an independent Nairobi-based software and applied AI studio. We work from a simple premise: existing business systems deserve intelligent improvements, not unnecessary replacements.</p>
    </div>
    <div className="vy-principles-grid">{principles.map(({name,detail,Icon})=>
      <article className="vy-principle" key={name}><Icon size={23} /><h3>{name}</h3><p>{detail}</p></article>
    )}</div>
    <div className="vy-proof-note">
      <ClipboardCheck size={20} aria-hidden="true" />
      <p><strong>Small studio, clear accountability.</strong> Start with a discovery conversation, then a focused scoped proposal. All transformation examples on this site are illustrative, not claims of past client engagements.</p>
      <a href="#contact">Discuss your system <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  </div></section>;
}
