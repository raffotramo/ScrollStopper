import React, { useState } from 'react';
import { Settings, FileText, Clock, Award, BookOpen, CalendarDays, FilePlus, Moon, LogOut, User, BarChart, UserCog } from 'lucide-react';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const [progress, setProgress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Calculate stats
  const completedDays = progress.filter(day => day.completed).length;
  const percentComplete = Math.round((completedDays / 30) * 100);
  const timeRecovered = completedDays * 30; // Estimate 30 minutes per day
  const reflectionsCount = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;
  
  // Determine current streak
  let currentStreak = 0;
  const progressSorted = [...progress].sort((a, b) => b.day - a.day);
  for (const day of progressSorted) {
    if (day.completed) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  const resetProgress = () => {
    setProgress([]);
    setResetDialogOpen(false);
    toast({
      title: "Progresso resettato",
      description: "Tutti i tuoi dati sono stati cancellati. Puoi iniziare di nuovo.",
      variant: "default"
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with ScrollStop Logo */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Profile Header */}
        <section className="bg-neutral-700 rounded-lg shadow-sm mx-4 my-4 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 text-secondary mb-3">
            <Award className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Digital Detox</h2>
          <p className="text-white/70">Sfida di 30 giorni</p>
          
          <div className="mt-4 py-4 px-6 bg-neutral-800 rounded-lg mx-auto max-w-xs">
            <div className="flex justify-between items-center">
              <span className="text-white">Progresso</span>
              <span className="font-medium text-secondary">{percentComplete}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-600 rounded-full mt-2">
              <div 
                className="h-full bg-secondary rounded-full" 
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="bg-neutral-700 rounded-lg shadow-sm mx-4 my-4 p-6">
          <div className="flex items-center mb-4">
            <BarChart className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-white">Le tue statistiche</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                <CalendarDays className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-white">Giorni completati</p>
                  <p className="font-medium text-secondary">{completedDays} / 30</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-white">Serie corrente</p>
                  <p className="font-medium text-secondary">{currentStreak} giorni</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-white">Tempo recuperato</p>
                  <p className="font-medium text-secondary">
                    {timeRecovered >= 60 
                      ? `${(timeRecovered / 60).toFixed(1)} ore` 
                      : `${timeRecovered} min`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-white">Riflessioni</p>
                  <p className="font-medium text-secondary">{reflectionsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Settings */}
        <section className="bg-neutral-700 rounded-lg shadow-sm mx-4 my-4 p-6 mb-10">
          <div className="flex items-center mb-4">
            <UserCog className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-white">Impostazioni</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                  <Moon className="h-5 w-5 text-white" />
                </div>
                <Label htmlFor="dark-mode" className="text-white">Tema scuro</Label>
              </div>
              <Switch id="dark-mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                  <FilePlus className="h-5 w-5 text-white" />
                </div>
                <Label htmlFor="notifications" className="text-white">Notifiche</Label>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full mt-6"
              onClick={() => setResetDialogOpen(true)}
            >
              Reset Progresso
            </Button>
          </div>
        </section>
      </main>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resettare tutti i progressi?</DialogTitle>
            <DialogDescription>
              Questa azione cancellerà tutto il tuo progresso e le tue riflessioni. Non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={resetProgress}>
              Sì, resetta tutto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  );
};

export default Profile;
