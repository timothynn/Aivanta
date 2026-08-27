import { Icon } from '../components/Icon';

const existingSoftware = ['Applications', 'Data', 'Documents', 'Workflows'];
const aiLayer = ['AI Assistant', 'Knowledge', 'Agents', 'Models'];
const intelligentWorkflows = ['Insights', 'Automation', 'Decisions', 'Outcomes'];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow eyebrow--light">AI Software Consultancy</p>
          <h1>
            Turn software into <span>intelligent software.</span>
          </h1>
          <p className="hero-subcopy">
            Aivanta helps businesses integrate AI into the applications, data, documents, and workflows they already
            rely on.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="#contact">
              Explore AI transformation <Icon name="arrow" size={18} />
            </a>
            <a className="button button--ghost" href="#approach">
              See how it works <Icon name="arrow" size={17} />
            </a>
          </div>
        </div>
        <div className="hero-diagram" aria-label="Existing software to intelligent workflows">
          <div className="flow-card flow-card--dark">
            <div className="flow-card-title">Existing Software</div>
            {existingSoftware.map((item) => (
              <div className="flow-row" key={item}>
                <span className="mini-box" />
                {item}
              </div>
            ))}
          </div>
          <div className="flow-arrow">›</div>
          <div className="flow-card flow-card--ai">
            <div className="flow-card-title">AI Layer</div>
            <div className="ai-orb">
              <Icon name="bot" size={42} />
            </div>
            {aiLayer.map((item) => (
              <div className="flow-row" key={item}>
                <span className="spark-dot" />
                {item}
              </div>
            ))}
          </div>
          <div className="flow-arrow">›</div>
          <div className="flow-card flow-card--dark">
            <div className="flow-card-title">Intelligent Workflows</div>
            {intelligentWorkflows.map((item) => (
              <div className="flow-row" key={item}>
                <span className="mini-check">
                  <Icon name="check" size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
