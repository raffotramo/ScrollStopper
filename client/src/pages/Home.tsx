import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Info, Clock, Award, BookOpen, Star, Lightbulb, Zap, Lock as LockIcon } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import ProgressCircle from '@/components/ProgressCircle';
import DailyActivityModal from '@/components/DailyActivityModal';
import DailyChallenge from '@/components/DailyChallenge';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
import scrollStopLogo from "@assets/Progetto senza titolo (4).png";
import { challenges, getTodaysChallenge, getDailyTip } from '@/lib/challenges';
import { DayProgress, CompletionStatus } from '@/types';

const Home: React.FC = () => {
  const [progress, setProgress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Calculate current day based on completed challenges
  // Default to day 1 if no progress, or next day after last completed day
  const completedDays = progress.filter(day => day.completed).length;
  const currentDay = Math.min(completedDays + 1, 30);
  
  // Get today's challenge
  const todayChallenge = getTodaysChallenge(currentDay);
  
  // Calculate stats
  const timeRecovered = completedDays * 30; // Estimate 30 minutes per day
  
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
  
  const reflectionsCount = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;
  
  // Get daily tip
  const tip = getDailyTip(currentDay);
  
  const handleCompleteChallenge = (reflectionText: string, status: CompletionStatus) => {
    const isCompleted = status === 'yes' || status === 'partial';
    
    // Update progress for this day
    const existingProgress = progress.find(p => p.day === currentDay);
    
    if (existingProgress) {
      setProgress(
        progress.map(p => 
          p.day === currentDay 
            ? { ...p, completed: isCompleted, reflectionText, completionStatus: status, completedAt: isCompleted ? new Date() : null } 
            : p
        )
      );
    } else {
      setProgress([
        ...progress, 
        { 
          day: currentDay, 
          completed: isCompleted, 
          reflectionText, 
          completionStatus: status, 
          completedAt: isCompleted ? new Date() : null 
        }
      ]);
    }
    
    toast({
      title: isCompleted ? "Ottimo lavoro!" : "Nessun problema",
      description: isCompleted 
        ? "Hai completato con successo la sfida di oggi." 
        : "Il tuo tentativo è stato registrato. Continua a provare!",
      variant: isCompleted ? "default" : "destructive",
    });
  };
  
  const isCurrentDayCompleted = progress.some(p => p.day === currentDay && p.completed);
  
  // Get upcoming challenges (next 2)
  const upcomingChallenges = challenges
    .filter(c => c.day > currentDay && c.day <= currentDay + 2)
    .slice(0, 2);
    
  // Get most recent completed challenges (last 2)
  const completedChallenges = challenges
    .filter(c => progress.some(p => p.day === c.day && p.completed))
    .sort((a, b) => b.day - a.day)
    .slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="mx-4 mt-6 mb-2">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            ScrollStop
          </h1>
          <p className="text-foreground text-xs font-bold mb-3">
            Riprenditi il tuo tempo, riconnettiti con la vita
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Main Challenge Card */}
        <section className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] mx-4 my-4 p-6 border border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Giorno {currentDay}</h1>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">{currentDay}</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{todayChallenge.title}</h2>
          <p className="text-muted-foreground text-sm mb-6">{todayChallenge.description}</p>
          <Button 
            className={`w-full rounded-full h-12 font-semibold ${
              isCurrentDayCompleted 
                ? "bg-primary/20 text-primary border border-primary hover:bg-primary/30" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            onClick={() => setModalOpen(true)}
          >
            {isCurrentDayCompleted ? "Rivedi Attività" : "Inizia"}
          </Button>
        </section>

        {/* Statistics Grid */}
        <section className="mx-4 my-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
              <Info className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Il tuo progresso</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
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
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Giorni completati</p>
              <p className="text-xl font-bold text-foreground">{completedDays}/30</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Serie attuale</p>
              <p className="text-xl font-bold text-foreground">{currentStreak}</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Riflessioni</p>
              <p className="text-xl font-bold text-foreground">{reflectionsCount}</p>
            </div>
          </div>
        </section>

        {/* Emergency Anti-Scroll Button */}
        <section className="mx-4 my-4">
          <Link href="/emergency">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mr-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Pronto Soccorso Anti-Scroll</h3>
                    <p className="text-sm text-muted-foreground">Interrompi il ciclo automatico</p>
                  </div>
                </div>
                <div className="text-2xl">💥</div>
              </div>
            </div>
          </Link>
        </section>

        {/* Daily Challenges Calendar Grid */}
        <section className="mx-4 my-4 mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-foreground">Il tuo percorso</h2>
            </div>
          </div>
          
          {/* Calendar Grid - 3 columns */}
          <div className="grid grid-cols-3 gap-3">
            {challenges.slice(0, 15).map(challenge => {
              const isCompleted = progress.some(p => p.day === challenge.day && p.completed);
              const isToday = challenge.day === currentDay;
              const isLocked = challenge.day > currentDay;
              
              const getStatus = () => {
                if (isCompleted) return 'completed';
                if (isToday) return 'today';
                return 'locked';
              };
              
              const handleClick = () => {
                if (isToday || isCompleted) {
                  setModalOpen(true);
                } else {
                  toast({
                    title: "Sfida non disponibile",
                    description: "Questa sfida sarà disponibile nei prossimi giorni.",
                    variant: "default"
                  });
                }
              };
              
              return (
                <button
                  key={challenge.day}
                  onClick={handleClick}
                  className={`aspect-square rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200 border ${
                    isCompleted 
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-primary/15' 
                      : isToday 
                      ? 'bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transform hover:scale-105' 
                      : 'bg-card border-border/50 text-muted-foreground/60 hover:border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                  } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <div className={`text-lg font-bold mb-1 ${
                    isCompleted ? 'text-primary' : 
                    isToday ? 'text-primary-foreground' : 
                    'text-muted-foreground/50'
                  }`}>
                    {challenge.day}
                  </div>
                  <div className={`text-xs leading-tight ${
                    isCompleted ? 'text-primary/80' : 
                    isToday ? 'text-primary-foreground/90' : 
                    'text-muted-foreground/40'
                  }`}>
                    {challenge.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                  {isCompleted && (
                    <div className="mt-1">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                  )}
                  {isLocked && (
                    <div className="mt-1">
                      <LockIcon className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tips */}
        <section className="bg-neutral-700 rounded-lg shadow-sm mx-4 my-4 mb-10 p-6">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-white">Consiglio del giorno</h2>
          </div>
          <div className="bg-secondary/20 p-4 rounded-lg">
            <p className="text-white">{tip}</p>
          </div>
        </section>
      </main>

      {/* Daily Activity Modal */}
      <DailyActivityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        challenge={todayChallenge}
        onComplete={handleCompleteChallenge}
        tip={tip}
      />

      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  );
};

export default Home;
