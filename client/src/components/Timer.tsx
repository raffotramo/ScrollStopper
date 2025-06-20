import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerProps {
  timeRequired: number; // in minutes
  onComplete?: (timeSpent: number) => void; // timeSpent in minutes
  variant?: 'default' | 'emergency';
}

const Timer: React.FC<TimerProps> = ({ timeRequired, onComplete, variant = 'default' }) => {
  const [timeLeft, setTimeLeft] = useState(timeRequired * 60); // convert to seconds
  const [isRunning, setIsRunning] = useState(true); // Start automatically
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // Calculate time actually spent (in minutes)
            const timeSpentMinutes = Math.ceil((timeRequired * 60 - prevTime + 1) / 60);
            if (onComplete) onComplete(timeSpentMinutes);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete, timeRequired]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(timeRequired * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((timeRequired * 60 - timeLeft) / (timeRequired * 60)) * 100;

  const getStyles = () => {
    if (variant === 'emergency') {
      return {
        backgroundCircle: 'text-gray-400',
        progressCircle: 'text-orange-500',
        textColor: 'text-black',
        buttonStyle: 'border-gray-700 text-gray-700 hover:border-orange-500 hover:bg-orange-50',
        iconProps: { fill: "none", stroke: "black", strokeWidth: "2" }
      };
    }
    // default variant
    return {
      backgroundCircle: 'text-gray-500',
      progressCircle: 'text-white',
      textColor: 'text-white',
      buttonStyle: 'hover:bg-white/20',
      iconProps: { fill: "none", stroke: "white", strokeWidth: "2" }
    };
  };

  const styles = getStyles();

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Mini Timer Display */}
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className={styles.backgroundCircle}
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={87.96}
              strokeDashoffset={87.96 - (progress / 100) * 87.96}
              className={`${styles.progressCircle} transition-all duration-300`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className={`text-base font-bold ${styles.textColor}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Status */}
      {isCompleted && (
        <span className="text-xs text-green-600">✓ Fatto!</span>
      )}

      {/* Compact Controls */}
      <div className="flex gap-1">
        <Button
          onClick={handlePlayPause}
          variant={variant === 'emergency' ? 'outline' : 'ghost'}
          size="sm"
          className={`h-7 w-7 p-0 ${variant === 'emergency' ? styles.buttonStyle : styles.buttonStyle}`}
        >
          {isRunning ? 
            <Pause className="w-3 h-3" {...styles.iconProps} /> : 
            <Play className="w-3 h-3" {...styles.iconProps} />
          }
        </Button>
        
        <Button 
          onClick={handleReset} 
          variant={variant === 'emergency' ? 'outline' : 'ghost'}
          size="sm" 
          className={`h-7 w-7 p-0 ${variant === 'emergency' ? styles.buttonStyle : styles.buttonStyle}`}
        >
          <RotateCcw className="w-3 h-3" {...styles.iconProps} />
        </Button>
      </div>
    </div>
  );
};

export default Timer;