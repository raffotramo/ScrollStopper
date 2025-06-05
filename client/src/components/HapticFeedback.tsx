import React, { useEffect, useRef } from 'react';

interface HapticFeedbackProps {
  intensity?: 'light' | 'medium' | 'heavy';
  pattern?: number[];
  trigger?: boolean;
  onComplete?: () => void;
}

const HapticFeedback: React.FC<HapticFeedbackProps> = ({
  intensity = 'medium',
  pattern = [200],
  trigger = false,
  onComplete
}) => {
  const hasVibratedRef = useRef(false);

  useEffect(() => {
    if (!trigger || hasVibratedRef.current) return;

    const vibrate = () => {
      if ('vibrate' in navigator) {
        let vibrationPattern: number[];
        
        switch (intensity) {
          case 'light':
            vibrationPattern = pattern.map(p => Math.min(p, 100));
            break;
          case 'heavy':
            vibrationPattern = pattern.map(p => Math.max(p, 300));
            break;
          default:
            vibrationPattern = pattern;
        }
        
        navigator.vibrate(vibrationPattern);
        hasVibratedRef.current = true;
        
        setTimeout(() => {
          hasVibratedRef.current = false;
          onComplete?.();
        }, vibrationPattern.reduce((sum, p) => sum + p, 0));
      } else {
        // Fallback for devices without vibration
        onComplete?.();
      }
    };

    vibrate();
  }, [trigger, intensity, pattern, onComplete]);

  return null; // This component doesn't render anything visual
};

export default HapticFeedback;