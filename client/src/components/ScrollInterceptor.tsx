import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, PauseCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollInterceptorProps {
  isActive: boolean;
  sensitivity?: number;
  cooldownMs?: number;
  onScrollDetected?: () => void;
}

const ScrollInterceptor: React.FC<ScrollInterceptorProps> = ({
  isActive = true,
  sensitivity = 3,
  cooldownMs = 2000,
  onScrollDetected
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const scrollCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const blockTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = (e: WheelEvent | TouchEvent) => {
      scrollCountRef.current++;
      setScrollCount(scrollCountRef.current);
      
      if (scrollCountRef.current >= sensitivity) {
        e.preventDefault();
        e.stopPropagation();
        
        setShowWarning(true);
        setIsBlocked(true);
        onScrollDetected?.();
        
        // Reset after cooldown
        if (blockTimeoutRef.current) {
          clearTimeout(blockTimeoutRef.current);
        }
        
        blockTimeoutRef.current = setTimeout(() => {
          setIsBlocked(false);
          setShowWarning(false);
          scrollCountRef.current = 0;
          setScrollCount(0);
        }, cooldownMs);
        
        return false;
      }
      
      // Reset counter after short delay if under sensitivity
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        scrollCountRef.current = 0;
        setScrollCount(0);
      }, 1000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBlocked && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp')) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('touchmove', handleScroll, { passive: false });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('touchmove', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (blockTimeoutRef.current) clearTimeout(blockTimeoutRef.current);
    };
  }, [isActive, sensitivity, cooldownMs, isBlocked, onScrollDetected]);

  const handleDismiss = () => {
    setShowWarning(false);
    setIsBlocked(false);
    scrollCountRef.current = 0;
    setScrollCount(0);
    if (blockTimeoutRef.current) {
      clearTimeout(blockTimeoutRef.current);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Scroll Progress Indicator */}
      <AnimatePresence>
        {scrollCount > 0 && scrollCount < sensitivity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-yellow-100 border border-yellow-300 rounded-full p-2 shadow-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="flex gap-1">
                  {Array.from({ length: sensitivity }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < scrollCount ? 'bg-yellow-600' : 'bg-yellow-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Block Warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <PauseCircle className="w-16 h-16 text-red-500 mx-auto" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Scrolling veloce rilevato!
              </h3>
              
              <p className="text-gray-600 mb-4">
                Stai scrollando troppo velocemente. Prenditi un momento per riflettere su quello che stai facendo.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Continua comunque
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Torna indietro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollInterceptor;