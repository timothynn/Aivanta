import { Icon } from '../components/Icon';
import { industries, type IconName } from '../data/siteContent';

export function Industries() {
  return <section id="industries" className="section industries vy-industries"><div className="container">
    <div className="section-heading vy-split-heading">
      <div><p className="eyebrow">06 / Domain perspective</p><h2>Built for complex operations.</h2></div>
      <p>Our engineering interests span systems where reliability, information and context matter. These are focus areas, not claims of existing clients.</p>
    </div>
    <div className="industry-grid">{industries.map(([title,description,icon]) =>
      <article key={title}><div className="industry-icon"><Icon name={icon as IconName} size={22} /></div><div><h3>{title}</h3><p>{description}</p></div></article>
    )}</div>
  </div></section>;
}
