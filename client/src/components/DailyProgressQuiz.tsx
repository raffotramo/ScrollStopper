import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, Smartphone, Shield, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizData {
  [key: string]: string;
}

interface DailyProgressQuizProps {
  onComplete: (data: QuizData) => void;
  day: number;
}

const DailyProgressQuiz: React.FC<DailyProgressQuizProps> = ({ onComplete, day }) => {
  const [answers, setAnswers] = useState<QuizData>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  // Verifica se il check-in di oggi è già stato completato
  const checkIfCompletedToday = () => {
    const today = new Date().toDateString();
    const completedToday = localStorage.getItem(`checkin-completed-${today}`);
    return completedToday === 'true';
  };

  // Inizializza lo stato di completamento
  React.useEffect(() => {
    setIsCompleted(checkIfCompletedToday());
  }, []);

  // Determina quale blocco usare in base al giorno (ciclo di 3)
  const getBlockType = (day: number): 'time' | 'control' | 'emotion' => {
    const blockIndex = (day - 1) % 3;
    return ['time', 'control', 'emotion'][blockIndex] as 'time' | 'control' | 'emotion';
  };

  const blockType = getBlockType(day);

  const getBlockConfig = () => {
    switch (blockType) {
      case 'time':
        return {
          title: 'Tempo & Utilizzo Digitale',
          icon: Smartphone,
          questions: [
            {
              id: 'screenTime',
              text: 'Quanto tempo totale hai passato sui dispositivi oggi?',
              options: ['Meno di 2h', '2–4h', '4–6h', '6–8h', 'Oltre 8h']
            },
            {
              id: 'phonePickups',
              text: 'Quante volte hai preso il telefono oggi (approssimativo)?',
              options: ['0–20', '21–50', '51–80', '81–120', 'Oltre 120']
            },
            {
              id: 'socialTime',
              text: 'Tempo sui social media oggi?',
              options: ['0–15 min', '15–45 min', '45–90 min', '90–180 min', 'Oltre 3h']
            },
            {
              id: 'deepWork',
              text: 'Ore consecutive senza dispositivi per attività produttive?',
              options: ['0–30 min', '30–60 min', '1–2h', '2–4h', 'Oltre 4h']
            },
            {
              id: 'qualityTime',
              text: 'Tempo di qualità con persone/hobby senza dispositivi?',
              options: ['0–30 min', '30–60 min', '1–2h', '2–4h', 'Oltre 4h']
            }
          ]
        };
      case 'control':
        return {
          title: 'Controllo & Comportamenti Digitali',
          icon: Shield,
          questions: [
            {
              id: 'impulseControl',
              text: 'Quante volte hai resistito all\'impulso di aprire il telefono?',
              options: ['0 volte', '1–3 volte', '4–7 volte', '8–12 volte', 'Oltre 12']
            },
            {
              id: 'notificationResponse',
              text: 'Tempo medio di risposta alle notifiche non urgenti?',
              options: ['Immediato', '5–15 min', '30–60 min', '1–3h', 'Oltre 3h']
            },
            {
              id: 'mindfulUsage',
              text: 'Percentuale di utilizzo dispositivi con intenzione specifica?',
              options: ['0–20%', '21–40%', '41–60%', '61–80%', '81–100%']
            },
            {
              id: 'procrastination',
              text: 'Attività importanti rimandate a causa dei dispositivi?',
              options: ['Nessuna', '1 attività', '2–3 attività', '4–5 attività', 'Oltre 5']
            },
            {
              id: 'digitalBreaks',
              text: 'Pause volontarie da dispositivi durante il giorno?',
              options: ['0 pause', '1–2 pause', '3–4 pause', '5–7 pause', 'Oltre 7']
            }
          ]
        };
      case 'emotion':
        return {
          title: 'Benessere & Produttività',
          icon: Heart,
          questions: [
            {
              id: 'focusQuality',
              text: 'Livello di concentrazione medio durante attività importanti?',
              options: ['Molto basso', 'Basso', 'Medio', 'Alto', 'Molto alto']
            },
            {
              id: 'stressLevel',
              text: 'Livello di stress/ansia legato ai dispositivi oggi?',
              options: ['Nullo', 'Basso', 'Moderato', 'Alto', 'Molto alto']
            },
            {
              id: 'sleepQuality',
              text: 'Qualità del sonno della scorsa notte (1-5)?',
              options: ['1 - Pessima', '2 - Scarsa', '3 - Sufficiente', '4 - Buona', '5 - Ottima']
            },
            {
              id: 'realWorldActivities',
              text: 'Attività offline significative completate oggi?',
              options: ['Nessuna', '1 attività', '2–3 attività', '4–5 attività', 'Oltre 5']
            },
            {
              id: 'dopamineAwareness',
              text: 'Consapevolezza delle ricerche di stimoli digitali istantanei?',
              options: ['Per niente', 'Poco', 'Moderata', 'Alta', 'Molto alta']
            }
          ]
        };
      default:
        return getBlockConfig();
    }
  };

  const config = getBlockConfig();

  const handleSubmit = () => {
    const requiredQuestions = config.questions.filter(q => q.type !== 'textarea');
    const missingAnswers = requiredQuestions.some(q => !answers[q.id]);

    if (missingAnswers) {
      toast({
        title: "Check-in incompleto",
        description: "Rispondi a tutte le domande obbligatorie per continuare",
        variant: "destructive"
      });
      return;
    }

    // Salva il completamento di oggi
    const today = new Date().toDateString();
    localStorage.setItem(`checkin-completed-${today}`, 'true');
    
    setIsCompleted(true);
    onComplete(answers);
    
    toast({
      title: "Check-in completato!",
      description: "Il tuo progresso è stato registrato",
      variant: "default"
    });
  };

  const IconComponent = config.icon;

  // Calcola quanto tempo manca al prossimo check-in (mezzanotte)
  const getTimeUntilNextCheckin = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  // Se già completato, mostra messaggio
  if (isCompleted) {
    const { hours, minutes } = getTimeUntilNextCheckin();
    
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Check-in di oggi completato!
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Hai già completato il tuo check-in quotidiano.
          </p>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium text-foreground">
              Prossimo check-in disponibile tra:
            </p>
            <p className="text-lg font-bold text-primary mt-1">
              {hours}h {minutes}m
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Torna domani per continuare il tuo percorso
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
        {config.questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <Label className="text-foreground font-medium text-sm">
              {question.text}
            </Label>
            
            {question.type === 'textarea' ? (
              <Textarea
                placeholder={question.placeholder}
                value={answers[question.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                className="min-h-[80px] bg-background border-border rounded-xl resize-none"
              />
            ) : (
              <RadioGroup 
                value={answers[question.id] || ''} 
                onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
              >
                <div className={`grid gap-2 ${question.options && question.options.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {question.options?.map((option) => (
                    <Label 
                      key={option}
                      className="flex items-center space-x-2 p-3 border border-border rounded-xl cursor-pointer hover:border-primary bg-card text-foreground transition-colors"
                    >
                      <RadioGroupItem value={option} className="text-primary" />
                      <span>{option}</span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
        ))}

        <Button 
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-full mt-6"
          disabled={config.questions.filter(q => q.type !== 'textarea').some(q => !answers[q.id])}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completa Check-in
        </Button>
    </div>
  );
};

export default DailyProgressQuiz;