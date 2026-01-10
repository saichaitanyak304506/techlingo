import React from 'react';

const ProgressBar = ({ current, total, showLabel = true }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Question {current} of {total}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
