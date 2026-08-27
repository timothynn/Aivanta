type LogoProps = {
  variant?: 'light' | 'dark';
  markOnly?: boolean;
  className?: string;
};

export function Logo({ variant = 'light', markOnly = false, className = '' }: LogoProps) {
  const src = markOnly ? '/logo-mark.svg' : variant === 'dark' ? '/logo-dark.svg' : '/logo-light.svg';
  const label = markOnly ? 'Aivanta mark' : 'Aivanta home';

  return (
    <a className={`brand ${className}`} href="#top" aria-label={label}>
      <img src={src} alt={markOnly ? '' : 'Aivanta'} />
    </a>
  );
}
