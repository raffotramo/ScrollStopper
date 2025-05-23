import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Zap, CheckCircle, RotateCcw, Brain, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
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
      <Header />

      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Emergency Button Section */}
        <section className="mx-4 my-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Pronto Soccorso Anti-Scroll
            </h1>
            <p className="text-muted-foreground text-sm">
              Interrompi il ciclo automatico con un'azione consapevole
            </p>
          </div>

          {!currentAction ? (
            <div className="text-center">
              <Button
                onClick={handleEmergencyClick}
                className="w-64 h-20 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transform hover:scale-105 transition-all duration-200"
              >
                💥 Sto per scrollare
              </Button>
              <p className="text-muted-foreground text-xs mt-4">
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
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Interruzioni</p>
              <p className="text-xl font-bold text-foreground">{emergencyScore}</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Questa settimana</p>
              <p className="text-xl font-bold text-foreground">
                {emergencyLogs.filter(log => {
                  const logDate = new Date(log.timestamp);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return logDate > weekAgo;
                }).length}
              </p>
            </div>
          </div>
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
    </div>
  );
};

export default EmergencyAntiScroll;