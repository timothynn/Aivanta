import { ArrowRight } from 'lucide-react';
import { iconMap, type IconName } from '../data/siteContent';

type IconProps = {
  name: IconName | 'arrow';
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: IconProps) {
  const Component = name === 'arrow' ? ArrowRight : iconMap[name];
  return <Component aria-hidden="true" className={className} size={size} strokeWidth={1.8} />;
}
