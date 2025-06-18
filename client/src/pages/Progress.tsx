import React from 'react';
import { Clock, BarChart3, Calendar, TrendingUp, ChevronRight, BookOpen, Star, Award, Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabNavigation from '@/components/TabNavigation';
import DailyProgressQuiz from '@/components/DailyProgressQuiz';
import useLocalStorage from '@/hooks/useLocalStorage';

const ProgressPage: React.FC = () => {
  const [dailyCheckIns, setDailyCheckIns] = useLocalStorage<Record<number, any>>('daily-checkins', {});
  const currentDay = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) % 30 + 1;

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
            
            {/* Dashboard minimal uniforme */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-4">
                {/* Widgets principali - stile uniforme */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Tempo Telefono</div>
                          <div className="text-xs text-muted-foreground">Media giornaliera</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {(() => {
                          const values = Object.values(dailyCheckIns).map(day => {
                            switch (day.phoneTime) {
                              case 'Meno di 1h': return 0.5;
                              case '1–2h': return 1.5;
                              case '2–3h': return 2.5;
                              case 'Più di 3h': return 3.5;
                              default: return 0;
                            }
                          });
                          const sum = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) : 0;
                          const avgTime = values.length > 0 ? sum / values.length : 0;
                          return `${avgTime.toFixed(1)}h`;
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Zap className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Livello Dopamina</div>
                          <div className="text-xs text-muted-foreground">Sistema nervoso</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {(() => {
                          const values = Object.values(dailyCheckIns).map((day: any) => {
                            switch (day.phoneTime) {
                              case 'Meno di 1h': return 1;
                              case '1–2h': return 2;
                              case '2–3h': return 3;
                              case 'Più di 3h': return 4;
                              default: return 0;
                            }
                          }) as number[];
                          const sum = values.length > 0 ? values.reduce((a, b) => a + b, 0) : 0;
                          const avgTime = values.length > 0 ? sum / values.length : 0;
                          const level = avgTime <= 1.5 ? 'Equilibrato' : avgTime <= 2.5 ? 'Moderato' : avgTime <= 3.5 ? 'Elevato' : 'Critico';
                          return level;
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Controllo Impulsi</div>
                          <div className="text-xs text-muted-foreground">Autocontrollo</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length / Object.keys(dailyCheckIns).length) * 100)}%
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Tempo Recuperato</div>
                          <div className="text-xs text-muted-foreground">Per la vita reale</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {(() => {
                          let savedTime = 0;
                          Object.values(dailyCheckIns).forEach((day: any) => {
                            switch (day.phoneTime) {
                              case 'Meno di 1h': savedTime += 120; break;
                              case '1–2h': savedTime += 60; break;
                              case '2–3h': savedTime += 20; break;
                              case 'Più di 3h': savedTime += 0; break;
                            }
                          });
                          return savedTime >= 60 ? `${(savedTime / 60).toFixed(1)}h` : `${savedTime}m`;
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Analisi dopamina - card uniforme */}
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Analisi Scientifica</div>
                        <div className="text-xs text-muted-foreground">Sistema dopaminergico</div>
                      </div>
                    </div>
                    
                    {(() => {
                      const highUsageDays = Object.values(dailyCheckIns).filter(day => 
                        day.phoneTime === '2–3h' || day.phoneTime === 'Più di 3h'
                      ).length;
                      
                      const impulseControl = Object.values(dailyCheckIns).filter(day => 
                        day.scrollImpulse === 'Mai'
                      ).length;
                      
                      const totalDays = Object.keys(dailyCheckIns).length;
                      
                      if (highUsageDays / totalDays > 0.6) {
                        return (
                          <div className="text-sm text-amber-800">
                            <strong>Sovrastimolazione frequente</strong> - Riduci gradualmente per riequilibrare i neurotrasmettitori
                          </div>
                        );
                      } else if (impulseControl / totalDays > 0.7) {
                        return (
                          <div className="text-sm text-green-800">
                            <strong>Ottimo controllo</strong> - La corteccia prefrontale sta riprendendo controllo
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-sm text-blue-800">
                            <strong>Fase ricalibrazione</strong> - I recettori dopaminergici si stanno resettando
                          </div>
                        );
                      }
                    })()}
                  </CardContent>
                </Card>

                {/* Grafico trend minimal */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Ultimi 7 giorni</div>
                        <div className="text-xs text-muted-foreground">Livelli dopamina</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-3">
                      {Array.from({ length: 7 }, (_, i) => {
                        const day = Math.max(1, currentDay - 6 + i);
                        const dayData = dailyCheckIns[day];
                        
                        let level = 0;
                        if (dayData?.phoneTime) {
                          switch (dayData.phoneTime) {
                            case 'Meno di 1h': level = 1; break;
                            case '1–2h': level = 2; break;
                            case '2–3h': level = 3; break;
                            case 'Più di 3h': level = 4; break;
                          }
                        }
                        
                        const height = level === 0 ? 'h-2' : level === 1 ? 'h-4' : level === 2 ? 'h-6' : level === 3 ? 'h-8' : 'h-10';
                        const color = level === 0 ? 'bg-muted' : level === 1 ? 'bg-green-400' : level === 2 ? 'bg-blue-400' : level === 3 ? 'bg-yellow-400' : 'bg-red-400';
                        
                        return (
                          <div key={i} className="text-center">
                            <div className="h-10 flex items-end justify-center mb-1">
                              <div className={`w-4 rounded-t ${height} ${color}`} />
                            </div>
                            <div className="text-xs text-muted-foreground">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Equilibrato</span>
                      <span>Sovrastimolato</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-sm">Inizia a completare i check-in per vedere i tuoi progressi</div>
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