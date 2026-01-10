import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const optionLabels = ['A', 'B', 'C', 'D'];

const OptionButton = ({
  option,
  index,
  selected,
  showResult,
  isCorrect,
  isCorrectAnswer,
  onClick,
  disabled,
}) => {
  const getVariant = () => {
    if (!showResult) {
      return selected ? 'optionSelected' : 'option';
    }
    if (isCorrectAnswer) return 'optionCorrect';
    if (selected && !isCorrect) return 'optionIncorrect';
    return 'option';
  };

  return (
    <Button
      variant={getVariant()}
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full justify-start text-left h-auto py-4 px-5",
        showResult && isCorrectAnswer && "animate-celebrate",
        showResult && selected && !isCorrect && "animate-shake"
      )}
    >
      <div className="flex items-center gap-4 w-full">
        <span className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          showResult && isCorrectAnswer && "bg-correct text-correct-foreground",
          showResult && selected && !isCorrect && "bg-incorrect text-incorrect-foreground"
        )}>
          {showResult && isCorrectAnswer ? (
            <Check className="h-4 w-4" />
          ) : showResult && selected && !isCorrect ? (
            <X className="h-4 w-4" />
          ) : (
            optionLabels[index]
          )}
        </span>
        <span className="flex-1 font-semibold">{option}</span>
      </div>
    </Button>
  );
};

export default OptionButton;
