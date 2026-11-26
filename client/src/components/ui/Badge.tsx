import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'cyan' | 'magenta' | 'purple' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary/20 text-primary-light border-primary/40',
    cyan: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40',
    magenta: 'bg-accent-magenta/15 text-accent-magenta border-accent-magenta/40',
    purple: 'bg-secondary/20 text-secondary-glow border-secondary/40',
    success: 'bg-semantic-success/20 text-emerald-400 border-semantic-success/40',
    warning: 'bg-semantic-warning/20 text-amber-300 border-semantic-warning/40',
    danger: 'bg-semantic-danger/20 text-rose-400 border-semantic-danger/40',
    neutral: 'bg-gray-800/80 text-gray-300 border-gray-700'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium rounded-full border uppercase select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
