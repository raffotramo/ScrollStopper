import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Zap, CheckCircle, RotateCcw, Brain, Heart, Shield, Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import MindfulGestures from '@/components/MindfulGestures';
import ScrollInterceptor from '@/components/ScrollInterceptor';
import ScrollFeedback from '@/components/ScrollFeedback';
import HapticFeedback from '@/components/HapticFeedback';
import useLocalStorage from '@/hooks/useLocalStorage';

interface EmergencyAction {
  id: string;
  category: 'physical' | 'mental' | 'dopamine';
  action: string;
  icon: string;
  description: string;
}

interface EmergencyLog {
  date: string;
  action: string;
  timestamp: Date;
}

const EmergencyAntiScroll: React.FC = () => {
  const { toast } = useToast();
  const [currentAction, setCurrentAction] = useState<EmergencyAction | null>(null);
  const [isActionCompleted, setIsActionCompleted] = useState(false);
  const [emergencyLogs, setEmergencyLogs] = useLocalStorage<EmergencyLog[]>('emergency-anti-scroll-logs', []);
  const [emergencyScore, setEmergencyScore] = useLocalStorage<number>('emergency-score', 0);
  
  // Stati per micro-interazioni integrate
  const [showMindfulGestures, setShowMindfulGestures] = useState(false);
  const [scrollProtectionActive, setScrollProtectionActive] = useState(true);
  const [triggerHaptic, setTriggerHaptic] = useState(false);
  const [interventionStats, setInterventionStats] = useLocalStorage('intervention-stats', {
    scrollInterruptions: 0,
    gesturesCompleted: 0,
    emergencyActionsCompleted: 0,
    totalInterventions: 0
  });

  const emergencyActions: EmergencyAction[] = [
    // Azioni fisiche immediate
    {
      id: 'physical-1',
      category: 'physical',
      action: 'Alzati in piedi e fai 10 saltelli sul posto',
      icon: '🏃‍♂️',
      description: 'Reset fisico del gesto automatico'
    },
    {
      id: 'physical-2',
      category: 'physical',
      action: 'Bevi un bicchiere d\'acqua lentamente',
      icon: '💧',
      description: 'Interrompi il pattern con un\'azione consapevole'
    },
    {
      id: 'physical-3',
      category: 'physical',
      action: 'Cammina fino alla finestra e guarda fuori per 60 secondi',
      icon: '🪟',
      description: 'Cambia ambiente e prospettiva'
    },
    {
      id: 'physical-4',
      category: 'physical',
      action: 'Stira le braccia sopra la testa per 30 secondi',
      icon: '🙆‍♀️',
      description: 'Attiva il corpo per spezzare l\'automatismo'
    },
    {
      id: 'physical-5',
      category: 'physical',
      action: 'Fai 5 respiri profondi con le mani sul petto',
      icon: '🫁',
      description: 'Connetti corpo e mente'
    },

    // Mini-esercizi mentali
    {
      id: 'mental-1',
      category: 'mental',
      action: 'Chiudi gli occhi e respira 5 volte contando fino a 4',
      icon: '🧘‍♀️',
      description: 'Centra la mente nel presente'
    },
    {
      id: 'mental-2',
      category: 'mental',
      action: 'Descrivi mentalmente 5 cose che vedi nella stanza',
      icon: '👁️',
      description: 'Ancòrati al momento presente'
    },
    {
      id: 'mental-3',
      category: 'mental',
      action: 'Ripeti mentalmente: "Ho il controllo. Respiro. Sento."',
      icon: '💭',
      description: 'Riafferma la tua consapevolezza'
    },
    {
      id: 'mental-4',
      category: 'mental',
      action: 'Conta alla rovescia da 20 a 1 lentamente',
      icon: '🔢',
      description: 'Riporta focus e controllo'
    },
    {
      id: 'mental-5',
      category: 'mental',
      action: 'Pensa a 3 cose per cui sei grato oggi',
      icon: '🙏',
      description: 'Sposta l\'attenzione verso il positivo'
    },

    // Micro-azioni dopamina sana
    {
      id: 'dopamine-1',
      category: 'dopamine',
      action: 'Invia un messaggio vocale affettuoso a qualcuno',
      icon: '🎤',
      description: 'Connessione autentica invece di scroll'
    },
    {
      id: 'dopamine-2',
      category: 'dopamine',
      action: 'Scrivi una cosa bella successa oggi',
      icon: '✍️',
      description: 'Gratificazione attraverso la riflessione'
    },
    {
      id: 'dopamine-3',
      category: 'dopamine',
      action: 'Ascolta la tua canzone preferita per 2 minuti',
      icon: '🎵',
      description: 'Dopamina naturale attraverso la musica'
    },
    {
      id: 'dopamine-4',
      category: 'dopamine',
      action: 'Fai una foto di qualcosa di bello che hai vicino',
      icon: '📷',
      description: 'Creatività invece di consumo passivo'
    },
    {
      id: 'dopamine-5',
      category: 'dopamine',
      action: 'Leggi una frase motivazionale ad alta voce',
      icon: '📖',
      description: 'Nutrimento mentale positivo'
    }
  ];

  const getRandomAction = (): EmergencyAction => {
    const randomIndex = Math.floor(Math.random() * emergencyActions.length);
    return emergencyActions[randomIndex];
  };

  // Gestori per micro-interazioni integrate
  const handleScrollDetected = () => {
    setInterventionStats(prev => ({
      ...prev,
      scrollInterruptions: prev.scrollInterruptions + 1,
      totalInterventions: prev.totalInterventions + 1
    }));
    
    setTriggerHaptic(true);
    toast({
      title: "Scrolling veloce rilevato",
      description: "Prova un'azione di emergenza per ritrovare il controllo",
      variant: "destructive"
    });
  };

  const handleGestureComplete = (gesture: string) => {
    setInterventionStats(prev => ({
      ...prev,
      gesturesCompleted: prev.gesturesCompleted + 1,
      totalInterventions: prev.totalInterventions + 1
    }));
    
    setShowMindfulGestures(false);
    toast({
      title: "Ottimo lavoro!",
      description: `Hai completato l'esercizio: ${gesture}`,
    });
  };

  const handleScrollBehaviorChange = (behavior: 'mindful' | 'compulsive' | 'excessive') => {
    if (behavior === 'excessive') {
      setShowMindfulGestures(true);
    }
  };

  const handleEmergencyClick = () => {
    const action = getRandomAction();
    setCurrentAction(action);
    setIsActionCompleted(false);
  };

  const handleActionCompleted = () => {
    if (!currentAction) return;

    const newLog: EmergencyLog = {
      date: new Date().toLocaleDateString('it-IT'),
      action: currentAction.action,
      timestamp: new Date()
    };

    setEmergencyLogs(prev => [newLog, ...prev.slice(0, 9)]); // Keep last 10 logs
    setEmergencyScore(prev => prev + 1);
    setIsActionCompleted(true);

    toast({
      title: "Hai interrotto il loop! 💪",
      description: "Ottimo lavoro! Hai preso il controllo del momento.",
      variant: "default"
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setCurrentAction(null);
      setIsActionCompleted(false);
    }, 3000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <RotateCcw className="w-5 h-5 text-primary" />;
      case 'mental': return <Brain className="w-5 h-5 text-primary" />;
      case 'dopamine': return <Heart className="w-5 h-5 text-primary" />;
      default: return <Zap className="w-5 h-5 text-primary" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'physical': return 'Reset Fisico';
      case 'mental': return 'Esercizio Mentale';
      case 'dopamine': return 'Dopamina Sana';
      default: return 'Azione';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Hero Section */}
        <section className="mx-4 mt-8 mb-8">
          <div className="text-center mb-10">
            <div className="mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-primary mb-4">
                Anti-Scroll
              </h1>
              <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-4"></div>
            </div>
            <p className="text-foreground text-base font-bold mb-2">
              Interrompi il ciclo automatico<br />con un'azione consapevole
            </p>
          </div>

          {!currentAction ? (
            <div className="text-center">
              <Button
                onClick={handleEmergencyClick}
                className="w-full h-24 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-black rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transform hover:scale-[1.02] transition-all duration-200"
              >
                💥 STO PER SCROLLARE
              </Button>
              <p className="text-muted-foreground text-sm mt-6 font-medium">
                Tocca quando senti l'impulso di scrollare mindlessly
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border/30 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">{currentAction.icon}</div>
                <div className="flex items-center justify-center mb-4">
                  {getCategoryIcon(currentAction.category)}
                  <span className="ml-2 text-sm font-medium text-primary">
                    {getCategoryName(currentAction.category)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {currentAction.action}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {currentAction.description}
                </p>
                
                {!isActionCompleted ? (
                  <Button
                    onClick={handleActionCompleted}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Fatto!
                  </Button>
                ) : (
                  <div className="text-center">
                    <div className="text-primary text-lg font-bold mb-2">
                      🎉 Hai interrotto il loop! 💪
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Ottimo lavoro! Continua così...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mx-4 my-6">
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5" />
                Statistiche Interventi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{interventionStats.totalInterventions}</div>
                  <div className="text-xs text-muted-foreground">Totale Interventi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{interventionStats.scrollInterruptions}</div>
                  <div className="text-xs text-muted-foreground">Scroll Bloccati</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{interventionStats.gesturesCompleted}</div>
                  <div className="text-xs text-muted-foreground">Gesti Mindful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{interventionStats.emergencyActionsCompleted}</div>
                  <div className="text-xs text-muted-foreground">Azioni d'Emergenza</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Punteggio</p>
              <p className="text-xl font-bold text-foreground">{emergencyScore}</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Shield className={`w-5 h-5 ${scrollProtectionActive ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Protezione</p>
              <p className="text-sm font-bold text-foreground">
                {scrollProtectionActive ? 'Attiva' : 'Inattiva'}
              </p>
            </div>
          </div>
        </section>

        {/* Micro-interactions Controls */}
        <section className="mx-4 my-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-5 h-5" />
                Controlli Avanzati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Protezione Scroll</p>
                  <p className="text-xs text-muted-foreground">Blocca scrolling veloce</p>
                </div>
                <button
                  onClick={() => setScrollProtectionActive(!scrollProtectionActive)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    scrollProtectionActive ? 'bg-primary' : 'bg-gray-300'
                  } relative`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      scrollProtectionActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowMindfulGestures(true)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Gesti Mindful
                </Button>
                <Button
                  onClick={() => {
                    setTriggerHaptic(true);
                    toast({ title: "Test vibrazione", description: "Feedback tattile attivato" });
                  }}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Test Vibrazione
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Actions Log */}
        {emergencyLogs.length > 0 && (
          <section className="mx-4 my-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Ultime interruzioni
            </h2>
            <div className="space-y-2">
              {emergencyLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="bg-card border border-border/30 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-foreground flex-1 mr-2">
                      {log.action}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {log.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <TabNavigation />

      {/* Integrated Micro-interactions */}
      {scrollProtectionActive && (
        <ScrollInterceptor
          isActive={true}
          sensitivity={3}
          onScrollDetected={handleScrollDetected}
        />
      )}

      <ScrollFeedback
        isActive={true}
        onScrollBehaviorChange={handleScrollBehaviorChange}
      />

      <HapticFeedback
        trigger={triggerHaptic}
        intensity="medium"
        pattern={[200, 100, 200]}
        onComplete={() => setTriggerHaptic(false)}
      />

      {showMindfulGestures && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Gesti Mindful</h3>
            <MindfulGestures onGestureComplete={handleGestureComplete} />
            <Button
              onClick={() => setShowMindfulGestures(false)}
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
};

export default EmergencyAntiScroll;