import React, { useEffect, useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import AchievementSystem from '@/components/AchievementSystem';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress, UserStats, Achievement } from '../types';
import { ALL_ACHIEVEMENTS, checkAchievements, calculateLevel, ACHIEVEMENT_CATEGORIES } from '../lib/achievements';
import { useToast } from '@/hooks/use-toast';

const Achievements: React.FC = () => {
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
      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24 pt-8">
        {/* Achievements Welcome Card */}
        <section className="mx-4 my-4">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-600/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600">
                    Achievements
                  </div>
                  <div className="text-sm text-amber-600/70">
                    I tuoi traguardi conquistati
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mx-4 space-y-4">
          <AchievementSystem 
            userStats={{
              totalStars: userStats.totalStars,
              level: userStats.level,
              pointsToNextLevel: userStats.pointsToNextLevel,
              achievements: userStats.achievements
            }}
            allAchievements={userStats.achievements}
          />
        </div>
      </main>

      <TabNavigation />
    </div>
  );
};

export default Achievements;