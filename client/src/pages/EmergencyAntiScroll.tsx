import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Zap, CheckCircle, RotateCcw, Brain, Heart, Shield, Activity, Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import Timer from '@/components/Timer';
import useLocalStorage from '@/hooks/useLocalStorage';

interface EmergencyAction {
  id: string;
  category: 'physical' | 'mental' | 'dopamine';
  action: string;
  icon: string;
  description: string;
  timeMinutes: number;
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
  const [timerActive, setTimerActive] = useState(false);
  const [emergencyLogs, setEmergencyLogs] = useLocalStorage<EmergencyLog[]>('emergency-anti-scroll-logs', []);
  const [emergencyScore, setEmergencyScore] = useLocalStorage<number>('emergency-score', 0);
  
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
      action: 'Alzati e fai 10 jumping jacks',
      icon: '🏃‍♂️',
      description: 'Riattiva il corpo e spezza il pattern automatico',
      timeMinutes: 2
    },
    {
      id: 'physical-2',
      category: 'physical',
      action: 'Bevi un bicchiere d\'acqua lentamente',
      icon: '💧',
      description: 'Idrata il corpo e rallenta il ritmo',
      timeMinutes: 3
    },
    {
      id: 'physical-3',
      category: 'physical',
      action: 'Guarda fuori dalla finestra per 30 secondi',
      icon: '👀',
      description: 'Cambia ambiente e prospettiva',
      timeMinutes: 1
    },
    {
      id: 'physical-4',
      category: 'physical',
      action: 'Stira le braccia sopra la testa per 30 secondi',
      icon: '🙆‍♀️',
      description: 'Attiva il corpo per spezzare l\'automatismo',
      timeMinutes: 1
    },
    {
      id: 'physical-5',
      category: 'physical',
      action: 'Fai 5 respiri profondi con le mani sul petto',
      icon: '🫁',
      description: 'Connetti corpo e mente',
      timeMinutes: 2
    },

    // Mini-esercizi mentali
    {
      id: 'mental-1',
      category: 'mental',
      action: 'Elenca 5 cose che puoi vedere intorno a te',
      icon: '👁️',
      description: 'Riporta l\'attenzione al presente',
      timeMinutes: 2
    },
    {
      id: 'mental-2',
      category: 'mental',
      action: 'Conta all\'indietro da 20 a 1',
      icon: '🔢',
      description: 'Focalizza la mente su un compito semplice',
      timeMinutes: 1
    },
    {
      id: 'mental-3',
      category: 'mental',
      action: 'Pensa a 3 cose per cui sei grato oggi',
      icon: '🙏',
      description: 'Sposta il focus verso il positivo',
      timeMinutes: 3
    },
    {
      id: 'mental-4',
      category: 'mental',
      action: 'Visualizza il tuo obiettivo principale per oggi',
      icon: '🎯',
      description: 'Riconnettiti alle tue priorità',
      timeMinutes: 2
    },
    {
      id: 'mental-5',
      category: 'mental',
      action: 'Ripeti un mantra personale 5 volte',
      icon: '🧘‍♀️',
      description: 'Centra la mente con intenzione',
      timeMinutes: 2
    },

    // Alternative salutari per la dopamina
    {
      id: 'dopamine-1',
      category: 'dopamine',
      action: 'Chiama o scrivi a qualcuno che ti fa stare bene',
      icon: '📞',
      description: 'Connessione umana reale',
      timeMinutes: 5
    },
    {
      id: 'dopamine-2',
      category: 'dopamine',
      action: 'Scrivi 3 righe nel tuo diario',
      icon: '✍️',
      description: 'Espressione creativa e riflessione',
      timeMinutes: 3
    },
    {
      id: 'dopamine-3',
      category: 'dopamine',
      action: 'Ascolta la tua canzone preferita per 2 minuti',
      icon: '🎵',
      description: 'Dopamina naturale attraverso la musica',
      timeMinutes: 2
    },
    {
      id: 'dopamine-4',
      category: 'dopamine',
      action: 'Fai una foto di qualcosa di bello che hai vicino',
      icon: '📷',
      description: 'Creatività invece di consumo passivo',
      timeMinutes: 2
    },
    {
      id: 'dopamine-5',
      category: 'dopamine',
      action: 'Leggi una frase motivazionale ad alta voce',
      icon: '📖',
      description: 'Nutrimento mentale positivo',
      timeMinutes: 1
    }
  ];

  const getRandomAction = (): EmergencyAction => {
    const randomIndex = Math.floor(Math.random() * emergencyActions.length);
    return emergencyActions[randomIndex];
  };

  const handleEmergencyClick = () => {
    const action = getRandomAction();
    setCurrentAction(action);
    setIsActionCompleted(false);
    setTimerActive(true);
    
    toast({
      title: "Azione di emergenza!",
      description: `${action.action} - Timer di ${action.timeMinutes} min avviato`,
      duration: 5000,
    });
  };

  const handleTimerComplete = () => {
    setTimerActive(false);
    toast({
      title: "Timer completato!",
      description: "Tempo scaduto. Hai completato l'attività?",
    });
  };

  const handleActionComplete = () => {
    if (!currentAction) return;
    
    setIsActionCompleted(true);
    setTimerActive(false);
    setEmergencyScore(prev => prev + 10);
    
    const newLog: EmergencyLog = {
      date: new Date().toLocaleDateString('it-IT'),
      action: currentAction.action,
      timestamp: new Date()
    };
    
    setEmergencyLogs(prev => [newLog, ...prev.slice(0, 9)]);
    
    setInterventionStats(prev => ({
      ...prev,
      emergencyActionsCompleted: prev.emergencyActionsCompleted + 1,
      totalInterventions: prev.totalInterventions + 1
    }));
    
    toast({
      title: "Ottimo lavoro!",
      description: "Hai completato l'azione di emergenza. +10 punti!",
    });
  };

  const handleReset = () => {
    setCurrentAction(null);
    setIsActionCompleted(false);
    setTimerActive(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Activity className="w-4 h-4" />;
      case 'mental': return <Brain className="w-4 h-4" />;
      case 'dopamine': return <Heart className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mental': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'dopamine': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeded] pb-20">
      <Header />
      
      <main className="p-4 space-y-6">
        {/* Pulsante principale di emergenza */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <Button 
            onClick={handleEmergencyClick}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            size="default"
          >
            <Zap className="w-4 h-4 mr-2" />
            STO PER SCROLLARE
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Premi quando senti il bisogno compulsivo di scrollare
          </p>
        </div>

        {/* Azione corrente */}
        {currentAction && (
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {getCategoryIcon(currentAction.category)}
              </div>
              <h3 className="font-semibold text-foreground">Azione di Emergenza</h3>
              <Badge variant="outline" className="text-xs">
                {currentAction.category === 'physical' ? 'Fisico' :
                 currentAction.category === 'mental' ? 'Mentale' : 'Dopamina'}
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">{currentAction.icon}</div>
              <h4 className="text-base font-medium mb-2 text-foreground">{currentAction.action}</h4>
              <p className="text-muted-foreground text-sm">{currentAction.description}</p>
            </div>
            
            <div className="flex gap-2">
              {!isActionCompleted ? (
                <Button 
                  onClick={handleActionComplete}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completata
                </Button>
              ) : (
                <div className="flex-1 text-center py-2 bg-primary/10 text-primary rounded-md font-medium">
                  ✅ Azione completata!
                </div>
              )}
              
              <Button 
                onClick={handleReset}
                variant="outline"
                className="flex-shrink-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nuova
              </Button>
            </div>
          </div>
        )}

        {/* Statistiche integrate */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Statistiche Anti-Scroll</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Interventi Totali</p>
              <p className="text-lg font-bold text-foreground">{interventionStats.totalInterventions}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Azioni Completate</p>
              <p className="text-lg font-bold text-foreground">{interventionStats.emergencyActionsCompleted}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Tempo Risparmiato</p>
              <p className="text-lg font-bold text-foreground">
                {Math.floor((interventionStats.emergencyActionsCompleted * 5 + interventionStats.scrollInterruptions * 2) / 60)}h {((interventionStats.emergencyActionsCompleted * 5 + interventionStats.scrollInterruptions * 2) % 60)}m
              </p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Punti Totali</p>
              <p className="text-lg font-bold text-foreground">{emergencyScore}</p>
            </div>
          </div>
        </div>



        {/* Log delle azioni recenti */}
        {emergencyLogs.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-foreground" />
              <h3 className="font-semibold text-foreground">Azioni Recenti</h3>
            </div>
            <div className="space-y-3">
              {emergencyLogs.slice(0, 5).map((log, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-start gap-4 p-3 bg-muted rounded-lg"
                >
                  <span className="text-foreground text-sm leading-relaxed flex-1 pr-6">
                    {log.action}
                  </span>
                  <Badge variant="outline" className="text-xs shrink-0 ml-4">
                    {log.date}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <TabNavigation />
    </div>
  );
};

export default EmergencyAntiScroll;