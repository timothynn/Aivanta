import React from 'react';

const services = [
  {
    number: '01',
    title: 'AI Application Assessment',
    body: 'Evaluate your systems, data, and workflows to identify high-value AI opportunities.',
    icon: 'search',
  },
  {
    number: '02',
    title: 'AI Integration',
    body: 'Integrate practical AI capabilities into the applications, data, and infrastructure you already have.',
    icon: 'layers',
  },
  {
    number: '03',
    title: 'Agentic Workflows',
    body: 'Build AI agents that can reason, act, and assist across real business workflows.',
    icon: 'bot',
  },
  {
    number: '04',
    title: 'Document & Knowledge Intelligence',
    body: 'Turn documents and information into searchable, context-aware business knowledge.',
    icon: 'document',
  },
  {
    number: '05',
    title: 'AI Modernization',
    body: 'Evolve existing applications into intelligent, future-ready platforms.',
    icon: 'chart',
  },
];

const process = [
  ['01', 'Discover', 'Understand your business, systems, data and goals.'],
  ['02', 'Identify', 'Find the highest-impact AI opportunities and prioritize them.'],
  ['03', 'Integrate', 'Bring AI into your applications, data and workflows.'],
  ['04', 'Validate', 'Test accuracy, security, performance and business value.'],
  ['05', 'Deploy', 'Roll out with the right controls, training and change management.'],
  ['06', 'Improve', 'Continuously learn, measure and optimize for better outcomes.'],
];

const industries = [
  ['Aviation', 'Complex operations. High standards.', 'plane'],
  ['Professional Services', 'Knowledge-driven. Client-focused.', 'briefcase'],
  ['Financial Services', 'Regulated. Secure. Data-intensive.', 'bank'],
  ['Logistics', 'Real-time operations. End-to-end visibility.', 'truck'],
  ['Enterprise Software', 'Building better software. Faster and smarter.', 'grid'],
];

function Icon({ name, size = 24 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/><path d="M11 8v6M8 11h6"/></>,
    layers: <><path d="m12 3 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/></>,
    bot: <><rect x="4" y="6" width="16" height="12" rx="3"/><path d="M8 11h.01M16 11h.01"/><path d="M9 15h6M12 6V3"/><path d="M2 10v4M22 10v4"/></>,
    document: <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h4M10 12h5M10 16h5"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/><circle cx="7" cy="15" r="1"/><circle cx="11" cy="11" r="1"/><circle cx="14" cy="13" r="1"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    plane: <><path d="m3 14 18-7-5 14-4-7-9-0Z"/><path d="m12 14 1-8"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18M10 12v3h4v-3"/></>,
    bank: <><path d="M3 10h18L12 4 3 10Z"/><path d="M5 11v7M9 11v7M15 11v7M19 11v7M3 20h18"/></>,
    truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Logo({ footer = false }) {
  return (
    <a className={`brand ${footer ? 'brand--footer' : ''}`} href="#top" aria-label="Aivanta home">
      <img src="/logo.svg" alt="Aivanta" />
    </a>
  );
}

export default function App() {
  return (
    <div id="top">
      <header className="site-header">
        <div className="container nav-wrap">
          <Logo />
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#industries">Industries</a>
            <a href="#about">About</a>
          </nav>
          <a className="header-cta" href="mailto:hello@aivanta.ai">Start a conversation <Icon name="arrow" size={17} /></a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow eyebrow--light">AI SOFTWARE CONSULTANCY</p>
              <h1>Turn software into <span>intelligent software.</span></h1>
              <p className="hero-subcopy">Aivanta helps businesses integrate AI into the applications, data, documents, and workflows they already rely on.</p>
              <div className="hero-actions">
                <a className="button button--primary" href="#services">Explore AI transformation <Icon name="arrow" size={18} /></a>
                <a className="button button--ghost" href="#approach">See how it works <span className="play">▶</span></a>
              </div>
            </div>

            <div className="hero-diagram" aria-label="Existing software to intelligent workflows">
              <div className="flow-card flow-card--dark">
                <div className="flow-card-title">Existing Software</div>
                {['Applications', 'Data', 'Documents', 'Workflows'].map((x) => <div className="flow-row" key={x}><span className="mini-box" />{x}</div>)}
              </div>
              <div className="flow-arrow">›</div>
              <div className="flow-card flow-card--ai">
                <div className="flow-card-title">AI Layer</div>
                <div className="ai-orb"><Icon name="bot" size={42} /></div>
                {['AI Assistant', 'Knowledge', 'Agents', 'Models'].map((x) => <div className="flow-row" key={x}><span className="spark-dot" />{x}</div>)}
              </div>
              <div className="flow-arrow">›</div>
              <div className="flow-card flow-card--dark">
                <div className="flow-card-title">Intelligent Workflows</div>
                {['Insights', 'Automation', 'Decisions', 'Outcomes'].map((x) => <div className="flow-row" key={x}><span className="mini-check"><Icon name="check" size={12} /></span>{x}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="opportunity">
          <div className="container opportunity-inner">
            <div className="opportunity-copy">
              <div className="round-icon"><Icon name="grid" size={27} /></div>
              <div><h2>Most companies already have powerful software and data.</h2><p>The opportunity isn't to replace what works. It's to make it intelligent.</p></div>
            </div>
            <div className="simple-transform">
              {['Existing Software', 'AI Layer', 'Intelligent Application'].map((x, i) => <React.Fragment key={x}><div className={`simple-step ${i === 1 ? 'simple-step--accent' : ''}`}><div className="round-icon round-icon--small"><Icon name={i === 0 ? 'layers' : i === 1 ? 'bot' : 'chart'} size={26} /></div><strong>{x}</strong></div>{i < 2 && <span className="simple-arrow">→</span>}</React.Fragment>)}
            </div>
          </div>
        </section>

        <section id="services" className="section section--services">
          <div className="container">
            <div className="section-heading centered"><p className="eyebrow">WHAT WE DO</p><h2>End-to-end AI transformation services.</h2></div>
            <div className="service-grid">
              {services.map((service) => <article className="service-card" key={service.number}><div className="service-icon"><Icon name={service.icon} size={28} /></div><div className="service-number">{service.number}</div><h3>{service.title}</h3><p>{service.body}</p></article>)}
            </div>
          </div>
        </section>

        <section id="approach" className="section section--approach">
          <div className="container">
            <div className="section-heading centered"><p className="eyebrow">HOW AIVANTA WORKS</p></div>
            <div className="process-grid">
              {process.map(([num, title, text], index) => <div className="process-item" key={num}><div className="process-top"><span>{num}</span>{index < process.length - 1 && <i />}</div><h3>{title}</h3><p>{text}</p></div>)}
            </div>
          </div>
        </section>

        <section id="about" className="section transformation">
          <div className="container transformation-inner">
            <div className="transform-copy"><p className="eyebrow">THE TRANSFORMATION</p><h2>From traditional applications to intelligent applications.</h2><p>We don't replace what you have. We enhance it with intelligence where it matters most.</p><a className="button button--primary" href="#contact">Explore the transformation <Icon name="arrow" size={18} /></a></div>
            <div className="compare-wrap">
              <div className="compare-card"><h3>Traditional Application</h3>{['User Interface', 'APIs', 'Business Logic', 'Database', 'Documents'].map(x => <div key={x}><Icon name="layers" size={15}/>{x}</div>)}</div>
              <div className="compare-arrow">→</div>
              <div className="compare-card compare-card--ai"><h3>AI-Enabled Application</h3>{['User Interface', 'APIs', 'Business Logic', 'Database', 'Documents', 'AI Assistant', 'Knowledge Retrieval', 'Agentic Workflows', 'Decision Support'].map((x, i) => <div key={x}><Icon name={i >= 5 ? 'bot' : 'layers'} size={15}/>{x}</div>)}</div>
            </div>
          </div>
        </section>

        <section id="industries" className="section industries">
          <div className="container"><div className="section-heading centered"><p className="eyebrow">INDUSTRIES WE SERVE</p></div><div className="industry-grid">{industries.map(([title, text, icon]) => <article key={title}><div className="industry-icon"><Icon name={icon} size={24}/></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div>
        </section>

        <section className="section why">
          <div className="container"><div className="why-heading"><h2>Why Aivanta</h2></div><div className="why-grid">{[
            ['Works with what you already have', 'We build on your existing systems and investments.'],
            ['Domain-aware', 'AI that understands your business context and data.'],
            ['Responsible by design', 'Human oversight, security and privacy are built in.'],
            ['Workflow-focused', 'We optimize for useful work, not just impressive demos.'],
            ['Engineering-led', 'Practical, scalable solutions built by engineers.'],
          ].map(([title, text]) => <article key={title}><div className="why-icon"><Icon name="check" size={18}/></div><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section id="contact" className="cta-section">
          <div className="container"><div className="cta-panel"><div className="cta-mark"><img src="/logo-mark.svg" alt="" /></div><div><h2>Your software already works.<br/>Let's make it intelligent.</h2><p>Start with one workflow, one application, or one problem worth solving.</p></div><a className="button button--primary button--cta" href="mailto:hello@aivanta.ai">Start a conversation <Icon name="arrow" size={18} /></a></div></div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand"><Logo footer /><p>AI software consultancy helping businesses turn existing software into intelligent applications.</p><div className="socials"><a href="https://github.com/timothynn/Aivanta" aria-label="GitHub">GH</a><a href="https://www.linkedin.com/" aria-label="LinkedIn">in</a></div></div>
          <div><h4>Services</h4><a href="#services">AI Application Assessment</a><a href="#services">AI Integration</a><a href="#services">Agentic Workflows</a><a href="#services">Document & Knowledge Intelligence</a><a href="#services">AI Modernization</a></div>
          <div><h4>Approach</h4><a href="#approach">How We Work</a><a href="#approach">AI Strategy</a><a href="#approach">Technology</a><a href="#approach">Responsible AI</a></div>
          <div><h4>Industries</h4><a href="#industries">Aviation</a><a href="#industries">Professional Services</a><a href="#industries">Financial Services</a><a href="#industries">Logistics</a><a href="#industries">Enterprise Software</a></div>
          <div><h4>Company</h4><a href="#about">About Aivanta</a><a href="mailto:hello@aivanta.ai">Contact</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Aivanta. All rights reserved.</span><div><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div>
      </footer>
    </div>
  );
}
