import React, { useEffect, useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import AchievementSystem from '@/components/AchievementSystem';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress, UserStats, Achievement } from '../types';
import { ALL_ACHIEVEMENTS, checkAchievements, calculateLevel } from '../lib/achievements';
import { useToast } from '@/hooks/use-toast';

const Challenges: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const [userStats, setUserStats] = useLocalStorage<UserStats>('user-stats', {
    totalTimeRecovered: 0,
    daysCompleted: 0,
    currentStreak: 0,
    totalReflections: 0,
    totalStars: 0,
    level: 1,
    pointsToNextLevel: 20,
    achievements: ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  });

  // Calcola statistiche aggiornate
  useEffect(() => {
    const completedDays = progress.filter(day => day.completed).length;
    const timeRecovered = progress
      .filter(day => day.completed && day.timeSpent)
      .reduce((total, day) => total + (day.timeSpent || 0), 0);
    
    let currentStreak = 0;
    const progressSorted = [...progress].sort((a, b) => b.day - a.day);
    for (const day of progressSorted) {
      if (day.completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    const totalReflections = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;

    // Controlla nuovi achievement
    const { newAchievements, updatedAchievements } = checkAchievements(
      progress,
      timeRecovered,
      currentStreak,
      userStats.achievements
    );

    // Calcola stelle totali
    const totalStars = updatedAchievements
      .filter(a => a.unlocked)
      .reduce((total, a) => total + a.stars, 0);

    // Calcola livello
    const { level, pointsToNext } = calculateLevel(totalStars);

    // Mostra notifiche per nuovi achievement
    newAchievements.forEach(achievement => {
      toast({
        title: "🎉 Nuovo Achievement!",
        description: `Hai sbloccato "${achievement.name}" (+${achievement.stars} stelle)`,
        duration: 5000,
      });
    });

    // Aggiorna stats
    setUserStats({
      totalTimeRecovered: timeRecovered,
      daysCompleted: completedDays,
      currentStreak,
      totalReflections,
      totalStars,
      level,
      pointsToNextLevel: pointsToNext,
      achievements: updatedAchievements
    });
  }, [progress, toast]);

  return (
    <div className="min-h-screen bg-[#eeeded] pb-20">
      {/* Header */}
      <section className="mx-4 mt-6 mb-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-600">
              Challenge
            </h1>
          </div>
          <p className="text-foreground text-sm font-bold mb-3">
            Conquista obiettivi e sblocca achievement
          </p>
          <div className="w-20 h-1 bg-amber-600 rounded-full mx-auto"></div>
        </div>
      </section>

      <main className="p-4 space-y-6">

        <AchievementSystem 
          userStats={{
            totalStars: userStats.totalStars,
            level: userStats.level,
            pointsToNextLevel: userStats.pointsToNextLevel,
            achievements: userStats.achievements
          }}
          allAchievements={userStats.achievements}
        />
      </main>

      <TabNavigation />
    </div>
  );
};

export default Challenges;