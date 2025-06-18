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
            
            {/* Andamento semplificato */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-4">
                {/* Riepilogo numerico */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      {(() => {
                        const goodDays = Object.values(dailyCheckIns).filter(day => 
                          (day.phoneTime === 'Meno di 1h' || day.phoneTime === '1–2h') ||
                          (day.scrollImpulse === 'Mai' || day.scrollImpulse === 'Una volta') ||
                          (day.dailyFeeling === 'Calmo/a e concentrato/a')
                        ).length;
                        return Math.round((goodDays / Object.keys(dailyCheckIns).length) * 100);
                      })()}%
                    </div>
                    <div className="text-xs text-green-700">Giorni positivi</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {(() => {
                        const resistedDays = Object.values(dailyCheckIns).filter(day => 
                          day.resistedImpulse === 'Sì' || day.ignoredNotifications === 'Sì'
                        ).length;
                        return resistedDays;
                      })()}
                    </div>
                    <div className="text-xs text-blue-700">Impulsi resistiti</div>
                  </div>
                </div>

                {/* Grafico semplice ultimi 7 giorni */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Ultimi 7 giorni</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const day = Math.max(1, currentDay - 6 + i);
                      const dayData = dailyCheckIns[day];
                      
                      // Calcola punteggio giornaliero (0-3)
                      let score = 0;
                      if (dayData) {
                        if (dayData.phoneTime === 'Meno di 1h' || dayData.phoneTime === '1–2h') score++;
                        if (dayData.scrollImpulse === 'Mai' || dayData.scrollImpulse === 'Una volta') score++;
                        if (dayData.dailyFeeling === 'Calmo/a e concentrato/a' || dayData.dailyFeeling === 'Neutro/a') score++;
                      }
                      
                      const height = score === 0 ? 'h-2' : score === 1 ? 'h-4' : score === 2 ? 'h-6' : 'h-8';
                      const color = score === 0 ? 'bg-muted' : score === 1 ? 'bg-red-400' : score === 2 ? 'bg-yellow-400' : 'bg-green-400';
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="h-8 flex items-end justify-center mb-1">
                            <div className={`w-4 rounded-t transition-all duration-300 ${height} ${color}`} />
                          </div>
                          <div className="text-xs text-muted-foreground">{day}</div>
                          {dayData && (
                            <div className="text-xs font-bold text-foreground">{score}/3</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-3">
                    Punteggio basato su: tempo telefono, controllo impulsi, umore
                  </div>
                </div>

                {/* Insights chiave */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Insights</h4>
                  
                  {(() => {
                    const insights = [];
                    const totalDays = Object.keys(dailyCheckIns).length;
                    
                    // Analisi tempo telefono
                    const lowPhoneTime = Object.values(dailyCheckIns).filter(day => 
                      day.phoneTime === 'Meno di 1h'
                    ).length;
                    
                    if (lowPhoneTime / totalDays >= 0.7) {
                      insights.push({ icon: '📱', text: 'Ottimo controllo del tempo al telefono!', color: 'text-green-600' });
                    } else if (lowPhoneTime / totalDays <= 0.3) {
                      insights.push({ icon: '⚠️', text: 'Prova a ridurre il tempo al telefono', color: 'text-orange-600' });
                    }
                    
                    // Analisi impulsi
                    const goodImpulseControl = Object.values(dailyCheckIns).filter(day => 
                      day.scrollImpulse === 'Mai'
                    ).length;
                    
                    if (goodImpulseControl / totalDays >= 0.5) {
                      insights.push({ icon: '🎯', text: 'Controllo impulsi in miglioramento', color: 'text-blue-600' });
                    }
                    
                    // Analisi umore
                    const goodMood = Object.values(dailyCheckIns).filter(day => 
                      day.dailyFeeling === 'Calmo/a e concentrato/a'
                    ).length;
                    
                    if (goodMood / totalDays >= 0.6) {
                      insights.push({ icon: '😌', text: 'Umore stabile e concentrazione alta', color: 'text-green-600' });
                    }
                    
                    return insights.slice(0, 3).map((insight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span>{insight.icon}</span>
                        <span className={insight.color}>{insight.text}</span>
                      </div>
                    ));
                  })()}
                </div>
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