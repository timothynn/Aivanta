import { Icon } from '../components/Icon';
import { industries, type IconName } from '../data/siteContent';

export function Industries() {
  return (
    <section id="industries" className="section industries">
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">Industries We Serve</p>
        </div>
        <div className="industry-grid">
          {industries.map(([title, text, icon]) => (
            <article key={title}>
              <div className="industry-icon">
                <Icon name={icon as IconName} size={24} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
