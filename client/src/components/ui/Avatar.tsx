import React from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rankBorderColor?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  rankBorderColor,
  className
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  };

  const borderStyle = rankBorderColor ? { borderColor: rankBorderColor } : undefined;

  return (
    <div
      style={borderStyle}
      className={cn(
        'relative rounded-full flex items-center justify-center font-display font-bold shrink-0 bg-gradient-to-tr from-gray-800 to-gray-700 border-2 border-gray-600 text-white overflow-hidden shadow-md select-none',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : name ? (
        <span>{name.substring(0, 2).toUpperCase()}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
};
