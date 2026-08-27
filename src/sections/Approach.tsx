import { processSteps } from '../data/siteContent';

export function Approach() {
  return (
    <section id="approach" className="section section--approach">
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">How Aivanta Works</p>
        </div>
        <div className="process-grid">
          {processSteps.map(([number, title, text], index) => (
            <div className="process-item" key={number}>
              <div className="process-top">
                <span>{number}</span>
                {index < processSteps.length - 1 ? <i /> : null}
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
