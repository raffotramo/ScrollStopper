import React from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Award } from 'lucide-react';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
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
      {/* Header with ScrollStop Logo */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        {/* Current Challenge Overview */}
        <section className="bg-card border border-border/30 rounded-2xl shadow-sm mx-4 my-4 p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <CalendarIcon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {format(today, 'MMMM yyyy', { locale: it })}
            </h2>
          </div>
          
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground font-medium">{day}</div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Fill in empty spaces for first week */}
            {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, index) => (
              <div key={`empty-start-${index}`} className="aspect-square"></div>
            ))}
            
            {/* Calendar days */}
            {daysInMonth.map((date, index) => {
              const challengeDay = getChallengeDay(date);
              const isToday = date.toDateString() === today.toDateString();
              
              let className = "aspect-square flex items-center justify-center text-sm font-medium rounded-xl transition-all duration-200 ";
              
              if (challengeDay) {
                // Challenge days styling
                if (isToday) {
                  className += "bg-primary text-primary-foreground shadow-md hover:shadow-lg transform hover:scale-105";
                } else if (isDayCompleted(challengeDay)) {
                  className += "bg-primary/15 text-primary border border-primary/30 shadow-sm";
                } else if (isDayMissed(challengeDay)) {
                  className += "bg-destructive/10 text-destructive border border-destructive/30";
                } else {
                  // Future challenge days
                  className += "bg-card text-primary border border-border/50 hover:border-primary/30";
                }
              } else {
                // Non-challenge days
                className += isToday ? "bg-background text-foreground font-semibold border border-border" : "text-muted-foreground/60";
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
        <section className="bg-card border border-border/30 rounded-2xl shadow-sm mx-4 my-4 p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Le tue sfide</h2>
          </div>
          
          <div className="space-y-3">
            {challenges.map((challenge) => {
              const isCompleted = isDayCompleted(challenge.day);
              const isMissed = isDayMissed(challenge.day);
              const isCurrent = challenge.day === currentDay;
              const isFuture = challenge.day > currentDay;
              
              let statusClass = "";
              let statusText = "";
              let borderClass = "";
              
              if (isCompleted) {
                statusClass = "bg-primary/15 text-primary border border-primary/30";
                statusText = "Completato";
                borderClass = "border-l-primary";
              } else if (isMissed) {
                statusClass = "bg-destructive/15 text-destructive border border-destructive/30";
                statusText = "Mancato";
                borderClass = "border-l-destructive";
              } else if (isCurrent) {
                statusClass = "bg-primary/15 text-primary border border-primary/30";
                statusText = "Oggi";
                borderClass = "border-l-primary";
              } else if (isFuture) {
                statusClass = "bg-background text-muted-foreground/70 border border-border/50";
                statusText = "In arrivo";
                borderClass = "border-l-border";
              }
              
              return (
                <div 
                  key={challenge.day} 
                  className={`p-4 border-l-4 ${borderClass} bg-background rounded-xl border border-border/30 transition-colors`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${isCompleted ? 'text-primary' : isMissed ? 'text-destructive' : isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                        Giorno {challenge.day}
                      </span>
                      <span className={`ml-3 text-xs px-2 py-1 rounded-full ${statusClass}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                  <p className={`mt-2 text-sm ${isFuture && !isCurrent ? 'text-muted-foreground/60' : 'text-foreground'}`}>{challenge.title}</p>
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
