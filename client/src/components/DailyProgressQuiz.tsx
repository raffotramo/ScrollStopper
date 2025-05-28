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
  const { toast } = useToast();

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
          title: 'Tempo & Scroll Consapevole',
          icon: Smartphone,
          questions: [
            {
              id: 'phoneTime',
              text: 'Quanto tempo hai trascorso oggi con il telefono in mano?',
              options: ['Meno di 1h', '1–2h', '2–3h', 'Più di 3h']
            },
            {
              id: 'phoneChecks',
              text: 'Quante volte hai preso il telefono senza sapere perché?',
              options: ['0–2', '3–5', '6+']
            },
            {
              id: 'socialTime',
              text: 'Quanto tempo hai passato oggi sui social (stimato)?',
              options: ['Meno di 15 min', '15–30 min', '30–60 min', 'Oltre 1h']
            },
            {
              id: 'ignoredNotifications',
              text: 'Hai ignorato una notifica invece di aprirla subito?',
              options: ['Sì', 'No']
            },
            {
              id: 'timeUsed',
              text: 'Come hai usato il tempo che hai risparmiato evitando lo scroll?',
              type: 'textarea',
              placeholder: 'Esempio: ho letto, ho camminato, ho parlato con qualcuno'
            }
          ]
        };
      case 'control':
        return {
          title: 'Autocontrollo & Impulsi Digitali',
          icon: Shield,
          questions: [
            {
              id: 'scrollImpulse',
              text: 'Hai sentito l\'impulso di scrollare senza motivo oggi?',
              options: ['Mai', 'Una volta', 'Più volte']
            },
            {
              id: 'resistedImpulse',
              text: 'Hai resistito almeno una volta all\'impulso di aprire un social?',
              options: ['Sì', 'No']
            },
            {
              id: 'completedActivity',
              text: 'Hai completato l\'attività anti-scroll del giorno proposta dall\'app?',
              options: ['Sì', 'No', 'In parte']
            },
            {
              id: 'difficulty',
              text: 'Quanto è stato difficile non prendere il telefono nei momenti "vuoti"?',
              options: ['Per niente', 'Un po\'', 'Molto']
            },
            {
              id: 'presence',
              text: 'Ti sei sentito più presente durante la giornata rispetto a ieri?',
              options: ['Sì', 'No', 'Non saprei']
            }
          ]
        };
      case 'emotion':
        return {
          title: 'Emozioni & Soddisfazione Personale',
          icon: Heart,
          questions: [
            {
              id: 'dailyFeeling',
              text: 'Come ti sei sentitə durante la maggior parte del tempo oggi?',
              options: ['Calmo/a e concentrato/a', 'Neutro/a', 'Distratto/a o ansioso/a']
            },
            {
              id: 'realEnergy',
              text: 'Hai fatto qualcosa oggi che ti ha dato energia reale (non digitale)?',
              options: ['Sì', 'No', 'Non ricordo']
            },
            {
              id: 'timeSatisfaction',
              text: 'Quanto sei soddisfattə di come hai usato il tuo tempo oggi?',
              options: ['Molto', 'Abbastanza', 'Poco']
            },
            {
              id: 'missing',
              text: 'Cosa ti è mancato di più nel non scrollare (se qualcosa)?',
              type: 'textarea',
              placeholder: 'Esempio: aggiornamenti, "staccare la testa", noia...'
            },
            {
              id: 'phoneRelationship',
              text: 'Come definiresti oggi la tua relazione con il telefono?',
              options: ['Equilibrata', 'In miglioramento', 'Troppo presente']
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

    onComplete(answers);
    toast({
      title: "Check-in completato! 🎉",
      description: "Il tuo progresso è stato registrato",
      variant: "default"
    });
  };

  const IconComponent = config.icon;

  return (
    <Card className="bg-card border border-border rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
          {config.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Check-in Giorno {day}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
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
      </CardContent>
    </Card>
  );
};

export default DailyProgressQuiz;