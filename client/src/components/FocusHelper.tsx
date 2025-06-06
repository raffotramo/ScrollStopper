import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Clock, Eye, Volume2, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface FocusStep {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  instruction: string;
  estimated_time: string;
}

interface FocusHelperProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const FocusHelper: React.FC<FocusHelperProps> = ({ isActive, onToggle }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const { toast } = useToast();

  const focusSteps: FocusStep[] = [
    {
      id: 'device_settings',
      icon: Smartphone,
      title: 'Configura Dispositivo',
      description: 'Attiva Non Disturbare e chiudi app social',
      instruction: 'Vai in Impostazioni → Non Disturbare → Attiva. Chiudi WhatsApp, Instagram, TikTok.',
      estimated_time: '1 min'
    },
    {
      id: 'physical_setup',
      icon: Eye,
      title: 'Posizionamento Fisico',
      description: 'Metti il telefono lontano dalla vista',
      instruction: 'Posiziona il telefono a faccia in giù, in un\'altra stanza o dentro un cassetto.',
      estimated_time: '30 sec'
    },
    {
      id: 'audio_environment',
      icon: Volume2,
      title: 'Ambiente Sonoro',
      description: 'Prepara un ambiente silenzioso o con suoni focus',
      instruction: 'Silenzioso totale, natura/pioggia, o musica strumentale a basso volume.',
      estimated_time: '1 min'
    },
    {
      id: 'connectivity',
      icon: Wifi,
      title: 'Connessione Minima',
      description: 'Modalità aereo + WiFi solo se necessario',
      instruction: 'Attiva modalità aereo, poi riattiva solo WiFi se serve per l\'attività.',
      estimated_time: '30 sec'
    }
  ];

  // Update session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && sessionStartTime) {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, sessionStartTime]);

  const handleStepToggle = (stepId: string, checked: boolean) => {
    if (checked) {
      setCompletedSteps(prev => [...prev, stepId]);
    } else {
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  const startFocusSession = () => {
    if (completedSteps.length < focusSteps.length) {
      toast({
        title: "Preparazione Incompleta",
        description: `Completa tutti i ${focusSteps.length} passaggi per una sessione focus ottimale`,
        variant: "destructive",
      });
      return;
    }

    setSessionStartTime(new Date());
    onToggle(true);
    
    toast({
      title: "Sessione Focus Iniziata",
      description: "Ambiente preparato! Concentrati sulla tua attività",
    });
  };

  const endFocusSession = () => {
    const duration = sessionDuration;
    setSessionStartTime(null);
    setSessionDuration(0);
    setCompletedSteps([]);
    onToggle(false);
    
    toast({
      title: "Sessione Completata",
      description: `Ottimo lavoro! Hai mantenuto il focus per ${Math.floor(duration / 60)}m ${duration % 60}s`,
    });
  };

  const formatSessionTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isActive) {
    return (
      <Card className="w-full border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Sessione Focus Attiva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">
              {formatSessionTime(sessionDuration)}
            </div>
            <p className="text-sm text-green-700">
              Mantieni la concentrazione, stai andando benissimo!
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Ricordati di:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Telefono lontano dalla vista</li>
              <li>• Non Disturbare attivo</li>
              <li>• Respira profondamente se ti distrai</li>
              <li>• Ogni minuto di focus conta</li>
            </ul>
          </div>

          <Button 
            onClick={endFocusSession}
            variant="outline"
            className="w-full text-green-700 border-green-300 hover:bg-green-100"
          >
            Termina Sessione Focus
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Preparazione Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Segui questi passaggi per creare l'ambiente perfetto per la concentrazione:
        </p>

        <div className="space-y-3">
          {focusSteps.map((step) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            
            return (
              <div key={step.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => handleStepToggle(step.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{step.title}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {step.estimated_time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {step.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <span className="text-sm font-medium">
              Passaggi completati: {completedSteps.length}/{focusSteps.length}
            </span>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(completedSteps.length / focusSteps.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={startFocusSession}
          className="w-full"
          disabled={completedSteps.length < focusSteps.length}
        >
          {completedSteps.length < focusSteps.length 
            ? `Completa ${focusSteps.length - completedSteps.length} passaggi rimanenti`
            : "Inizia Sessione Focus"
          }
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>💡 La preparazione corretta è la chiave per una sessione di successo</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusHelper;