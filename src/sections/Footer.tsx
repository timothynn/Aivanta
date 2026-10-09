import { ArrowUpRight } from 'lucide-react';
import { Logo } from '../components/Logo';

export function Footer() {
  return <footer className="footer">
    <div className="container vy-footer-top">
      <div><Logo className="brand--footer" /><p>Intelligence, engineered into your operations.</p></div>
      <div className="vy-footer-links">
        <a href="#services">Solutions</a><a href="#demo">How it works</a><a href="#engagement">Engagements</a>
        <a href="#contact">Contact <ArrowUpRight size={13} /></a>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© {new Date().getFullYear()} Veyntis. Applied AI &amp; Systems Engineering.</span>
      <div><a href="#privacy">Privacy</a><a href="#ai-use">AI use</a><a href="/status">Service status</a><a href="https://github.com/timothynn" rel="noreferrer" target="_blank">Engineering profile ↗</a></div>
    </div>
  </footer>;
}
