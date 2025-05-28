import React, { useState } from 'react';
import { BarChart, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import DailyProgressQuiz from '@/components/DailyProgressQuiz';
import WeeklyProgress from '@/components/WeeklyProgress';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';

interface QuizData {
  phoneChecks: string;
  socialTime: string;
  moodChange: string;
}

interface DailyQuizProgress {
  day: number;
  quizData: QuizData;
  completedAt: Date;
}

const Progress: React.FC = () => {
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const [quizProgress, setQuizProgress] = useLocalStorage<DailyQuizProgress[]>('daily-quiz-progress', []);
  
  // Calculate current day based on completed challenges
  const completedDays = progress.filter(day => day.completed).map(day => day.day);
  const currentDay = Math.min(completedDays.length + 1, 30);
  
  // Check if today's quiz is already completed
  const todayQuizCompleted = quizProgress.some(quiz => quiz.day === currentDay);

  const handleQuizComplete = (data: QuizData) => {
    const newQuizEntry: DailyQuizProgress = {
      day: currentDay,
      quizData: data,
      completedAt: new Date()
    };
    
    setQuizProgress(prev => [...prev.filter(q => q.day !== currentDay), newQuizEntry]);
  };

  const calculateWellnessScore = () => {
    if (quizProgress.length === 0) return { score: 0, trend: 'neutral' };
    
    const lastWeekData = quizProgress.slice(-7);
    let totalScore = 0;
    
    lastWeekData.forEach(quiz => {
      let dayScore = 0;
      
      // Phone checks score (0-3)
      if (quiz.quizData.phoneChecks === '0-2') dayScore += 3;
      else if (quiz.quizData.phoneChecks === '3-5') dayScore += 2;
      else if (quiz.quizData.phoneChecks === '6-10') dayScore += 1;
      
      // Social time score (0-3)
      if (quiz.quizData.socialTime === 'meno-30') dayScore += 3;
      else if (quiz.quizData.socialTime === '30-60') dayScore += 2;
      else if (quiz.quizData.socialTime === '1-2h') dayScore += 1;
      
      // Mood score (1-3)
      if (quiz.quizData.moodChange === 'calmo') dayScore += 3;
      else if (quiz.quizData.moodChange === 'uguale') dayScore += 2;
      else dayScore += 1;
      
      totalScore += dayScore;
    });
    
    const avgScore = totalScore / lastWeekData.length;
    const scorePercentage = Math.round((avgScore / 9) * 100);
    
    // Calculate trend
    const firstHalf = lastWeekData.slice(0, Math.ceil(lastWeekData.length / 2));
    const secondHalf = lastWeekData.slice(Math.ceil(lastWeekData.length / 2));
    
    const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, quiz) => {
      let score = 0;
      if (quiz.quizData.phoneChecks === '0-2') score += 3;
      else if (quiz.quizData.phoneChecks === '3-5') score += 2;
      else if (quiz.quizData.phoneChecks === '6-10') score += 1;
      
      if (quiz.quizData.socialTime === 'meno-30') score += 3;
      else if (quiz.quizData.socialTime === '30-60') score += 2;
      else if (quiz.quizData.socialTime === '1-2h') score += 1;
      
      if (quiz.quizData.moodChange === 'calmo') score += 3;
      else if (quiz.quizData.moodChange === 'uguale') score += 2;
      else score += 1;
      
      return sum + score;
    }, 0) / firstHalf.length : 0;
    
    const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, quiz) => {
      let score = 0;
      if (quiz.quizData.phoneChecks === '0-2') score += 3;
      else if (quiz.quizData.phoneChecks === '3-5') score += 2;
      else if (quiz.quizData.phoneChecks === '6-10') score += 1;
      
      if (quiz.quizData.socialTime === 'meno-30') score += 3;
      else if (quiz.quizData.socialTime === '30-60') score += 2;
      else if (quiz.quizData.socialTime === '1-2h') score += 1;
      
      if (quiz.quizData.moodChange === 'calmo') score += 3;
      else if (quiz.quizData.moodChange === 'uguale') score += 2;
      else score += 1;
      
      return sum + score;
    }, 0) / secondHalf.length : 0;
    
    const trend = secondHalfAvg > firstHalfAvg ? 'up' : secondHalfAvg < firstHalfAvg ? 'down' : 'neutral';
    
    return { score: scorePercentage, trend };
  };

  const wellnessScore = calculateWellnessScore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="mx-4 mt-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Il tuo progresso
          </h1>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </section>
      
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        <div className="container mx-auto px-4 py-4">

          <Tabs defaultValue="today" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-background border border-border/30 rounded-xl">
              <TabsTrigger value="today" className="text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all">
                Oggi
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all">
                Settimane
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg transition-all">
                Statistiche
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {!todayQuizCompleted ? (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Check-in giornaliero - Giorno {currentDay}
                  </h2>
                  <DailyProgressQuiz day={currentDay} onComplete={handleQuizComplete} />
                </div>
              ) : (
                <Card className="bg-card border border-border rounded-2xl shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Check-in completato! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      Hai già registrato il tuo progresso per oggi. Torna domani per il prossimo check-in!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <WeeklyProgress currentDay={currentDay} completedDays={completedDays} />
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {/* Punteggio Benessere Digitale */}
              <Card className="bg-card border border-border rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <BarChart className="w-4 h-4 text-primary" />
                    </div>
                    Punteggio Benessere Digitale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {wellnessScore.score}%
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className={`w-5 h-5 ${
                        wellnessScore.trend === 'up' ? 'text-green-500' : 
                        wellnessScore.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <span className="text-muted-foreground">
                        {wellnessScore.trend === 'up' ? 'In miglioramento' : 
                         wellnessScore.trend === 'down' ? 'In calo' : 'Stabile'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Check-in completati</span>
                      <span className="text-foreground font-semibold">{quizProgress.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sfide completate</span>
                      <span className="text-foreground font-semibold">{completedDays.length}/30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Giorno corrente</span>
                      <span className="text-foreground font-semibold">{currentDay}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analisi recente */}
              {quizProgress.length > 0 && (
                <Card className="border border-gray-300 bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Analisi ultimi 7 giorni
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quizProgress.slice(-7).map((quiz, index) => (
                        <div key={quiz.day} className="flex justify-between items-center p-2 border border-gray-600 rounded">
                          <span className="text-gray-300">Giorno {quiz.day}</span>
                          <div className="flex gap-2">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              📱 {quiz.quizData.phoneChecks}
                            </span>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              ⏱️ {quiz.quizData.socialTime}
                            </span>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              😌 {quiz.quizData.moodChange}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TabNavigation />
    </div>
  );
};

export default Progress;