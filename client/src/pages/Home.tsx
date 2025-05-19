import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressCircle from '@/components/ProgressCircle';
import DailyActivityModal from '@/components/DailyActivityModal';
import DailyChallenge from '@/components/DailyChallenge';
import TabNavigation from '@/components/TabNavigation';
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
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Digital Detox</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Progress Overview */}
        <section className="bg-white rounded-lg shadow-sm mx-4 my-4 p-6">
          <div className="flex flex-col items-center">
            <ProgressCircle currentDay={currentDay} totalDays={30} className="mb-4" />
            <h2 className="text-lg font-semibold text-neutral-800 mb-1">{todayChallenge.title}</h2>
            <p className="text-sm text-neutral-600 text-center mb-4">{todayChallenge.description}</p>
            <Button 
              variant={isCurrentDayCompleted ? "outline" : "default"} 
              className={isCurrentDayCompleted ? "border-secondary text-secondary" : ""}
              onClick={() => setModalOpen(true)}
            >
              {isCurrentDayCompleted ? "Rivedi Attività" : "Inizia Attività di Oggi"}
            </Button>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-white rounded-lg shadow-sm mx-4 my-4 p-6">
          <h2 className="text-lg font-semibold mb-4">Il tuo progresso</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-500">Tempo recuperato</p>
              <p className="text-xl font-bold text-neutral-800">
                {timeRecovered >= 60 
                  ? `${(timeRecovered / 60).toFixed(1)} ore` 
                  : `${timeRecovered} min`}
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-500">Giorni completati</p>
              <p className="text-xl font-bold text-neutral-800">{completedDays} / 30</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-500">Serie attuale</p>
              <p className="text-xl font-bold text-neutral-800">{currentStreak} giorni</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-500">Riflessioni scritte</p>
              <p className="text-xl font-bold text-neutral-800">{reflectionsCount}</p>
            </div>
          </div>
        </section>

        {/* Image Feature */}
        <div className="mx-4 my-6 rounded-xl overflow-hidden shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
            alt="Person reading a book, taking time away from screens" 
            className="w-full h-40 object-cover" 
          />
          <div className="bg-white p-4">
            <h3 className="font-semibold text-neutral-800">Mindfulness quotidiana</h3>
            <p className="text-sm text-neutral-600">Riscopri il piacere delle attività senza schermi e riconnettiti con te stesso.</p>
          </div>
        </div>

        {/* Daily Challenges */}
        <section className="mx-4 my-4 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Il tuo percorso</h2>
            <Button variant="link" className="text-primary p-0">
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
        <section className="bg-white rounded-lg shadow-sm mx-4 my-4 mb-10 p-6">
          <h2 className="text-lg font-semibold mb-3">Consiglio del giorno</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-neutral-700">{tip}</p>
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
