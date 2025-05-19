import React from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import TabNavigation from '@/components/TabNavigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';
import { challenges, getTodaysChallenge } from '@/lib/challenges';

const TOTAL_DAYS = 30;

const Calendar: React.FC = () => {
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const today = new Date();
  
  // Calculate current day based on completed challenges
  // Default to day 1 if no progress, or next day after last completed day
  const completedDays = progress.filter(day => day.completed).length;
  const currentDay = Math.min(completedDays + 1, TOTAL_DAYS);
  
  // Calculate start date of the challenge (today - current day index)
  const startDate = addDays(today, -(currentDay - 1));
  
  // Generate days for the current month
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the challenge day for a specific date
  const getChallengeDay = (date: Date): number | null => {
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays > 0 && diffDays <= TOTAL_DAYS) {
      return diffDays;
    }
    
    return null;
  };
  
  // Check if a challenge day is completed
  const isDayCompleted = (day: number): boolean => {
    return progress.some(p => p.day === day && p.completed);
  };
  
  // Check if a challenge day was missed (past day, not completed)
  const isDayMissed = (day: number): boolean => {
    const dayDate = addDays(startDate, day - 1);
    return dayDate < today && !isDayCompleted(day);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Calendario</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Current Challenge Overview */}
        <section className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <h2 className="text-lg font-semibold mb-4">
            {format(today, 'MMMM yyyy', { locale: it })}
          </h2>
          
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-xs text-neutral-500">{day}</div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Fill in empty spaces for first week */}
            {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, index) => (
              <div key={`empty-start-${index}`} className="aspect-square"></div>
            ))}
            
            {/* Calendar days */}
            {daysInMonth.map((date, index) => {
              const challengeDay = getChallengeDay(date);
              const isToday = date.toDateString() === today.toDateString();
              
              let className = "aspect-square flex items-center justify-center text-sm ";
              
              if (challengeDay) {
                // Challenge days styling
                if (isToday) {
                  className += "rounded-full bg-primary text-white font-bold border-2 border-blue-400";
                } else if (isDayCompleted(challengeDay)) {
                  className += "rounded-full bg-secondary text-white";
                } else if (isDayMissed(challengeDay)) {
                  className += "rounded-full bg-destructive bg-opacity-10 text-destructive";
                } else {
                  // Future challenge days
                  className += "text-neutral-400";
                }
              } else {
                // Non-challenge days
                className += isToday ? "font-semibold text-neutral-800" : "text-neutral-400";
              }
              
              return (
                <div key={`day-${index}`} className={className}>
                  {date.getDate()}
                </div>
              );
            })}
            
            {/* Fill in empty spaces for last week */}
            {Array.from({ length: monthEnd.getDay() === 0 ? 0 : 7 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="aspect-square"></div>
            ))}
          </div>
        </section>
        
        {/* Challenge List */}
        <section className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <h2 className="text-lg font-semibold mb-4">Le tue sfide</h2>
          
          <div className="space-y-3">
            {challenges.map((challenge) => {
              const isCompleted = isDayCompleted(challenge.day);
              const isMissed = isDayMissed(challenge.day);
              const isCurrent = challenge.day === currentDay;
              const isFuture = challenge.day > currentDay;
              
              let statusClass = "";
              let statusText = "";
              
              if (isCompleted) {
                statusClass = "bg-secondary bg-opacity-10 text-secondary";
                statusText = "Completato";
              } else if (isMissed) {
                statusClass = "bg-destructive bg-opacity-10 text-destructive";
                statusText = "Mancato";
              } else if (isCurrent) {
                statusClass = "bg-primary bg-opacity-10 text-primary";
                statusText = "Oggi";
              } else if (isFuture) {
                statusClass = "bg-neutral-100 text-neutral-500";
                statusText = "In arrivo";
              }
              
              return (
                <div 
                  key={challenge.day} 
                  className={`p-3 border-l-2 ${isCompleted ? 'border-secondary' : isMissed ? 'border-destructive' : isCurrent ? 'border-primary' : 'border-neutral-200'}`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${isCompleted ? 'text-secondary' : isMissed ? 'text-destructive' : isCurrent ? 'text-primary' : 'text-neutral-400'}`}>
                        Giorno {challenge.day}
                      </span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusClass}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                  <p className={`mt-1 ${isFuture && !isCurrent ? 'text-neutral-400' : 'text-neutral-800'}`}>{challenge.title}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  );
};

export default Calendar;
