import { ArrowUpRight } from 'lucide-react';
import { Icon } from '../components/Icon';
import { services } from '../data/siteContent';

export function Services() {
  return <section id="services" className="section section--services" aria-labelledby="services-title">
    <div className="container">
      <div className="section-heading vy-split-heading">
        <div><p className="eyebrow">02 / What we engineer</p><h2 id="services-title">Intelligence where it matters.</h2></div>
        <p>Practical AI. Engineered around your existing systems, the people using them and the outcomes that count.</p>
      </div>
      <div className="service-grid">
        {services.map(service => <article className="service-card" key={service.number}>
          <span className="service-number">{service.number} / SOLUTION</span>
          <div className="service-icon"><Icon name={service.icon} size={22} /></div>
          <h3>{service.title}</h3><p>{service.body}</p>
          <a href="#contact" className="vy-service-link">Discuss this solution <ArrowUpRight size={16} aria-hidden="true" /></a>
        </article>)}
      </div>
    </div>
  </section>;
}
