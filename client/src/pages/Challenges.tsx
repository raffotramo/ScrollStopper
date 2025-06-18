import React, { useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TabNavigation from '@/components/TabNavigation';
import AchievementSystem from '@/components/AchievementSystem';
import { challenges, CHALLENGE_CATEGORIES } from '@/lib/challenges';
import { ALL_ACHIEVEMENTS } from '@/lib/achievements';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress, UserStats } from '@/types';

const Challenges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements'>('challenges');
  const [selectedCategory, setSelectedCategory] = useState<string>('MINDFULNESS');
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

  const categories = [
    { id: 'MINDFULNESS', name: 'Mindfulness', icon: '🧘' },
    { id: 'CREATIVITY', name: 'Creatività', icon: '🎨' },
    { id: 'CONNECTION', name: 'Connessioni', icon: '🤝' }
  ];

  const filteredChallenges = challenges.filter(challenge => 
    challenge.category === selectedCategory
  );

  const getChallengeStatus = (day: number) => {
    const dayProgress = progress.find(p => p.day === day);
    return dayProgress?.completed ? 'completed' : 'pending';
  };

  return (
    <div className="min-h-screen bg-[#eeeded] pb-20">
      {/* Header */}
      <section className="mx-4 mt-6 mb-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-amber-600">Challenge</h1>
          </div>
          <p className="text-foreground text-sm font-bold mb-3">
            Sfide e Achievement
          </p>
          <div className="w-20 h-1 bg-amber-600 rounded-full mx-auto"></div>
        </div>
      </section>

      <main className="p-4 space-y-4">
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'challenges' ? "default" : "outline"}
            onClick={() => setActiveTab('challenges')}
            className="flex-1"
            size="sm"
          >
            Sfide
          </Button>
          <Button
            variant={activeTab === 'achievements' ? "default" : "outline"}
            onClick={() => setActiveTab('achievements')}
            className="flex-1"
            size="sm"
          >
            Achievement
          </Button>
        </div>

        {activeTab === 'challenges' ? (
          <>
            {/* Filtri categorie sfide */}
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-1 text-xs"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Lista sfide */}
            <div className="space-y-3">
              {filteredChallenges.map(challenge => {
                const status = getChallengeStatus(challenge.day);
                const isCompleted = status === 'completed';
                
                return (
                  <Card 
                    key={challenge.day}
                    className={`transition-all ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {isCompleted ? '✓' : challenge.day}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={`font-semibold text-sm ${
                              isCompleted ? 'text-green-800' : 'text-foreground'
                            }`}>
                              {challenge.title}
                            </h3>
                            {challenge.timeRequired && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {challenge.timeRequired}m
                              </div>
                            )}
                          </div>
                          
                          <p className={`text-xs ${
                            isCompleted ? 'text-green-700' : 'text-muted-foreground'
                          }`}>
                            {challenge.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <AchievementSystem 
            userStats={{
              totalStars: userStats.totalStars,
              level: userStats.level,
              pointsToNextLevel: userStats.pointsToNextLevel,
              achievements: userStats.achievements
            }}
            allAchievements={userStats.achievements}
          />
        )}
      </main>

      <TabNavigation />
    </div>
  );
};

export default Challenges;