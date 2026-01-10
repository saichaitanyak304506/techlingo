import React from 'react';
import { 
  Globe, 
  Database, 
  Lock, 
  Server, 
  Layers, 
  GitBranch,
  Cloud,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryIcons = {
  'Web Development': <Globe className="h-6 w-6" />,
  'Database': <Database className="h-6 w-6" />,
  'Security': <Lock className="h-6 w-6" />,
  'Backend': <Server className="h-6 w-6" />,
  'Architecture': <Layers className="h-6 w-6" />,
  'DevOps': <GitBranch className="h-6 w-6" />,
  'Cloud': <Cloud className="h-6 w-6" />,
  'General': <Terminal className="h-6 w-6" />,
};

const categoryColors = {
  'Web Development': 'from-primary to-primary/70',
  'Database': 'from-streak to-streak/70',
  'Security': 'from-destructive to-destructive/70',
  'Backend': 'from-secondary-foreground to-secondary-foreground/70',
  'Architecture': 'from-xp to-xp/70',
  'DevOps': 'from-correct to-correct/70',
  'Cloud': 'from-ring to-ring/70',
  'General': 'from-muted-foreground to-muted-foreground/70',
};

const CategoryCard = ({ name, termCount, onClick, isSelected }) => {
  const icon = categoryIcons[name] || <Terminal className="h-6 w-6" />;
  const gradient = categoryColors[name] || 'from-primary to-primary/70';

  return (
    <button
      onClick={onClick}
      className={cn(
        "game-card text-left transition-all duration-200 cursor-pointer w-full",
        "hover:scale-[1.02] hover:shadow-xl",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        "bg-gradient-to-br text-primary-foreground",
        gradient
      )}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">
        {termCount} {termCount === 1 ? 'term' : 'terms'}
      </p>
    </button>
  );
};

export default CategoryCard;
