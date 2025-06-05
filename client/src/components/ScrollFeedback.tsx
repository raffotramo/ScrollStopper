import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Clock, Target, AlertCircle } from 'lucide-react';

interface ScrollFeedbackProps {
  isActive?: boolean;
  onScrollBehaviorChange?: (behavior: 'mindful' | 'compulsive' | 'excessive') => void;
}

interface ScrollMetrics {
  speed: number;
  direction: 'up' | 'down';
  frequency: number;
  totalDistance: number;
  sessionTime: number;
}

const ScrollFeedback: React.FC<ScrollFeedbackProps> = ({ 
  isActive = true, 
  onScrollBehaviorChange 
}) => {
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    speed: 0,
    direction: 'down',
    frequency: 0,
    totalDistance: 0,
    sessionTime: 0
  });
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [behaviorType, setBehaviorType] = useState<'mindful' | 'compulsive' | 'excessive'>('mindful');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  
  const scrollDataRef = useRef({
    lastScrollY: 0,
    lastScrollTime: Date.now(),
    scrollEvents: [] as Array<{ time: number; position: number; speed: number }>,
    sessionStart: Date.now()
  });
  
  const particleIdRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    const updateMetrics = () => {
      const now = Date.now();
      const recentEvents = scrollDataRef.current.scrollEvents.filter(
        event => now - event.time < 5000 // Last 5 seconds
      );
      
      if (recentEvents.length > 0) {
        const avgSpeed = recentEvents.reduce((sum, event) => sum + event.speed, 0) / recentEvents.length;
        const frequency = recentEvents.length / 5; // Events per second
        
        setMetrics(prev => ({
          ...prev,
          speed: avgSpeed,
          frequency,
          sessionTime: (now - scrollDataRef.current.sessionStart) / 1000
        }));
        
        // Determine behavior type
        let behavior: 'mindful' | 'compulsive' | 'excessive' = 'mindful';
        
        if (frequency > 3 && avgSpeed > 100) {
          behavior = 'excessive';
        } else if (frequency > 2 || avgSpeed > 80) {
          behavior = 'compulsive';
        }
        
        setBehaviorType(behavior);
        onScrollBehaviorChange?.(behavior);
        
        setShowFeedback(behavior !== 'mindful');
      }
    };

    const handleScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      const lastY = scrollDataRef.current.lastScrollY;
      const lastTime = scrollDataRef.current.lastScrollTime;
      
      const deltaY = Math.abs(currentY - lastY);
      const deltaTime = now - lastTime;
      const speed = deltaTime > 0 ? (deltaY / deltaTime) * 1000 : 0; // pixels per second
      
      const direction = currentY > lastY ? 'down' : 'up';
      
      // Store scroll event
      scrollDataRef.current.scrollEvents.push({
        time: now,
        position: currentY,
        speed
      });
      
      // Keep only recent events
      scrollDataRef.current.scrollEvents = scrollDataRef.current.scrollEvents.filter(
        event => now - event.time < 10000
      );
      
      setMetrics(prev => ({
        ...prev,
        direction,
        totalDistance: prev.totalDistance + deltaY
      }));
      
      // Create particles for fast scrolling
      if (speed > 50) {
        const newParticles = Array.from({ length: Math.min(3, Math.floor(speed / 50)) }, () => ({
          id: particleIdRef.current++,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: speed > 150 ? '#ef4444' : speed > 100 ? '#f59e0b' : '#10b981'
        }));
        
        setParticles(prev => [...prev, ...newParticles]);
        
        // Remove particles after animation
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
        }, 1000);
      }
      
      scrollDataRef.current.lastScrollY = currentY;
      scrollDataRef.current.lastScrollTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const interval = setInterval(updateMetrics, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [isActive, onScrollBehaviorChange]);

  const getFeedbackColor = () => {
    switch (behaviorType) {
      case 'excessive': return 'text-red-600 bg-red-50 border-red-200';
      case 'compulsive': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getFeedbackIcon = () => {
    switch (behaviorType) {
      case 'excessive': return AlertCircle;
      case 'compulsive': return Clock;
      default: return Target;
    }
  };

  const getFeedbackMessage = () => {
    switch (behaviorType) {
      case 'excessive':
        return {
          title: 'Scrolling eccessivo',
          message: 'Stai scrollando molto velocemente. Rallenta e respira.'
        };
      case 'compulsive':
        return {
          title: 'Scrolling compulsivo',
          message: 'Nota il tuo pattern di scrolling. Cosa stai cercando?'
        };
      default:
        return {
          title: 'Scrolling mindful',
          message: 'Ottimo! Stai navigando in modo consapevole.'
        };
    }
  };

  if (!isActive) return null;

  const feedback = getFeedbackMessage();
  const FeedbackIcon = getFeedbackIcon();

  return (
    <>
      {/* Particles for visual feedback */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: particle.x,
              y: particle.y
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              x: particle.x + (Math.random() - 0.5) * 100,
              y: particle.y + (Math.random() - 0.5) * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed w-2 h-2 rounded-full pointer-events-none z-40"
            style={{ backgroundColor: particle.color }}
          />
        ))}
      </AnimatePresence>

      {/* Real-time feedback overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-4 z-40 max-w-xs"
          >
            <div className={`p-3 rounded-lg border shadow-lg backdrop-blur-sm ${getFeedbackColor()}`}>
              <div className="flex items-start gap-3">
                <FeedbackIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">{feedback.title}</h4>
                  <p className="text-xs opacity-80 mt-1">{feedback.message}</p>
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Velocità</span>
                  <span>{Math.round(metrics.speed)} px/s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Frequenza</span>
                  <span>{metrics.frequency.toFixed(1)} /s</span>
                </div>
              </div>
              
              {/* Speed indicator bar */}
              <div className="mt-2 w-full bg-white/30 rounded-full h-1">
                <motion.div
                  className={`h-1 rounded-full ${
                    metrics.speed > 150 ? 'bg-red-400' : 
                    metrics.speed > 100 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (metrics.speed / 200) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll awareness reminder */}
      <AnimatePresence>
        {metrics.sessionTime > 60 && behaviorType !== 'mindful' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">
                Hai scrollato per {Math.round(metrics.sessionTime / 60)} minuti
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollFeedback;