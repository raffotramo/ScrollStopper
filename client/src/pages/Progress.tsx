import React from 'react';
import { Clock, BarChart3, Calendar, TrendingUp, ChevronRight, BookOpen, Star, Award, Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabNavigation from '@/components/TabNavigation';
import DailyProgressQuiz from '@/components/DailyProgressQuiz';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';

const ProgressPage: React.FC = () => {
  const [dailyCheckIns, setDailyCheckIns] = useLocalStorage<Record<number, any>>('daily-checkins', {});
  const [progress, setProgress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  const currentDay = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) % 30 + 1;
  
  // Calcola statistiche unificate
  const completedChallenges = progress.filter(day => day.completed).length;
  const totalReflections = progress.filter(day => day.reflectionText && day.reflectionText.trim() !== '').length;
  const totalTimeSpent = progress
    .filter(day => day.completed && day.timeSpent)
    .reduce((total, day) => total + (day.timeSpent || 0), 0);
  
  // Calcola streak corrente
  let currentStreak = 0;
  const progressSorted = [...progress].sort((a, b) => b.day - a.day);
  for (const day of progressSorted) {
    if (day.completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 space-y-4 pb-20">
        {/* Header */}
        <section className="mx-4 mt-2 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-4">
              Progressi
            </h1>
            <p className="text-foreground text-sm font-bold mb-3">
              Monitora il tuo percorso di digital detox
            </p>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
        </section>
        {/* Come funziona */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-3 h-3 text-primary" />
              </div>
              Come funziona?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Check-in giornaliero</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Torna ogni giorno in <strong>tarda serata (22:00-23:00)</strong> e compila il tuo check-in giornaliero per monitorare i tuoi progressi nel digital detox.
                </p>
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

        {/* Andamento Check-in */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Andamento Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary">{Object.keys(dailyCheckIns).length}</div>
              <div className="text-sm text-muted-foreground">Check-in completati</div>
            </div>
            
            {/* Dashboard unificato - Check-in + Sfide */}
            <div className="space-y-3">
              {/* Panoramica generale */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Sfide completate</div>
                  <div className="text-xl font-bold text-foreground">{completedChallenges}/30</div>
                </div>
                
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Streak corrente</div>
                  <div className="text-xl font-bold text-foreground">{currentStreak} giorni</div>
                </div>
              </div>

              {/* Tempo e controllo - solo se ci sono check-in */}
              {Object.keys(dailyCheckIns).length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-1">Tempo telefono</div>
                    <div className="text-xl font-bold text-foreground">
                      {(() => {
                        let sum = 0;
                        let count = 0;
                        Object.values(dailyCheckIns).forEach((day: any) => {
                          if (day.phoneTime) {
                            count++;
                            switch (day.phoneTime) {
                              case 'Meno di 1h': sum += 0.5; break;
                              case '1–2h': sum += 1.5; break;
                              case '2–3h': sum += 2.5; break;
                              case 'Più di 3h': sum += 3.5; break;
                            }
                          }
                        });
                        return count > 0 ? `${(sum / count).toFixed(1)}h` : '0h';
                      })()}
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-1">Controllo impulsi</div>
                    <div className="text-xl font-bold text-foreground">
                      {Object.keys(dailyCheckIns).length > 0 ? 
                        Math.round((Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length / Object.keys(dailyCheckIns).length) * 100) + '%'
                        : '0%'
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Statistiche dettagliate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Riflessioni scritte</div>
                  <div className="text-xl font-bold text-foreground">{totalReflections}</div>
                </div>
                
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Tempo investito</div>
                  <div className="text-xl font-bold text-foreground">
                    {totalTimeSpent >= 60 ? `${(totalTimeSpent / 60).toFixed(1)}h` : `${totalTimeSpent}m`}
                  </div>
                </div>
              </div>

              {/* Insights combinati */}
              {Object.keys(dailyCheckIns).length > 0 && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-2">Analisi progresso</div>
                  <div className="text-sm text-foreground">
                    {(() => {
                      const challengeProgress = (completedChallenges / 30) * 100;
                      const highUsage = Object.values(dailyCheckIns).filter(day => 
                        day.phoneTime === '2–3h' || day.phoneTime === 'Più di 3h'
                      ).length;
                      const checkInTotal = Object.keys(dailyCheckIns).length;
                      
                      if (challengeProgress >= 50 && (highUsage / checkInTotal) < 0.3) {
                        return 'Eccellente progresso - Controllo digitale in miglioramento';
                      } else if (challengeProgress >= 30) {
                        return 'Buon ritmo - Continua con costanza per consolidare i cambiamenti';
                      } else if (challengeProgress >= 10) {
                        return 'Inizio promettente - Mantieni la motivazione nei prossimi giorni';
                      } else {
                        return 'Inizia il tuo percorso - Ogni piccolo passo conta';
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Andamento ultimi 7 giorni - combinato */}
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-xs text-muted-foreground mb-3">Ultimi 7 giorni</div>
                <div className="flex justify-between items-end gap-1 h-12">
                  {Array.from({ length: 7 }, (_, i) => {
                    const day = Math.max(1, currentDay - 6 + i);
                    const dayData = dailyCheckIns[day];
                    const challengeCompleted = progress.some(p => p.day === day && p.completed);
                    
                    let level = 0;
                    // Se c'è check-in, usa quello per il livello
                    if (dayData?.phoneTime) {
                      switch (dayData.phoneTime) {
                        case 'Meno di 1h': level = 1; break;
                        case '1–2h': level = 2; break;
                        case '2–3h': level = 3; break;
                        case 'Più di 3h': level = 4; break;
                      }
                    } else if (challengeCompleted) {
                      // Se non c'è check-in ma c'è sfida completata, livello medio
                      level = 2;
                    }
                    
                    const height = ['h-1', 'h-3', 'h-6', 'h-9', 'h-12'][level];
                    const color = challengeCompleted ? 
                      ['bg-muted', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-red-400'][level] :
                      'bg-muted';
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className={`w-full ${height} ${color} rounded-t mb-1`} />
                        <div className="text-xs text-muted-foreground">{day}</div>
                        {challengeCompleted && (
                          <div className="w-1 h-1 bg-primary rounded-full mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>• = Sfida completata</span>
                  {Object.keys(dailyCheckIns).length > 0 && (
                    <span>Colore = Tempo telefono</span>
                  )}
                </div>
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