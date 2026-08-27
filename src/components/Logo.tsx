type LogoProps = {
  variant?: 'light' | 'dark';
  markOnly?: boolean;
  className?: string;
};

export function Logo({ variant = 'light', markOnly = false, className = '' }: LogoProps) {
  const src = markOnly ? '/logo-mark.svg' : variant === 'dark' ? '/logo-dark.svg' : '/logo-light.svg';
  const label = markOnly ? 'Aivanta mark' : 'Aivanta home';
  const isFooter = className.includes('brand--footer');
  const width = isFooter ? 176 : 188;

  return (
    <a
      className={`brand ${className}`}
      href="#top"
      aria-label={label}
      style={{ flex: `0 0 ${width}px`, width: `${width}px`, minWidth: `${width}px` }}
    >
      <img src={src} alt={markOnly ? '' : 'Aivanta'} />
    </a>
  );
}
