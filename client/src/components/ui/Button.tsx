import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-display font-semibold tracking-wider transition-all duration-200 rounded-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

    const variants = {
      primary: 'bg-primary hover:bg-primary-glow text-white shadow-glow-primary border border-primary-light/30 hover:border-primary-light',
      secondary: 'bg-secondary hover:bg-secondary-glow text-white shadow-glow-purple border border-secondary-glow/30',
      accent: 'bg-gradient-to-r from-accent-cyan via-primary to-accent-magenta text-black font-bold hover:opacity-95 shadow-glow-cyan',
      outline: 'bg-transparent border border-gray-600 text-gray-200 hover:border-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/10',
      ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/10',
      danger: 'bg-semantic-danger text-white hover:bg-red-600 shadow-md border border-red-400/30'
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-5 py-2.5 h-11 gap-2',
      lg: 'text-base px-7 py-3.5 h-14 gap-2.5',
      icon: 'h-10 w-10 p-0'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
