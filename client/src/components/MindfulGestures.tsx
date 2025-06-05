import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Heart, Zap, Sun, Pause } from 'lucide-react';

interface MindfulGesturesProps {
  onGestureComplete: (gesture: string) => void;
  className?: string;
}

type GestureType = 'breathe' | 'pause' | 'reflect' | 'reset';

interface Gesture {
  id: GestureType;
  icon: React.ComponentType<any>;
  title: string;
  instruction: string;
  pattern: number[];
  color: string;
  bgColor: string;
}

const gestures: Gesture[] = [
  {
    id: 'breathe',
    icon: Heart,
    title: 'Respira',
    instruction: 'Tieni premuto e respira profondamente',
    pattern: [4, 4, 4], // inhale, hold, exhale
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'pause',
    icon: Pause,
    title: 'Pausa',
    instruction: 'Ferma tutto per 10 secondi',
    pattern: [10],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'reflect',
    icon: Sun,
    title: 'Rifletti',
    instruction: 'Chiediti: "Cosa sto cercando?"',
    pattern: [8],
    color: 'text-muted-foreground',
    bgColor: 'bg-muted'
  },
  {
    id: 'reset',
    icon: Zap,
    title: 'Reset',
    instruction: 'Scuoti il dispositivo per resettare',
    pattern: [3],
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

const MindfulGestures: React.FC<MindfulGesturesProps> = ({ onGestureComplete, className = '' }) => {
  const [activeGesture, setActiveGesture] = useState<GestureType | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [shakeDetected, setShakeDetected] = useState(false);

  // Handle shake detection for reset gesture
  useEffect(() => {
    const handleShake = (event: DeviceMotionEvent) => {
      if (!activeGesture || activeGesture !== 'reset') return;
      
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        const totalAcceleration = Math.abs(acceleration.x || 0) + 
                                 Math.abs(acceleration.y || 0) + 
                                 Math.abs(acceleration.z || 0);
        
        if (totalAcceleration > 20) {
          setShakeDetected(true);
          completeGesture('reset');
        }
      }
    };

    if (activeGesture === 'reset') {
      window.addEventListener('devicemotion', handleShake);
    }

    return () => {
      window.removeEventListener('devicemotion', handleShake);
    };
  }, [activeGesture]);

  // Handle breathing animation
  useEffect(() => {
    if (activeGesture !== 'breathe' || !isPressed) return;

    const breathingCycle = gestures.find(g => g.id === 'breathe')!.pattern;
    let phaseIndex = 0;
    let currentTime = 0;
    
    const interval = setInterval(() => {
      currentTime += 0.1;
      const currentPhaseTime = breathingCycle[phaseIndex];
      const phaseProgress = (currentTime / currentPhaseTime) * 100;
      
      if (phaseProgress >= 100) {
        phaseIndex = (phaseIndex + 1) % 3;
        currentTime = 0;
        setBreathePhase(phaseIndex === 0 ? 'inhale' : phaseIndex === 1 ? 'hold' : 'exhale');
      }
      
      setProgress(phaseProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [activeGesture, isPressed]);

  // Handle other gesture timers
  useEffect(() => {
    if (!activeGesture || activeGesture === 'breathe' || activeGesture === 'reset') return;
    if (!isPressed) return;

    const gesture = gestures.find(g => g.id === activeGesture)!;
    const duration = gesture.pattern[0] * 1000;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setProgress(progress);
      
      if (progress >= 100) {
        completeGesture(activeGesture);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [activeGesture, isPressed]);

  const startGesture = (gestureId: GestureType) => {
    setActiveGesture(gestureId);
    setProgress(0);
    setIsPressed(true);
    setBreathePhase('inhale');
    setShakeDetected(false);
  };

  const stopGesture = () => {
    setIsPressed(false);
    setProgress(0);
  };

  const completeGesture = (gestureId: GestureType) => {
    onGestureComplete(gestureId);
    setActiveGesture(null);
    setIsPressed(false);
    setProgress(0);
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (activeGesture === 'reset' && Math.abs(info.velocity.x) > 500) {
      setShakeDetected(true);
      completeGesture('reset');
    }
  };

  if (activeGesture) {
    const gesture = gestures.find(g => g.id === activeGesture)!;
    const Icon = gesture.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}
      >
        <motion.div
          className={`${gesture.bgColor} rounded-3xl p-8 max-w-sm mx-4 text-center relative overflow-hidden`}
          onPanEnd={handlePanEnd}
          drag={activeGesture === 'reset'}
        >
          {/* Progress background */}
          <motion.div
            className="absolute inset-0 bg-white/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.1 }}
          />
          
          <div className="relative z-10">
            <motion.div
              animate={{
                scale: activeGesture === 'breathe' 
                  ? breathePhase === 'inhale' ? 1.2 
                    : breathePhase === 'hold' ? 1.2 
                    : 1.0
                  : shakeDetected ? [1, 1.3, 1] 
                  : 1,
                rotate: activeGesture === 'reset' ? [0, 10, -10, 0] : 0
              }}
              transition={{ 
                duration: activeGesture === 'breathe' ? 4 : 0.5,
                ease: "easeInOut"
              }}
              className="mb-6"
            >
              <Icon className={`w-16 h-16 mx-auto ${gesture.color}`} />
            </motion.div>
            
            <h3 className={`text-2xl font-bold mb-2 ${gesture.color}`}>
              {gesture.title}
            </h3>
            
            <p className="text-gray-700 mb-4">
              {gesture.instruction}
            </p>
            
            {activeGesture === 'breathe' && (
              <p className={`text-lg font-medium ${gesture.color} mb-4`}>
                {breathePhase === 'inhale' ? 'Inspira...' : 
                 breathePhase === 'hold' ? 'Trattieni...' : 'Espira...'}
              </p>
            )}
            
            {activeGesture !== 'reset' && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    activeGesture === 'breathe' ? 'from-blue-400 to-blue-600' :
                    activeGesture === 'pause' ? 'from-purple-400 to-purple-600' :
                    'from-orange-400 to-orange-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            )}
            
            <button
              onClick={() => setActiveGesture(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Annulla
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {gestures.map((gesture) => {
        const Icon = gesture.icon;
        return (
          <motion.button
            key={gesture.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGesture(gesture.id)}
            className={`${gesture.bgColor} p-4 rounded-xl text-center border border-gray-200 hover:border-gray-300 transition-colors`}
          >
            <Icon className={`w-8 h-8 mx-auto mb-2 ${gesture.color}`} />
            <p className={`font-medium ${gesture.color}`}>{gesture.title}</p>
            <p className="text-xs text-gray-600 mt-1">{gesture.instruction}</p>
          </motion.button>
        );
      })}
    </div>
  );
};

export default MindfulGestures;