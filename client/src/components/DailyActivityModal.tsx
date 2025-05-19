import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChallengeDay, CompletionStatus } from '../types';
import { useToast } from '@/hooks/use-toast';

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
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-white">Obiettivo di oggi</h3>
          <p className="text-primary mb-4">{challenge.description}</p>
          
          <h3 className="font-semibold mb-2 text-white">Perché è importante</h3>
          <p className="text-primary mb-4">
            {tip || "Questo esercizio ti aiuta a riconnetterti con attività che ti davano gioia e soddisfazione reale, invece che la gratificazione immediata ma vuota dello scrolling."}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-white">Scrivi le tue riflessioni</h3>
          <Textarea
            className="h-36 bg-neutral-700 border-neutral-600 text-white placeholder:text-white/50"
            placeholder="Come ti sei sentito/a durante questa attività? Cosa hai imparato? Quali differenze hai notato rispetto allo scrolling?"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold mb-2 text-white">Hai completato l'attività?</h3>
          <RadioGroup 
            value={completionStatus} 
            onValueChange={(val) => setCompletionStatus(val as CompletionStatus)}
          >
            <div className="flex flex-col space-y-2">
              <Label className="flex items-center space-x-2 p-3 border border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 bg-neutral-700 text-white">
                <RadioGroupItem value="yes" className="text-secondary border-secondary" />
                <span>Sì, ho completato l'attività con successo</span>
              </Label>
              <Label className="flex items-center space-x-2 p-3 border border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 bg-neutral-700 text-white">
                <RadioGroupItem value="partial" className="text-secondary border-secondary" />
                <span>Ho provato ma non sono riuscito/a completamente</span>
              </Label>
              <Label className="flex items-center space-x-2 p-3 border border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700 bg-neutral-700 text-white">
                <RadioGroupItem value="no" className="text-secondary border-secondary" />
                <span>No, riproverò domani</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          className="w-full bg-secondary hover:bg-secondary/90 text-white" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvataggio...' : `Completa Giorno ${challenge.day}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DailyActivityModal;
