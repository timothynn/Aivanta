import { Icon } from '../components/Icon';
import { services } from '../data/siteContent';

export function Services() {
  return (
    <section id="services" className="section section--services">
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">What We Do</p>
          <h2>End-to-end AI transformation services.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-icon">
                <Icon name={service.icon} size={28} />
              </div>
              <div className="service-number">{service.number}</div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
