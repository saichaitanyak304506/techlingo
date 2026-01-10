import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Lightbulb, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeBlock from '@/components/game/CodeBlock';
import { cn } from '@/lib/utils';

const difficultyColors = {
  beginner: 'bg-correct/10 text-correct border-correct/30',
  intermediate: 'bg-xp/10 text-xp-foreground border-xp/30',
  advanced: 'bg-streak/10 text-streak border-streak/30',
};

const TermCard = ({ term }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="game-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-extrabold text-foreground mb-1">{term.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
              <Tag className="h-3 w-3" />
              {term.category}
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold border",
              difficultyColors[term.difficulty]
            )}>
              {term.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Definition */}
      <p className="text-muted-foreground leading-relaxed mb-4">
        {term.definition}
      </p>

      {/* Expandable Content */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          {isExpanded ? 'Hide Examples' : 'Show Examples'}
        </span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
          {/* Code Example */}
          {term.code_example && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Code Example</span>
              </div>
              <CodeBlock code={term.code_example} />
            </div>
          )}

          {/* Real World Example */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-xp" />
              <span className="text-sm font-semibold text-foreground">Real-World Example</span>
            </div>
            <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
              {term.real_world_example}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermCard;
