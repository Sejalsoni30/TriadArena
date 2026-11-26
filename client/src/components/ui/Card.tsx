import React, { HTMLAttributes, forwardRef, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { sound } from '../../lib/sound';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'primary' | 'cyan' | 'purple' | 'magenta';
  interactive?: boolean;
  spotlight?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = 'none', interactive = false, spotlight = true, onMouseEnter, children, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

    const glowClasses = {
      none: '',
      primary: 'shadow-glow-primary border-primary/40',
      cyan: 'shadow-glow-cyan border-accent-cyan/40',
      purple: 'shadow-glow-purple border-secondary/40',
      magenta: 'shadow-glow-magenta border-accent-magenta/40'
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!spotlight || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        opacity: 1
      });
    };

    const handleMouseLeave = () => {
      setMousePos((prev) => ({ ...prev, opacity: 0 }));
    };

    const handleMouseEnterCard = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        sound.playHover();
      }
      onMouseEnter?.(e);
    };

    return (
      <div
        ref={(el) => {
          cardRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as any).current = el;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnterCard}
        className={cn(
          'relative overflow-hidden glass-card rounded-2xl p-6 text-gray-100 transition-all duration-300',
          interactive && 'glass-card-interactive cursor-pointer hover:-translate-y-1 hover:border-accent-cyan/60 hover:shadow-glow-cyan',
          glowClasses[glow],
          className
        )}
        {...props}
      >
        {/* Cursor-following spotlight glow */}
        {spotlight && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
            style={{
              opacity: mousePos.opacity,
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.08), transparent 80%)`
            }}
          />
        )}

        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';
