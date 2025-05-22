import React, { useState } from 'react';
import { X, Clock, CheckCircle, Lightbulb, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChallengeDay, CompletionStatus } from '../types';
import { useToast } from '@/hooks/use-toast';
import Timer from './Timer';

interface DailyActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: ChallengeDay;
  onComplete: (reflectionText: string, status: CompletionStatus) => void;
  tip?: string;
}

const DailyActivityModal: React.FC<DailyActivityModalProps> = ({
  open,
  onOpenChange,
  challenge,
  onComplete,
  tip
}) => {
  const [reflectionText, setReflectionText] = useState('');
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!completionStatus) {
      toast({
        title: "Seleziona un'opzione",
        description: "Per favore, seleziona un'opzione per completare l'attività",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      onComplete(reflectionText, completionStatus);
      setIsSubmitting(false);
      toast({
        title: "Attività completata",
        description: "Il tuo progresso è stato salvato con successo!",
        variant: "default"
      });
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-secondary">Giorno {challenge.day}: {challenge.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:text-white/80">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Activity Description */}
          <div className="border border-gray-300 rounded-lg p-4 bg-transparent">
            <h3 className="font-semibold mb-2 text-white">Attività di oggi</h3>
            <p className="text-gray-200">{challenge.description}</p>
          </div>

          {/* Timer Section - Compact */}
          {challenge.timeRequired && challenge.timeRequired > 0 && (
            <div className="border border-gray-300 rounded-lg p-3 bg-transparent">
              <h3 className="font-medium mb-2 text-white text-sm">Timer ({challenge.timeRequired} min)</h3>
              <Timer 
                timeRequired={challenge.timeRequired} 
                onComplete={() => {
                  toast({
                    title: "Timer completato!",
                    description: "Ora puoi completare la tua riflessione.",
                    variant: "default"
                  });
                }}
              />
            </div>
          )}

          {/* Reflection Section */}
          {challenge.reflection && (
            <div className="border border-gray-300 rounded-lg p-4 bg-transparent">
              <h3 className="font-semibold mb-2 text-white">Domanda di riflessione</h3>
              <p className="text-gray-200 italic">"{challenge.reflection}"</p>
            </div>
          )}
        </div>
        
        {/* Reflection Input */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-transparent">
          <h3 className="font-semibold mb-3 text-white">Le tue riflessioni</h3>
          <Textarea
            className="min-h-24 bg-neutral-700 border-gray-500 text-white placeholder:text-gray-400"
            placeholder={challenge.reflection ? `Rifletti su: ${challenge.reflection}` : "Come ti sei sentito/a durante questa attività? Cosa hai imparato?"}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
          />
        </div>
        
        {/* Completion Status */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-transparent">
          <h3 className="font-semibold mb-3 text-white">Hai completato l'attività?</h3>
          <RadioGroup 
            value={completionStatus} 
            onValueChange={(val) => setCompletionStatus(val as CompletionStatus)}
          >
            <div className="flex flex-col space-y-2">
              <Label className="flex items-center space-x-3 p-2 border border-gray-500 rounded-lg cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="yes" className="text-primary border-primary" />
                <span>Sì, completato con successo</span>
              </Label>
              <Label className="flex items-center space-x-3 p-2 border border-gray-500 rounded-lg cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="partial" className="text-primary border-primary" />
                <span>Provato ma non completato</span>
              </Label>
              <Label className="flex items-center space-x-3 p-2 border border-gray-500 rounded-lg cursor-pointer hover:border-primary bg-transparent text-white">
                <RadioGroupItem value="no" className="text-primary border-primary" />
                <span>No, riproverò domani</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-lg" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '💾 Salvataggio...' : `🎯 Completa Giorno ${challenge.day}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DailyActivityModal;
