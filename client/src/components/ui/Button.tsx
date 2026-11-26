import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { sound } from '../../lib/sound';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, onClick, onMouseEnter, ...props }, ref) => {
    const baseStyles = 'relative group overflow-hidden inline-flex items-center justify-center font-display font-semibold tracking-wider transition-all duration-200 rounded-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer';

    const variants = {
      primary: 'bg-primary hover:bg-blue-500 text-white shadow-glow-primary border border-primary-light/30 hover:border-primary-light hover:shadow-lg',
      secondary: 'bg-secondary hover:bg-purple-500 text-white shadow-glow-purple border border-secondary/40',
      accent: 'bg-gradient-to-r from-accent-cyan via-primary to-accent-pink text-[#070A1A] font-black hover:brightness-110 shadow-glow-cyan hover:shadow-glow-cyan',
      outline: 'bg-transparent border border-border-glass text-text-primary hover:border-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-glow-cyan',
      ghost: 'bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5',
      danger: 'bg-semantic-loss text-white hover:bg-red-500 shadow-md border border-semantic-loss/40'
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-5 py-2.5 h-11 gap-2',
      lg: 'text-base px-8 py-3.5 h-13 gap-2.5',
      icon: 'h-10 w-10 p-0'
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      sound.playClick();
      onClick?.(e);
    };

    const handleMouseEnterBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
      sound.playHover();
      onMouseEnter?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        onMouseEnter={handleMouseEnterBtn}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Subtle shine highlight */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
