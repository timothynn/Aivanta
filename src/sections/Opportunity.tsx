import { Icon } from '../components/Icon';

export function Opportunity() {
  return (
    <section className="opportunity">
      <div className="container opportunity-inner">
        <div className="opportunity-copy">
          <div className="round-icon">
            <Icon name="grid" size={27} />
          </div>
          <div>
            <h2>Most companies already have powerful software and data.</h2>
            <p>The opportunity is not to replace what works. It is to make it intelligent.</p>
          </div>
        </div>
        <div className="simple-transform">
          {[
            ['Existing Software', 'layers'],
            ['AI Layer', 'bot'],
            ['Intelligent Application', 'chart'],
          ].map(([label, icon], index) => (
            <div className="simple-transform-step" key={label}>
              <div className={`simple-step ${index === 1 ? 'simple-step--accent' : ''}`}>
                <div className="round-icon round-icon--small">
                  <Icon name={icon as 'layers' | 'bot' | 'chart'} size={26} />
                </div>
                <strong>{label}</strong>
              </div>
              {index < 2 ? <span className="simple-arrow">→</span> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
