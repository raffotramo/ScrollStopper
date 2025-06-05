import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ScrollInterceptor from './ScrollInterceptor';
import ScrollFeedback from './ScrollFeedback';
import MindfulGestures from './MindfulGestures';
import HapticFeedback from './HapticFeedback';
import { Shield, ShieldOff, Eye, Zap, Activity } from 'lucide-react';

interface ManualAntiScrollingProps {
  isActive: boolean;
  onToggle: () => void;
  onStatsUpdate: (stats: any) => void;
}

export default function ManualAntiScrolling({ isActive, onToggle, onStatsUpdate }: ManualAntiScrollingProps) {
  const [interceptorActive, setInterceptorActive] = useState(false);
  const [feedbackActive, setFeedbackActive] = useState(false);
  const [gesturesVisible, setGesturesVisible] = useState(false);
  const [triggerHaptic, setTriggerHaptic] = useState(false);
  const [scrollBehavior, setScrollBehavior] = useState<'mindful' | 'compulsive' | 'excessive'>('mindful');
  const [interventions, setInterventions] = useState(0);

  const handleScrollDetected = () => {
    setInterventions(prev => prev + 1);
    setTriggerHaptic(true);
    onStatsUpdate({ scrollsBlocked: interventions + 1 });
  };

  const handleScrollBehaviorChange = (behavior: 'mindful' | 'compulsive' | 'excessive') => {
    setScrollBehavior(behavior);
    if (behavior === 'compulsive' || behavior === 'excessive') {
      setGesturesVisible(true);
    }
  };

  const handleGestureComplete = (gesture: string) => {
    setGesturesVisible(false);
    onStatsUpdate({ gesturesCompleted: true });
  };

  const testVibration = () => {
    setTriggerHaptic(true);
  };

  useEffect(() => {
    if (isActive) {
      setInterceptorActive(true);
      setFeedbackActive(true);
    } else {
      setInterceptorActive(false);
      setFeedbackActive(false);
      setGesturesVisible(false);
    }
  }, [isActive]);

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isActive ? (
              <Shield className="w-5 h-5 text-green-500" />
            ) : (
              <ShieldOff className="w-5 h-5 text-gray-400" />
            )}
            <h3 className="font-semibold">Sistema Anti-Scrolling</h3>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "ATTIVO" : "INATTIVO"}
            </Badge>
          </div>
          <Button
            onClick={onToggle}
            variant={isActive ? "destructive" : "default"}
            size="sm"
          >
            {isActive ? "Disattiva" : "Attiva"}
          </Button>
        </div>

        {isActive && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Monitoraggio: </span>
              <Badge variant="outline" className={
                scrollBehavior === 'mindful' ? 'text-green-600' :
                scrollBehavior === 'compulsive' ? 'text-yellow-600' : 'text-red-600'
              }>
                {scrollBehavior === 'mindful' ? 'Mindful' : 
                 scrollBehavior === 'compulsive' ? 'Compulsivo' : 'Eccessivo'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Interventi: {interventions}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      {isActive && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Azioni Rapide</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={testVibration}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Test Vibrazione
            </Button>
            <Button
              onClick={() => setGesturesVisible(true)}
              variant="outline"
              size="sm"
            >
              Gesti Mindful
            </Button>
          </div>
        </Card>
      )}

      {/* Active Components */}
      {interceptorActive && (
        <ScrollInterceptor
          isActive={true}
          sensitivity={3}
          onScrollDetected={handleScrollDetected}
        />
      )}

      {feedbackActive && (
        <ScrollFeedback
          isActive={true}
          onScrollBehaviorChange={handleScrollBehaviorChange}
        />
      )}

      <HapticFeedback
        trigger={triggerHaptic}
        intensity="medium"
        pattern={[200, 100, 200]}
        onComplete={() => setTriggerHaptic(false)}
      />

      {/* Mindful Gestures Modal */}
      {gesturesVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Gesti Mindful</h3>
            <MindfulGestures onGestureComplete={handleGestureComplete} />
            <Button
              onClick={() => setGesturesVisible(false)}
              variant="outline"
              className="w-full mt-4"
            >
              Chiudi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}