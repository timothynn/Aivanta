import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';

const navItems = [
  ['Services', '#services'],
  ['Assessment', '#assessment'],
  ['Labs', '#labs'],
  ['Proof', '#proof'],
  ['Industries', '#industries'],
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Logo />
        <nav className="nav-links" aria-label="Primary navigation">{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
        <a className="header-cta" href="#engagement">See engagement paths <Icon name="arrow" size={17} /></a>
        <button aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="menu-toggle" onClick={() => setMenuOpen((current) => !current)} type="button">{menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}</button>
      </div>
      {menuOpen ? <nav className="mobile-menu" aria-label="Mobile navigation">{navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav> : null}
    </header>
  );
}
