import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerProps {
  timeRequired: number; // in minutes
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeRequired, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(timeRequired * 60); // convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
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
  }, [isRunning, timeLeft, onComplete]);

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

  return (
    <div className="text-center">
      {/* Compact Circular Progress */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={339.292}
            strokeDashoffset={339.292 - (progress / 100) * 339.292}
            className="text-primary transition-all duration-300 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-card-foreground">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Status */}
      {isCompleted && (
        <div className="mb-3 p-2 bg-green-100 text-green-800 rounded-lg text-sm">
          Attività completata! 🎉
        </div>
      )}

      {/* Compact Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handlePlayPause}
          className="flex items-center gap-1 px-3 py-2"
          variant={isRunning ? "secondary" : "default"}
          size="sm"
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isRunning ? 'Pausa' : 'Inizia'}
        </Button>
        
        <Button onClick={handleReset} variant="outline" size="sm" className="flex items-center gap-1 px-3 py-2">
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Timer;