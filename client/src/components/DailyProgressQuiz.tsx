import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizData {
  phoneChecks: string;
  socialTime: string;
  moodChange: string;
}

interface DailyProgressQuizProps {
  onComplete: (data: QuizData) => void;
  day: number;
}

const DailyProgressQuiz: React.FC<DailyProgressQuizProps> = ({ onComplete, day }) => {
  const [answers, setAnswers] = useState<QuizData>({
    phoneChecks: '',
    socialTime: '',
    moodChange: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!answers.phoneChecks || !answers.socialTime || !answers.moodChange) {
      toast({
        title: "Quiz incompleto",
        description: "Rispondi a tutte le domande per continuare",
        variant: "destructive"
      });
      return;
    }

    onComplete(answers);
    toast({
      title: "Quiz completato! 🎉",
      description: "Il tuo progresso è stato registrato",
      variant: "default"
    });
  };

  const getScoreEmoji = () => {
    const scores = {
      phoneChecks: answers.phoneChecks === '0-2' ? 3 : answers.phoneChecks === '3-5' ? 2 : answers.phoneChecks === '6-10' ? 1 : 0,
      socialTime: answers.socialTime === 'meno-30' ? 3 : answers.socialTime === '30-60' ? 2 : answers.socialTime === '1-2h' ? 1 : 0,
      moodChange: answers.moodChange === 'calmo' ? 3 : answers.moodChange === 'uguale' ? 2 : 1
    };
    
    const total = scores.phoneChecks + scores.socialTime + scores.moodChange;
    if (total >= 8) return '🌟';
    if (total >= 6) return '💪';
    if (total >= 4) return '👍';
    return '🌱';
  };

  return (
    <Card className="border border-gray-300 bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Check-in Giorno {day}
        </CardTitle>
        <p className="text-gray-300 text-sm flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Meno di 1 minuto
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Domanda 1 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">
            Quante volte hai preso il telefono senza un vero motivo?
          </Label>
          <RadioGroup 
            value={answers.phoneChecks} 
            onValueChange={(value) => setAnswers(prev => ({ ...prev, phoneChecks: value }))}
          >
            <div className="grid grid-cols-2 gap-2">
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="0-2" className="text-primary" />
                <span>0-2</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="3-5" className="text-primary" />
                <span>3-5</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="6-10" className="text-primary" />
                <span>6-10</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="10+" className="text-primary" />
                <span>+10</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Domanda 2 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">
            Quanto tempo stimato hai passato oggi sui social?
          </Label>
          <RadioGroup 
            value={answers.socialTime} 
            onValueChange={(value) => setAnswers(prev => ({ ...prev, socialTime: value }))}
          >
            <div className="grid grid-cols-2 gap-2">
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="meno-30" className="text-primary" />
                <span>&lt; 30 min</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="30-60" className="text-primary" />
                <span>30-60 min</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="1-2h" className="text-primary" />
                <span>1-2h</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="2h+" className="text-primary" />
                <span>+2h</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Domanda 3 */}
        <div className="space-y-2">
          <Label className="text-white font-medium">
            Come ti senti ora rispetto a stamattina?
          </Label>
          <RadioGroup 
            value={answers.moodChange} 
            onValueChange={(value) => setAnswers(prev => ({ ...prev, moodChange: value }))}
          >
            <div className="space-y-2">
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="calmo" className="text-primary" />
                <span>Più calmo/a</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="uguale" className="text-primary" />
                <span>Uguale</span>
              </Label>
              <Label className="flex items-center space-x-2 p-2 border border-gray-500 rounded cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="nervoso" className="text-primary" />
                <span>Più nervoso/a</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
          disabled={!answers.phoneChecks || !answers.socialTime || !answers.moodChange}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completa Check-in {getScoreEmoji()}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyProgressQuiz;