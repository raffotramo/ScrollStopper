import React from 'react';
import { Clock, Award, BookOpen, CalendarDays, BarChart, User, LogOut, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { DayProgress } from '@/types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      toast({
        title: "Logout effettuato",
        description: "A presto!",
      });
      window.location.reload(); // Forza il refresh per aggiornare lo stato di autenticazione
    } catch (error) {
      toast({
        title: "Errore",
        description: "Problema durante il logout",
        variant: "destructive",
      });
    }
  };
  
  // Calculate stats based on actual time spent
  const completedDays = progress.filter(day => day.completed).length;
  const percentComplete = Math.round((completedDays / 30) * 100);
  const timeRecovered = progress
    .filter(day => day.completed && day.timeSpent)
    .reduce((total, day) => total + (day.timeSpent || 0), 0);
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


  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="mx-4 mt-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Il tuo profilo
          </h1>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Profile Header */}
        <section className="bg-card border border-border/30 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] mx-4 my-4 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-3">
            <User className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{user?.username || user?.email?.split('@')[0] || 'Utente'}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <p className="text-muted-foreground text-xs mt-1">ScrollStop Challenge</p>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm"
            className="mt-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Esci
          </Button>
          
          <div className="mt-4 py-4 px-6 bg-background border border-border/30 rounded-xl mx-auto max-w-xs">
            <div className="flex justify-between items-center">
              <span className="text-foreground">Progresso</span>
              <span className="font-medium text-primary">{percentComplete}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300" 
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="mx-4 my-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <BarChart className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Le tue statistiche</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Giorni completati</p>
              <p className="text-xl font-bold text-foreground">{completedDays}/30</p>
            </div>
            
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Serie corrente</p>
              <p className="text-xl font-bold text-foreground">{currentStreak}</p>
            </div>
            
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Tempo recuperato</p>
              <p className="text-xl font-bold text-foreground">
                {timeRecovered >= 60 
                  ? `${(timeRecovered / 60).toFixed(1)}h` 
                  : `${timeRecovered}m`}
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-4 border border-border/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Riflessioni</p>
              <p className="text-xl font-bold text-foreground">{reflectionsCount}</p>
            </div>
          </div>
        </section>

      </main>



      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  );
};

export default Profile;
