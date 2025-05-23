import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Info, Clock, Award, BookOpen, Star, Lightbulb, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressCircle from '@/components/ProgressCircle';
import DailyActivityModal from '@/components/DailyActivityModal';
import DailyChallenge from '@/components/DailyChallenge';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
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
      {/* Header with ScrollStop Logo */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Progress Overview */}
        <section className="border border-gray-300 rounded-lg mx-4 my-4 p-6 bg-transparent">
          <div className="flex flex-col items-center">
            <ProgressCircle currentDay={currentDay} totalDays={30} className="mb-4" />
            <h2 className="text-lg font-semibold text-white mb-1">{todayChallenge.title}</h2>
            <p className="text-sm text-gray-300 text-center mb-4">{todayChallenge.description}</p>
            <Button 
              variant={isCurrentDayCompleted ? "outline" : "default"} 
              className={isCurrentDayCompleted ? "border-primary text-primary hover:border-primary/80" : "bg-primary hover:bg-primary/90"}
              onClick={() => setModalOpen(true)}
            >
              {isCurrentDayCompleted ? "Rivedi Attività" : "Inizia Attività di Oggi"}
            </Button>
          </div>
        </section>

        {/* Statistics */}
        <section className="border border-gray-300 rounded-lg mx-4 my-4 p-6 bg-transparent">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-white">Il tuo progresso</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-500 p-4 rounded-lg bg-transparent">
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 text-primary mr-1" />
                <p className="text-sm text-gray-300">Tempo recuperato</p>
              </div>
              <p className="text-xl font-bold text-primary">
                {timeRecovered >= 60 
                  ? `${(timeRecovered / 60).toFixed(1)} ore` 
                  : `${timeRecovered} min`}
              </p>
            </div>
            <div className="border border-gray-500 p-4 rounded-lg bg-transparent">
              <div className="flex items-center mb-1">
                <Star className="w-4 h-4 text-primary mr-1" />
                <p className="text-sm text-gray-300">Giorni completati</p>
              </div>
              <p className="text-xl font-bold text-primary">{completedDays} / 30</p>
            </div>
            <div className="border border-gray-500 p-4 rounded-lg bg-transparent">
              <div className="flex items-center mb-1">
                <Award className="w-4 h-4 text-primary mr-1" />
                <p className="text-sm text-gray-300">Serie attuale</p>
              </div>
              <p className="text-xl font-bold text-primary">{currentStreak} giorni</p>
            </div>
            <div className="border border-gray-500 p-4 rounded-lg bg-transparent">
              <div className="flex items-center mb-1">
                <BookOpen className="w-4 h-4 text-primary mr-1" />
                <p className="text-sm text-gray-300">Riflessioni scritte</p>
              </div>
              <p className="text-xl font-bold text-primary">{reflectionsCount}</p>
            </div>
          </div>
        </section>

        {/* Daily Challenges */}
        <section className="mx-4 my-4 mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-white">Il tuo percorso</h2>
            </div>
            <Button variant="link" className="text-secondary p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Today's challenge */}
          <DailyChallenge 
            challenge={todayChallenge} 
            status={isCurrentDayCompleted ? "completed" : "today"} 
            onClick={() => setModalOpen(true)} 
          />
          
          {/* Upcoming challenges */}
          {upcomingChallenges.map(challenge => (
            <DailyChallenge 
              key={`upcoming-${challenge.day}`}
              challenge={challenge}
              status="locked"
              onClick={() => {
                toast({
                  title: "Sfida non disponibile",
                  description: "Questa sfida sarà disponibile nei prossimi giorni.",
                  variant: "default"
                });
              }}
            />
          ))}
          
          {/* Completed challenges */}
          {completedChallenges.map(challenge => (
            <DailyChallenge 
              key={`completed-${challenge.day}`}
              challenge={challenge}
              status="completed"
              onClick={() => {
                // Code to view completed challenge details
                toast({
                  title: "Sfida completata",
                  description: `Hai già completato la sfida del giorno ${challenge.day}.`,
                  variant: "default"
                });
              }}
            />
          ))}
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
