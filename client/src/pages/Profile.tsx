import React from 'react';
import { Clock, Award, BookOpen, CalendarDays, BarChart, User, LogOut, Store, Mail, RotateCcw, Brain, Target } from 'lucide-react';
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
  const [dailyCheckIns] = useLocalStorage<Record<number, any>>('daily-checkins', {});
  const [emergencyStats] = useLocalStorage<any>('emergency-stats', { totalUsage: 0 });

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

  const handleResetOnboarding = async () => {
    try {
      // Reset dati server
      await apiRequest('POST', '/api/auth/reset-profile', {});
      
      // Reset dati locali
      localStorage.removeItem('digital-detox-profile');
      localStorage.removeItem('digital-detox-progress');
      localStorage.removeItem('temp-onboarding-data');
      localStorage.removeItem('daily-checkins');
      localStorage.removeItem('emergency-stats');
      
      toast({
        title: "Profilo resettato",
        description: "Riavvia per rifare l'onboarding",
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Problema durante il reset",
        variant: "destructive",
      });
    }
  };
  
  // Calculate stats from all sources
  const completedDays = progress.filter(day => day.completed).length;
  const percentComplete = Math.round((completedDays / 30) * 100);
  
  // Calcola tempo recuperato totale da tutte le fonti
  const timeRecovered = (() => {
    // Tempo dalle sfide completate
    const challengeTime = progress
      .filter(day => day.completed && day.timeSpent)
      .reduce((total, day) => total + (day.timeSpent || 0), 0);
    
    // Tempo stimato dai check-in (basato su riduzione uso telefono)
    const checkInTime = Object.values(dailyCheckIns).reduce((total, day: any) => {
      if (day.screenTime) {
        switch (day.screenTime) {
          case 'Meno di 2h': return total + 120; // 2h risparmiate rispetto a media 4h
          case '2–4h': return total + 60; // 1h risparmiata
          case '4–6h': return total + 30; // 30min risparmiate
          case '6–8h': return total + 0; // nessun risparmio
          case 'Oltre 8h': return total + 0; // nessun risparmio
          default: return total;
        }
      }
      return total;
    }, 0);
    
    // Tempo dalle sessioni di emergenza (stima 5min per utilizzo strumento)
    const emergencyTime = (emergencyStats?.totalUsage || 0) * 5;
    
    return challengeTime + checkInTime + emergencyTime;
  })();
  
  const reflectionsCount = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;
  
  // Calcola controllo digitale medio invece di streak
  const digitalControlScore = (() => {
    const totalCheckIns = Object.keys(dailyCheckIns).length;
    if (totalCheckIns === 0) return 0;
    
    let totalScore = 0;
    Object.values(dailyCheckIns).forEach((day: any) => {
      let dayScore = 0;
      
      // Punteggio tempo schermo (0-100)
      switch (day.screenTime) {
        case 'Meno di 2h': dayScore += 100; break;
        case '2–4h': dayScore += 80; break;
        case '4–6h': dayScore += 60; break;
        case '6–8h': dayScore += 40; break;
        case 'Oltre 8h': dayScore += 20; break;
      }
      
      // Punteggio controllo impulsi (0-100)
      switch (day.impulseControl) {
        case 'Oltre 12': dayScore += 100; break;
        case '8–12 volte': dayScore += 80; break;
        case '4–7 volte': dayScore += 60; break;
        case '1–3 volte': dayScore += 40; break;
        case '0 volte': dayScore += 20; break;
      }
      
      // Punteggio qualità focus (0-100)
      switch (day.focusQuality) {
        case 'Molto alto': dayScore += 100; break;
        case 'Alto': dayScore += 80; break;
        case 'Medio': dayScore += 60; break;
        case 'Basso': dayScore += 40; break;
        case 'Molto basso': dayScore += 20; break;
      }
      
      totalScore += dayScore / 3; // Media dei 3 punteggi
    });
    
    return Math.round(totalScore / totalCheckIns);
  })();


  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24 pt-8">
        {/* Profile Welcome Card */}
        <section className="mx-4 my-4">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">
                    Il tuo profilo
                  </div>
                  <div className="text-sm text-primary/70">
                    Le tue statistiche personali
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Profile Header */}
        <section className="bg-card border border-border/30 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] mx-4 my-4 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-3">
            <User className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{user?.username || user?.email?.split('@')[0] || 'Utente'}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <p className="text-muted-foreground text-xs mt-1">ScrollStop Challenge</p>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Link href="/shopify">
              <Button variant="outline" size="sm" className="w-full">
                <Store className="w-4 h-4 mr-1" />
                Shopify
              </Button>
            </Link>
            <Link href="/email">
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              onClick={handleResetOnboarding}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Esci
            </Button>
          </div>
          
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
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Controllo digitale</p>
              <p className="text-xl font-bold text-foreground">{digitalControlScore}/100</p>
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
