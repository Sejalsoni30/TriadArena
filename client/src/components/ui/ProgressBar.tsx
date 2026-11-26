import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  variant?: 'primary' | 'cyan' | 'magenta' | 'gold';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  variant = 'cyan',
  className
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variants = {
    primary: 'bg-primary shadow-glow-primary',
    cyan: 'bg-gradient-to-r from-primary to-accent-cyan shadow-glow-cyan',
    magenta: 'bg-gradient-to-r from-secondary to-accent-magenta shadow-glow-magenta',
    gold: 'bg-gradient-to-r from-amber-500 to-yellow-300 shadow-md'
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || sublabel) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-gray-300 font-semibold uppercase">{label}</span>}
          {sublabel && <span className="text-gray-400">{sublabel}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-2.5 bg-background-deep rounded-full overflow-hidden border border-gray-800 p-0.5"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
