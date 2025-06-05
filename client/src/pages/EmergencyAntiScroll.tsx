import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Zap, CheckCircle, RotateCcw, Brain, Heart, Shield, Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import ManualAntiScrolling from '@/components/ManualAntiScrolling';
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
  
  // Sistema anti-scrolling manuale
  const [antiScrollingActive, setAntiScrollingActive] = useState(false);
  const [interventionStats, setInterventionStats] = useLocalStorage('intervention-stats', {
    scrollInterruptions: 0,
    gesturesCompleted: 0,
    emergencyActionsCompleted: 0,
    totalInterventions: 0
  });

  // Gestione sistema anti-scrolling manuale
  const handleAntiScrollingStatsUpdate = (stats: any) => {
    setInterventionStats(prev => ({
      ...prev,
      ...stats,
      totalInterventions: prev.totalInterventions + 1
    }));
  };

  const emergencyActions: EmergencyAction[] = [
    // Azioni fisiche immediate
    {
      id: 'physical-1',
      category: 'physical',
      action: 'Alzati e fai 10 jumping jacks',
      icon: '🏃‍♂️',
      description: 'Riattiva il corpo e spezza il pattern automatico'
    },
    {
      id: 'physical-2',
      category: 'physical',
      action: 'Bevi un bicchiere d\'acqua lentamente',
      icon: '💧',
      description: 'Idrata il corpo e rallenta il ritmo'
    },
    {
      id: 'physical-3',
      category: 'physical',
      action: 'Guarda fuori dalla finestra per 30 secondi',
      icon: '👀',
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
      action: 'Elenca 5 cose che puoi vedere intorno a te',
      icon: '👁️',
      description: 'Riporta l\'attenzione al presente'
    },
    {
      id: 'mental-2',
      category: 'mental',
      action: 'Conta all\'indietro da 20 a 1',
      icon: '🔢',
      description: 'Focalizza la mente su un compito semplice'
    },
    {
      id: 'mental-3',
      category: 'mental',
      action: 'Pensa a 3 cose per cui sei grato oggi',
      icon: '🙏',
      description: 'Sposta il focus verso il positivo'
    },
    {
      id: 'mental-4',
      category: 'mental',
      action: 'Visualizza il tuo obiettivo principale per oggi',
      icon: '🎯',
      description: 'Riconnettiti alle tue priorità'
    },
    {
      id: 'mental-5',
      category: 'mental',
      action: 'Ripeti un mantra personale 5 volte',
      icon: '🧘‍♀️',
      description: 'Centra la mente con intenzione'
    },

    // Alternative salutari per la dopamina
    {
      id: 'dopamine-1',
      category: 'dopamine',
      action: 'Chiama o scrivi a qualcuno che ti fa stare bene',
      icon: '📞',
      description: 'Connessione umana reale'
    },
    {
      id: 'dopamine-2',
      category: 'dopamine',
      action: 'Scrivi 3 righe nel tuo diario',
      icon: '✍️',
      description: 'Espressione creativa e riflessione'
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
    
    toast({
      title: "Azione di emergenza!",
      description: action.action,
      duration: 5000,
    });
  };

  const handleActionComplete = () => {
    if (!currentAction) return;
    
    setIsActionCompleted(true);
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
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Zap className="w-12 h-12 mx-auto text-red-500 mb-2" />
              <h2 className="text-xl font-bold text-red-700 mb-2">
                STO PER SCROLLARE
              </h2>
              <p className="text-red-600 text-sm">
                Premi quando senti il bisogno compulsivo di scrollare
              </p>
            </div>
            
            <Button 
              onClick={handleEmergencyClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-lg py-6"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              AZIONE IMMEDIATA
            </Button>
          </CardContent>
        </Card>

        {/* Azione corrente */}
        {currentAction && (
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(currentAction.category)}
                Azione di Emergenza
                <Badge className={getCategoryColor(currentAction.category)}>
                  {currentAction.category === 'physical' ? 'Fisico' :
                   currentAction.category === 'mental' ? 'Mentale' : 'Dopamina'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{currentAction.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{currentAction.action}</h3>
                <p className="text-gray-600 text-sm">{currentAction.description}</p>
              </div>
              
              <div className="flex gap-2">
                {!isActionCompleted ? (
                  <Button 
                    onClick={handleActionComplete}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completata
                  </Button>
                ) : (
                  <div className="flex-1 text-center py-2 bg-green-100 text-green-700 rounded-md font-medium">
                    ✅ Azione completata!
                  </div>
                )}
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nuova Azione
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiche integrate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Statistiche Anti-Scroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {interventionStats.totalInterventions}
                </div>
                <div className="text-sm text-gray-600">Interventi Totali</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {interventionStats.emergencyActionsCompleted}
                </div>
                <div className="text-sm text-gray-600">Azioni Completate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {interventionStats.scrollInterruptions}
                </div>
                <div className="text-sm text-gray-600">Scroll Bloccati</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {emergencyScore}
                </div>
                <div className="text-sm text-gray-600">Punti Totali</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sistema Anti-Scrolling Manuale */}
        <ManualAntiScrolling
          isActive={antiScrollingActive}
          onToggle={() => setAntiScrollingActive(!antiScrollingActive)}
          onStatsUpdate={handleAntiScrollingStatsUpdate}
        />

        {/* Log delle azioni recenti */}
        {emergencyLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Azioni Recenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emergencyLogs.slice(0, 5).map((log, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm"
                  >
                    <span className="text-gray-700">{log.action}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <TabNavigation />
    </div>
  );
};

export default EmergencyAntiScroll;