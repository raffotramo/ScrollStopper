import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import TabNavigation from '@/components/TabNavigation';
import { challenges, CHALLENGE_CATEGORIES } from '@/lib/challenges';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';

const Challenges: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('MINDFULNESS');
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);

  const categories = [
    { id: 'MINDFULNESS', name: 'Mindfulness', icon: '🧘', days: [1,2,3,4,5,6,7,8,9,10] },
    { id: 'CREATIVITY', name: 'Creatività', icon: '🎨', days: [11,12,13,14,15,16,17,18,19,20] },
    { id: 'CONNECTION', name: 'Connessioni', icon: '🤝', days: [21,22,23,24,25,26,27,28,29,30] }
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
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">
              Sfide
            </h1>
          </div>
          <p className="text-foreground text-sm font-bold mb-3">
            Esplora tutte le sfide per categoria
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </section>

      <main className="p-4 space-y-6">
        {/* Filtri categorie */}
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

        {/* Info categoria selezionata */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {CHALLENGE_CATEGORIES[selectedCategory as keyof typeof CHALLENGE_CATEGORIES]?.icon}
              </span>
              <div>
                <h2 className="font-bold text-primary">
                  {CHALLENGE_CATEGORIES[selectedCategory as keyof typeof CHALLENGE_CATEGORIES]?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {CHALLENGE_CATEGORIES[selectedCategory as keyof typeof CHALLENGE_CATEGORIES]?.description}
                </p>
              </div>
            </div>
            <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">
              {filteredChallenges.length} sfide disponibili
            </div>
          </CardContent>
        </Card>

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
                    : 'bg-card border-border hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {isCompleted ? '✓' : challenge.day}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${
                          isCompleted ? 'text-green-800' : 'text-foreground'
                        }`}>
                          Giorno {challenge.day}: {challenge.title}
                        </h3>
                        {challenge.timeRequired && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {challenge.timeRequired}min
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm ${
                        isCompleted ? 'text-green-700' : 'text-muted-foreground'
                      }`}>
                        {challenge.description}
                      </p>
                      
                      {isCompleted && (
                        <div className="mt-2">
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Completata
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <TabNavigation />
    </div>
  );
};

export default Challenges;