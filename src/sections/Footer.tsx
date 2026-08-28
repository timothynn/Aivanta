import { Logo } from '../components/Logo';

const footerGroups = [
  ['Services', ['AI Application Assessment', 'AI Integration', 'Agentic Workflows', 'Document Intelligence', 'AI Modernization']],
  ['Approach', ['How We Work', 'AI Strategy', 'Technology', 'Responsible AI']],
  ['Proof', ['Demo Work', 'Measurement', 'Integration', 'Responsible AI']],
  ['Industries', ['Aviation', 'Professional Services', 'Financial Services', 'Logistics', 'Enterprise Software']],
] as const;

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo className="brand--footer" />
          <p>AI software consultancy helping businesses turn existing software into intelligent applications.</p>
          <div className="socials">
            <a href="https://github.com/timothynn/Aivanta" rel="noreferrer" target="_blank">GitHub</a>
            <a href="https://www.linkedin.com/" rel="noreferrer" target="_blank">LinkedIn</a>
          </div>
        </div>
        {footerGroups.map(([title, links]) => (
          <div key={title}>
            <h4>{title}</h4>
            {links.map((label) => (
              <a href={title === 'Industries' ? '#industries' : title === 'Proof' ? '#proof' : title === 'Approach' ? '#approach' : '#services'} key={label}>
                {label}
              </a>
            ))}
          </div>
        ))}
        <div>
          <h4>Company</h4>
          <a href="#about">About Aivanta</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#ai-use">AI use</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Aivanta. All rights reserved.</span>
        <div>
          <a href="#privacy">Privacy</a>
          <a href="#ai-use">AI use</a>
        </div>
      </div>
    </footer>
  );
}
