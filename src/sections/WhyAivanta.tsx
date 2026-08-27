import { Icon } from '../components/Icon';
import { whyAivanta } from '../data/siteContent';

export function WhyAivanta() {
  return (
    <section className="section why">
      <div className="container">
        <div className="why-heading">
          <h2>Why Aivanta</h2>
        </div>
        <div className="why-grid">
          {whyAivanta.map(([title, text]) => (
            <article key={title}>
              <div className="why-icon">
                <Icon name="check" size={18} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
