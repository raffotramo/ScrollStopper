import React from 'react';

interface ProgressCircleProps {
  currentDay: number;
  totalDays: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  currentDay,
  totalDays,
  size = 160,
  strokeWidth = 12,
  className = '',
}) => {
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = radius * 2 * Math.PI;
  const progress = currentDay / totalDays;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`relative w-${size / 4} h-${size / 4} ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <circle
          className="circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-primary">{currentDay}</span>
        <span className="text-sm text-neutral-500">di {totalDays} giorni</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
