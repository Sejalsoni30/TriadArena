import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'primary' | 'cyan' | 'purple' | 'magenta';
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = 'none', interactive = false, children, ...props }, ref) => {
    const glowClasses = {
      none: '',
      primary: 'shadow-glow-primary border-primary/40',
      cyan: 'shadow-glow-cyan border-accent-cyan/40',
      purple: 'shadow-glow-purple border-secondary/40',
      magenta: 'shadow-glow-magenta border-accent-magenta/40'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'glass-card rounded-xl p-5 text-gray-100',
          interactive && 'glass-card-interactive cursor-pointer',
          glowClasses[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
