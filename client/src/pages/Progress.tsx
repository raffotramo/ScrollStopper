import React from 'react';
import { Clock, BarChart3 } from 'lucide-react';
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
            
            {/* Analisi delle risposte */}
            {Object.keys(dailyCheckIns).length > 0 && (
              <div className="space-y-6">
                {/* Tempo medio al telefono */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Tempo al telefono</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const day = Math.max(1, currentDay - 6 + i);
                      const dayData = dailyCheckIns[day];
                      
                      let height = 'h-2';
                      let color = 'bg-muted';
                      
                      if (dayData?.phoneTime) {
                        switch (dayData.phoneTime) {
                          case 'Meno di 1h':
                            height = 'h-3';
                            color = 'bg-green-500';
                            break;
                          case '1–2h':
                            height = 'h-6';
                            color = 'bg-yellow-500';
                            break;
                          case '2–3h':
                            height = 'h-9';
                            color = 'bg-orange-500';
                            break;
                          case 'Più di 3h':
                            height = 'h-12';
                            color = 'bg-red-500';
                            break;
                        }
                      }
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="h-12 flex items-end justify-center mb-1">
                            <div className={`w-3 rounded-t transition-all duration-300 ${height} ${color}`} />
                          </div>
                          <div className="text-xs text-muted-foreground">{day}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Meno</span>
                    <span>Più tempo</span>
                  </div>
                </div>

                {/* Controllo degli impulsi */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Controllo impulsi</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const day = Math.max(1, currentDay - 6 + i);
                      const dayData = dailyCheckIns[day];
                      
                      let height = 'h-2';
                      let color = 'bg-muted';
                      
                      if (dayData?.scrollImpulse) {
                        switch (dayData.scrollImpulse) {
                          case 'Mai':
                            height = 'h-12';
                            color = 'bg-green-500';
                            break;
                          case 'Una volta':
                            height = 'h-6';
                            color = 'bg-yellow-500';
                            break;
                          case 'Più volte':
                            height = 'h-3';
                            color = 'bg-red-500';
                            break;
                        }
                      }
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="h-12 flex items-end justify-center mb-1">
                            <div className={`w-3 rounded-t transition-all duration-300 ${height} ${color}`} />
                          </div>
                          <div className="text-xs text-muted-foreground">{day}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Più controllo</span>
                    <span>Meno controllo</span>
                  </div>
                </div>

                {/* Umore generale */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Umore giornaliero</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const day = Math.max(1, currentDay - 6 + i);
                      const dayData = dailyCheckIns[day];
                      
                      let height = 'h-2';
                      let color = 'bg-muted';
                      
                      if (dayData?.dailyFeeling) {
                        switch (dayData.dailyFeeling) {
                          case 'Calmo/a e concentrato/a':
                            height = 'h-12';
                            color = 'bg-green-500';
                            break;
                          case 'Neutro/a':
                            height = 'h-6';
                            color = 'bg-yellow-500';
                            break;
                          case 'Distratto/a o ansioso/a':
                            height = 'h-3';
                            color = 'bg-red-500';
                            break;
                        }
                      }
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="h-12 flex items-end justify-center mb-1">
                            <div className={`w-3 rounded-t transition-all duration-300 ${height} ${color}`} />
                          </div>
                          <div className="text-xs text-muted-foreground">{day}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Più calmo</span>
                    <span>Più distratto</span>
                  </div>
                </div>

                {/* Legenda colori */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs font-medium text-foreground mb-2">Legenda:</div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Ottimo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Medio</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Attenzione</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Critico</span>
                    </div>
                  </div>
                </div>
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