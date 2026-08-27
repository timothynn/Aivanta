import { Icon } from '../components/Icon';
import { aiEnabledApplication, traditionalApplication } from '../data/siteContent';

export function Transformation() {
  return (
    <section id="about" className="section transformation">
      <div className="container transformation-inner">
        <div className="transform-copy">
          <p className="eyebrow">The Transformation</p>
          <h2>From traditional applications to intelligent applications.</h2>
          <p>We do not replace what you have. We enhance it with intelligence where it matters most.</p>
          <a className="button button--primary" href="#contact">
            Explore the transformation <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="compare-wrap">
          <div className="compare-card">
            <h3>Traditional Application</h3>
            {traditionalApplication.map((item) => (
              <div key={item}>
                <Icon name={item === 'Database' ? 'database' : item === 'Documents' ? 'document' : 'layers'} size={15} />
                {item}
              </div>
            ))}
          </div>
          <div className="compare-arrow">→</div>
          <div className="compare-card compare-card--ai">
            <h3>AI-Enabled Application</h3>
            {aiEnabledApplication.map((item, index) => (
              <div key={item}>
                <Icon name={index >= 5 ? 'bot' : item === 'Database' ? 'database' : item === 'Documents' ? 'document' : 'layers'} size={15} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
