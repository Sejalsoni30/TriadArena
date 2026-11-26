import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'cyan' | 'pink' | 'magenta' | 'purple' | 'win' | 'loss' | 'draw' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
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
    pink: 'bg-accent-pink/15 text-accent-pink border-accent-pink/40',
    magenta: 'bg-accent-pink/15 text-accent-pink border-accent-pink/40',
    purple: 'bg-secondary/20 text-secondary border-secondary/40',
    win: 'bg-semantic-win/20 text-semantic-win border-semantic-win/40',
    loss: 'bg-semantic-loss/20 text-semantic-loss border-semantic-loss/40',
    draw: 'bg-semantic-draw/20 text-semantic-draw border-semantic-draw/40',
    info: 'bg-semantic-info/20 text-semantic-info border-semantic-info/40',
    success: 'bg-semantic-win/20 text-semantic-win border-semantic-win/40',
    warning: 'bg-semantic-draw/20 text-semantic-draw border-semantic-draw/40',
    danger: 'bg-semantic-loss/20 text-semantic-loss border-semantic-loss/40',
    neutral: 'bg-background-elevated text-text-muted border-border-glass'
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
