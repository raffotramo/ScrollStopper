import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause } from 'lucide-react';
import ScrollInterceptor from './ScrollInterceptor';
import ScrollFeedback from './ScrollFeedback';
import MindfulGestures from './MindfulGestures';
import HapticFeedback from './HapticFeedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useLocalStorage from '@/hooks/useLocalStorage';

interface SystemSettings {
  interceptorEnabled: boolean;
  feedbackEnabled: boolean;
  gesturesEnabled: boolean;
  hapticEnabled: boolean;
  sensitivity: number;
  interventionMode: 'gentle' | 'moderate' | 'strict';
}

interface InterventionStats {
  totalInterventions: number;
  gesturesCompleted: number;
  scrollingReduced: number;
  lastUsed: string;
}

const AntiScrollingSystem: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<SystemSettings>('anti-scrolling-settings', {
    interceptorEnabled: true,
    feedbackEnabled: true,
    gesturesEnabled: true,
    hapticEnabled: true,
    sensitivity: 3,
    interventionMode: 'moderate'
  });

  const [stats, setStats] = useLocalStorage<InterventionStats>('anti-scrolling-stats', {
    totalInterventions: 0,
    gesturesCompleted: 0,
    scrollingReduced: 0,
    lastUsed: new Date().toISOString()
  });

  const [isActive, setIsActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showGestures, setShowGestures] = useState(false);
  const [triggerHaptic, setTriggerHaptic] = useState(false);
  const [currentBehavior, setCurrentBehavior] = useState<'mindful' | 'compulsive' | 'excessive'>('mindful');

  const handleScrollDetected = () => {
    setStats(prev => ({
      ...prev,
      totalInterventions: prev.totalInterventions + 1,
      lastUsed: new Date().toISOString()
    }));

    if (settings.hapticEnabled) {
      setTriggerHaptic(true);
    }

    if (settings.gesturesEnabled && settings.interventionMode !== 'gentle') {
      setShowGestures(true);
    }
  };

  const handleGestureComplete = (gesture: string) => {
    setStats(prev => ({
      ...prev,
      gesturesCompleted: prev.gesturesCompleted + 1,
      scrollingReduced: prev.scrollingReduced + 1
    }));
    setShowGestures(false);
  };

  const handleBehaviorChange = (behavior: 'mindful' | 'compulsive' | 'excessive') => {
    setCurrentBehavior(behavior);
    
    if (behavior === 'excessive' && settings.interventionMode === 'strict') {
      setShowGestures(true);
    }
  };

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetStats = () => {
    setStats({
      totalInterventions: 0,
      gesturesCompleted: 0,
      scrollingReduced: 0,
      lastUsed: new Date().toISOString()
    });
  };

  return (
    <>
      {/* Main System Components */}
      {isActive && settings.interceptorEnabled && (
        <ScrollInterceptor
          isActive={true}
          sensitivity={settings.sensitivity}
          onScrollDetected={handleScrollDetected}
        />
      )}

      {isActive && settings.feedbackEnabled && (
        <ScrollFeedback
          isActive={true}
          onScrollBehaviorChange={handleBehaviorChange}
        />
      )}

      <HapticFeedback
        trigger={triggerHaptic}
        intensity={settings.interventionMode === 'strict' ? 'heavy' : 'medium'}
        pattern={[100, 50, 100]}
        onComplete={() => setTriggerHaptic(false)}
      />

      {/* Control Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col gap-2"
        >
          {/* Status indicator */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentBehavior === 'mindful' ? 'bg-green-100 text-green-700' :
            currentBehavior === 'compulsive' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {currentBehavior === 'mindful' ? 'Mindful' : 
             currentBehavior === 'compulsive' ? 'Compulsive' : 'Excessive'}
          </div>

          {/* Main toggle */}
          <Button
            onClick={() => setIsActive(!isActive)}
            size="sm"
            variant={isActive ? "default" : "outline"}
            className="w-12 h-12 rounded-full p-0"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Settings toggle */}
          <Button
            onClick={() => setShowSettings(!showSettings)}
            size="sm"
            variant="outline"
            className="w-12 h-12 rounded-full p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <Card className="m-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Anti-Scrolling Settings
                  <Button
                    onClick={() => setShowSettings(false)}
                    size="sm"
                    variant="ghost"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-medium">Funzionalità</h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Intercettazione Scroll</span>
                    <Switch
                      checked={settings.interceptorEnabled}
                      onCheckedChange={(checked) => updateSetting('interceptorEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback Visivo</span>
                    <Switch
                      checked={settings.feedbackEnabled}
                      onCheckedChange={(checked) => updateSetting('feedbackEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gesti Mindful</span>
                    <Switch
                      checked={settings.gesturesEnabled}
                      onCheckedChange={(checked) => updateSetting('gesturesEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback Tattile</span>
                    <Switch
                      checked={settings.hapticEnabled}
                      onCheckedChange={(checked) => updateSetting('hapticEnabled', checked)}
                    />
                  </div>
                </div>

                {/* Sensitivity */}
                <div className="space-y-2">
                  <h4 className="font-medium">Sensibilità</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateSetting('sensitivity', level)}
                        className={`w-8 h-8 rounded-full text-xs ${
                          settings.sensitivity === level
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intervention Mode */}
                <div className="space-y-2">
                  <h4 className="font-medium">Modalità Intervento</h4>
                  <div className="space-y-2">
                    {(['gentle', 'moderate', 'strict'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting('interventionMode', mode)}
                        className={`w-full p-2 text-left rounded-lg text-sm ${
                          settings.interventionMode === mode
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {mode === 'gentle' ? 'Gentile' : 
                         mode === 'moderate' ? 'Moderata' : 'Rigorosa'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <h4 className="font-medium">Statistiche</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-medium">{stats.totalInterventions}</div>
                      <div className="text-gray-600 text-xs">Interventi</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="font-medium">{stats.gesturesCompleted}</div>
                      <div className="text-gray-600 text-xs">Gesti</div>
                    </div>
                  </div>
                  <Button
                    onClick={resetStats}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Reset Statistiche
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mindful Gestures Modal */}
      <AnimatePresence>
        {showGestures && (
          <MindfulGestures
            onGestureComplete={handleGestureComplete}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AntiScrollingSystem;