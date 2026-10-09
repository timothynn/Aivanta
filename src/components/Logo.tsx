type LogoProps = { variant?: 'light' | 'dark'; markOnly?: boolean; className?: string };

export function Logo({ variant = 'light', markOnly = false, className = '' }: LogoProps) {
  return <a className={`brand ${className}`} href="#top" aria-label="Veyntis home">
    <img className="brand-mark" src="/logo-mark.svg" alt="" width="42" height="42" />
    {markOnly ? null : <span className={`brand-wordmark brand-wordmark--${variant}`} aria-hidden="true">VEYNTIS</span>}
  </a>;
}
