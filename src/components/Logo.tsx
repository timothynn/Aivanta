type LogoProps = {
  variant?: 'light' | 'dark';
  markOnly?: boolean;
  className?: string;
};

export function Logo({ variant = 'light', markOnly = false, className = '' }: LogoProps) {
  const label = markOnly ? 'Aivanta mark' : 'Aivanta home';

  return (
    <a className={`brand ${className}`} href="#top" aria-label={label}>
      <img className="brand-mark" src="/logo-mark.svg" alt="" />
      {markOnly ? null : (
        <span className={`brand-wordmark brand-wordmark--${variant}`} aria-hidden="true">
          AIVANTA
        </span>
      )}
    </a>
  );
}
