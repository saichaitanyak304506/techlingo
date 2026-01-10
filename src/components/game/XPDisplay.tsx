import React from 'react';
import { Trophy, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPDisplayProps {
  xp: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const XPDisplay: React.FC<XPDisplayProps> = ({ xp, animate = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1 gap-1',
    md: 'text-base px-3 py-1.5 gap-2',
    lg: 'text-xl px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full font-bold",
        "bg-xp text-xp-foreground",
        sizeClasses[size],
        animate && "animate-bounce-subtle"
      )}
    >
      <Trophy className={iconSizes[size]} />
      <span>+{xp} XP</span>
      {animate && (
        <>
          <Zap className={cn(iconSizes[size], "animate-pulse")} />
          <Star className={cn(iconSizes[size], "animate-spin")} />
        </>
      )}
    </div>
  );
};

export default XPDisplay;
