import React from 'react';
import { Clock, BarChart3, Calendar, TrendingUp, ChevronRight, BookOpen, Star, Award, Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabNavigation from '@/components/TabNavigation';
import DailyProgressQuiz from '@/components/DailyProgressQuiz';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';

const ProgressPage: React.FC = () => {
  const [dailyCheckIns, setDailyCheckIns] = useLocalStorage<Record<number, any>>('daily-checkins', {});
  const currentDay = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) % 30 + 1;
  
  // Calcola statistiche solo dai check-in
  const totalCheckIns = Object.keys(dailyCheckIns).length;
  const goodControlDays = Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length;
  const lowUsageDays = Object.values(dailyCheckIns).filter(day => 
    day.phoneTime === 'Meno di 1h' || day.phoneTime === '1–2h'
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 space-y-4 pb-20">
        {/* Header */}
        <section className="mx-4 mt-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-4">
              Progressi
            </h1>
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
              <div className="text-3xl font-bold text-primary">{totalCheckIns}</div>
              <div className="text-sm text-muted-foreground">Check-in completati</div>
            </div>
            
            {/* Dashboard avanzato con nuovi dati */}
            {totalCheckIns > 0 ? (
              <div className="space-y-3">
                {/* Metriche principali */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-1">Tempo schermo medio</div>
                    <div className="text-xl font-bold text-foreground">
                      {(() => {
                        let sum = 0;
                        let count = 0;
                        Object.values(dailyCheckIns).forEach((day: any) => {
                          if (day.screenTime) {
                            count++;
                            switch (day.screenTime) {
                              case 'Meno di 2h': sum += 1; break;
                              case '2–4h': sum += 3; break;
                              case '4–6h': sum += 5; break;
                              case '6–8h': sum += 7; break;
                              case 'Oltre 8h': sum += 9; break;
                            }
                          }
                        });
                        return count > 0 ? `${(sum / count).toFixed(1)}h` : '0h';
                      })()}
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-1">Qualità focus</div>
                    <div className="text-xl font-bold text-foreground">
                      {(() => {
                        let sum = 0;
                        let count = 0;
                        Object.values(dailyCheckIns).forEach((day: any) => {
                          if (day.focusQuality) {
                            count++;
                            switch (day.focusQuality) {
                              case 'Molto basso': sum += 1; break;
                              case 'Basso': sum += 2; break;
                              case 'Medio': sum += 3; break;
                              case 'Alto': sum += 4; break;
                              case 'Molto alto': sum += 5; break;
                            }
                          }
                        });
                        return count > 0 ? `${(sum / count).toFixed(1)}/5` : '0/5';
                      })()}
                    </div>
                  </div>
                </div>

                {/* Metriche controllo digitale */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-1">Impulsi resistiti/giorno</div>
                    <div className="text-xl font-bold text-foreground">
                      {(() => {
                        let sum = 0;
                        let count = 0;
                        Object.values(dailyCheckIns).forEach((day: any) => {
                          if (day.impulseControl) {
                            count++;
                            switch (day.impulseControl) {
                              case '0 volte': sum += 0; break;
                              case '1–3 volte': sum += 2; break;
                              case '4–7 volte': sum += 5.5; break;
                              case '8–12 volte': sum += 10; break;
                              case 'Oltre 12': sum += 15; break;
                            }
                          }
                        });
                        return count > 0 ? Math.round(sum / count) : 0;
                      })()}
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-1">Attività offline/giorno</div>
                    <div className="text-xl font-bold text-foreground">
                      {(() => {
                        let sum = 0;
                        let count = 0;
                        Object.values(dailyCheckIns).forEach((day: any) => {
                          if (day.realWorldActivities) {
                            count++;
                            switch (day.realWorldActivities) {
                              case 'Nessuna': sum += 0; break;
                              case '1 attività': sum += 1; break;
                              case '2–3 attività': sum += 2.5; break;
                              case '4–5 attività': sum += 4.5; break;
                              case 'Oltre 5': sum += 6; break;
                            }
                          }
                        });
                        return count > 0 ? (sum / count).toFixed(1) : '0';
                      })()}
                    </div>
                  </div>
                </div>

                {/* Insight avanzato */}
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-2">Analisi benessere digitale</div>
                  <div className="text-sm text-foreground">
                    {(() => {
                      let screenTimeScore = 0;
                      let focusScore = 0;
                      let stressScore = 0;
                      let count = 0;

                      Object.values(dailyCheckIns).forEach((day: any) => {
                        if (day.screenTime && day.focusQuality && day.stressLevel) {
                          count++;
                          // Screen time (inverso - meno è meglio)
                          switch (day.screenTime) {
                            case 'Meno di 2h': screenTimeScore += 5; break;
                            case '2–4h': screenTimeScore += 4; break;
                            case '4–6h': screenTimeScore += 3; break;
                            case '6–8h': screenTimeScore += 2; break;
                            case 'Oltre 8h': screenTimeScore += 1; break;
                          }
                          // Focus quality
                          switch (day.focusQuality) {
                            case 'Molto alto': focusScore += 5; break;
                            case 'Alto': focusScore += 4; break;
                            case 'Medio': focusScore += 3; break;
                            case 'Basso': focusScore += 2; break;
                            case 'Molto basso': focusScore += 1; break;
                          }
                          // Stress (inverso - meno è meglio)
                          switch (day.stressLevel) {
                            case 'Nullo': stressScore += 5; break;
                            case 'Basso': stressScore += 4; break;
                            case 'Moderato': stressScore += 3; break;
                            case 'Alto': stressScore += 2; break;
                            case 'Molto alto': stressScore += 1; break;
                          }
                        }
                      });

                      if (count === 0) return 'Completa più check-in per vedere l\'analisi';
                      
                      const avgScore = (screenTimeScore + focusScore + stressScore) / (count * 3);
                      
                      if (avgScore >= 4.2) return 'Eccellente equilibrio digitale - Sei un esempio da seguire';
                      if (avgScore >= 3.5) return 'Buon controllo digitale - Piccoli aggiustamenti possono perfezionare';
                      if (avgScore >= 2.8) return 'Progresso evidente - Focus su riduzione tempo schermo';
                      if (avgScore >= 2.0) return 'Miglioramento in corso - Lavora su concentrazione e stress';
                      return 'Inizia con piccoli cambiamenti - Riduci 30min di schermo al giorno';
                    })()}
                  </div>
                </div>

                {/* Grafici multipli */}
                <div className="space-y-3">
                  {/* Grafico tempo schermo */}
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-3">Tempo schermo - Ultimi 7 giorni</div>
                    <div className="flex justify-between items-end gap-1 h-12">
                      {Array.from({ length: 7 }, (_, i) => {
                        const day = Math.max(1, currentDay - 6 + i);
                        const dayData = dailyCheckIns[day];
                        
                        let level = 0;
                        if (dayData?.screenTime) {
                          switch (dayData.screenTime) {
                            case 'Meno di 2h': level = 1; break;
                            case '2–4h': level = 2; break;
                            case '4–6h': level = 3; break;
                            case '6–8h': level = 4; break;
                            case 'Oltre 8h': level = 5; break;
                          }
                        }
                        
                        const height = ['h-1', 'h-2', 'h-4', 'h-6', 'h-8', 'h-10'][level];
                        const color = ['bg-muted', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-red-600'][level];
                        
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className={`w-full ${height} ${color} rounded-t mb-1`} />
                            <div className="text-xs text-muted-foreground">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grafico qualità focus */}
                  <div className="bg-card rounded-lg p-3 border">
                    <div className="text-xs text-muted-foreground mb-3">Qualità focus - Ultimi 7 giorni</div>
                    <div className="flex justify-between items-end gap-1 h-12">
                      {Array.from({ length: 7 }, (_, i) => {
                        const day = Math.max(1, currentDay - 6 + i);
                        const dayData = dailyCheckIns[day];
                        
                        let level = 0;
                        if (dayData?.focusQuality) {
                          switch (dayData.focusQuality) {
                            case 'Molto basso': level = 1; break;
                            case 'Basso': level = 2; break;
                            case 'Medio': level = 3; break;
                            case 'Alto': level = 4; break;
                            case 'Molto alto': level = 5; break;
                          }
                        }
                        
                        const height = ['h-1', 'h-2', 'h-4', 'h-6', 'h-8', 'h-10'][level];
                        const color = ['bg-muted', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'][level];
                        
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className={`w-full ${height} ${color} rounded-t mb-1`} />
                            <div className="text-xs text-muted-foreground">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm">Completa i check-in per vedere analisi avanzate</div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <TabNavigation />
    </div>
  );
};

export default ProgressPage;