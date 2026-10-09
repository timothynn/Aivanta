import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';

const navItems = [
  ['Solutions', '#services'],
  ['How it works', '#demo'],
  ['Engagements', '#engagement'],
  ['Expertise', '#industries'],
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-wrap">
      <Logo />
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
      </nav>
      <a className="header-cta" href="#contact">Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(open => !open)}>
        {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
    </div>
    {menuOpen && <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
      {navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      <a href="#contact" onClick={() => setMenuOpen(false)}>Discuss a project</a>
    </nav>}
  </header>;
}
