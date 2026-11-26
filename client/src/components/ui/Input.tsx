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
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-background-deep/80 border border-gray-700/80 rounded-lg px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors',
              'focus:border-accent-cyan focus:bg-background-deep focus:outline-none focus:ring-1 focus:ring-accent-cyan/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-semantic-danger font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
