import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Star, Trophy, Clock, Award, Share2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import TabNavigation from '@/components/TabNavigation';
import SocialShare from '@/components/SocialShare';
import DailyProgressQuiz from '@/components/DailyProgressQuiz';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress, UserStats } from '@/types';
import { ALL_ACHIEVEMENTS, calculateLevel, getLevelTitle } from '@/lib/achievements';

const ProgressPage: React.FC = () => {
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const [userStats] = useLocalStorage<UserStats>('user-stats', {
    totalTimeRecovered: 0,
    daysCompleted: 0,
    currentStreak: 0,
    totalReflections: 0,
    totalStars: 0,
    level: 1,
    pointsToNextLevel: 20,
    achievements: ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  });
  const [dailyCheckIns, setDailyCheckIns] = useLocalStorage<Record<number, any>>('daily-checkins', {});

  // Calcola statistiche dettagliate
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

  const reflectionsCount = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;
  const weeklyProgress = Array.from({ length: 4 }, (_, weekIndex) => {
    const startDay = weekIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, 30);
    const weekDays = progress.filter(day => day.day >= startDay && day.day <= endDay);
    const completed = weekDays.filter(day => day.completed).length;
    return {
      week: weekIndex + 1,
      completed,
      total: endDay - startDay + 1,
      percentage: (completed / (endDay - startDay + 1)) * 100
    };
  });

  // Milestones raggiunti
  const milestones = [
    { type: 'days' as const, threshold: 7, title: '7 giorni completati', achieved: completedDays >= 7 },
    { type: 'days' as const, threshold: 14, title: '14 giorni completati', achieved: completedDays >= 14 },
    { type: 'days' as const, threshold: 21, title: '21 giorni completati', achieved: completedDays >= 21 },
    { type: 'days' as const, threshold: 30, title: '30 giorni completati', achieved: completedDays >= 30 },
    { type: 'streak' as const, threshold: 5, title: '5 giorni consecutivi', achieved: currentStreak >= 5 },
    { type: 'streak' as const, threshold: 10, title: '10 giorni consecutivi', achieved: currentStreak >= 10 },
    { type: 'stars' as const, threshold: 50, title: '50 stelle raccolte', achieved: userStats.totalStars >= 50 },
    { type: 'stars' as const, threshold: 100, title: '100 stelle raccolte', achieved: userStats.totalStars >= 100 },
  ];

  const levelProgress = userStats.pointsToNextLevel > 0 
    ? ((userStats.totalStars) / (userStats.totalStars + userStats.pointsToNextLevel)) * 100
    : 100;

  // Calcola il giorno corrente
  const currentDay = Math.min(Math.max(1, completedDays + 1), 30);

  return (
    <div className="min-h-screen bg-[#eeeded] pb-20">
      {/* Header */}
      <section className="mx-4 mt-6 mb-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-600">
              Progressi
            </h1>
          </div>
          <p className="text-foreground text-sm font-bold mb-3">
            Il tuo percorso verso il benessere digitale
          </p>
          <div className="w-20 h-1 bg-green-600 rounded-full mx-auto"></div>
        </div>
      </section>

      <main className="p-4 space-y-6">
        {/* Come funziona */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-600" />
              Come funziona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Completa le sfide giornaliere</p>
                  <p className="text-xs text-muted-foreground">
                    Ogni giorno sblocca una nuova attività per ridurre il tempo schermo
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Accumula stelle e livelli</p>
                  <p className="text-xs text-muted-foreground">
                    Ogni attività completata ti fa guadagnare stelle e sbloccare achievement
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Monitora i tuoi progressi</p>
                  <p className="text-xs text-muted-foreground">
                    Fai il check-in quotidiano e traccia il tuo percorso di benessere digitale
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Check-in Quiz */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Check-in giornaliero</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyProgressQuiz 
              day={currentDay} 
              onComplete={(data) => {
                console.log('Daily check-in completed:', data);
                setDailyCheckIns(prev => ({
                  ...prev,
                  [currentDay]: {
                    ...data,
                    completedAt: new Date().toISOString()
                  }
                }));
              }} 
            />
          </CardContent>
        </Card>
        {/* Overview Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-green-800">
                Livello {userStats.level} - {getLevelTitle(userStats.level)}
              </CardTitle>
              <SocialShare 
                userStats={userStats}
                milestone={{
                  type: 'level',
                  value: userStats.level,
                  title: `Livello ${userStats.level}`
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedDays}</div>
                <div className="text-sm text-green-700">Giorni completati</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{userStats.totalStars}</div>
                <div className="text-sm text-amber-700">Stelle totali</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso livello</span>
                <span>{userStats.pointsToNextLevel} stelle al prossimo livello</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">
                {timeRecovered >= 60 
                  ? `${(timeRecovered / 60).toFixed(1)}h` 
                  : `${timeRecovered}m`}
              </div>
              <div className="text-sm text-muted-foreground">Tempo recuperato</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Serie attuale</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">
                {userStats.achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Achievement</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{reflectionsCount}</div>
              <div className="text-sm text-muted-foreground">Riflessioni</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progresso Settimanale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyProgress.map(week => (
                <div key={week.week}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Settimana {week.week}</span>
                    <span>{week.completed}/{week.total} giorni</span>
                  </div>
                  <Progress value={week.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traguardi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {milestone.achieved ? '✓' : '○'}
                    </div>
                    <span className={`font-medium ${
                      milestone.achieved ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {milestone.title}
                    </span>
                  </div>
                  {milestone.achieved && (
                    <SocialShare 
                      userStats={userStats}
                      milestone={{
                        type: milestone.type,
                        value: milestone.threshold,
                        title: milestone.title
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendario Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const dayProgress = progress.find(p => p.day === day);
                const isCompleted = dayProgress?.completed || false;
                
                return (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : day <= completedDays + 1
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completato</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <span>Disponibile</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
                <span>Bloccato</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <TabNavigation />
    </div>
  );
};

export default ProgressPage;