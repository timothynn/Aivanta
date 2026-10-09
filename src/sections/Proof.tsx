import { ArrowUpRight, ClipboardCheck, GitBranch, ShieldCheck, Gauge } from 'lucide-react';

const principles = [
  { name: 'Fits your architecture', detail: 'Existing applications, APIs, data and permissions stay central to the solution.', Icon: GitBranch },
  { name: 'Controlled by design', detail: 'Grounded responses, explicit agent capabilities and human review where it matters.', Icon: ShieldCheck },
  { name: 'Measured, not assumed', detail: 'Agree on baselines for cycle time, quality, cost and usefulness before scaling.', Icon: Gauge },
] as const;

export function Proof() {
  return <section id="proof" className="proof-section vy-proof"><div className="container">
    <div className="section-heading vy-split-heading">
      <div><p className="eyebrow">05 / Engineering standards</p><h2>Proof over promises.</h2></div>
      <p>The right AI project earns trust through clear boundaries, demonstrable behaviour and outcomes you can measure.</p>
    </div>
    <div className="vy-principles-grid">{principles.map(({name,detail,Icon})=>
      <article className="vy-principle" key={name}><Icon size={23} /><h3>{name}</h3><p>{detail}</p></article>
    )}</div>
    <div className="vy-proof-note">
      <ClipboardCheck size={20} aria-hidden="true" />
      <p><strong>Realistic by design.</strong> Examples on this website are illustrative—not claims of completed client engagements. Client evidence is shared only with permission.</p>
      <a href="#contact">Discuss a real use case <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  </div></section>;
}
