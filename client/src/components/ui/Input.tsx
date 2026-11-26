import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-background-elevated/90 border border-border-glass rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-subtle transition-colors',
              'focus:border-accent-cyan focus:bg-background-elevated focus:outline-none focus:ring-1 focus:ring-accent-cyan/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error && 'border-semantic-loss focus:border-semantic-loss focus:ring-semantic-loss/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-semantic-loss font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
