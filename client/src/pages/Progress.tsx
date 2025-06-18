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
            
            {/* Dashboard con focus dopamina */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-4">
                {/* Widgets principali */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="text-xs text-blue-600 font-medium mb-1">⏱️ Tempo Telefono</div>
                    <div className="text-lg font-bold text-blue-800">
                      {(() => {
                        const avgTime = Object.values(dailyCheckIns).map(day => {
                          switch (day.phoneTime) {
                            case 'Meno di 1h': return 0.5;
                            case '1–2h': return 1.5;
                            case '2–3h': return 2.5;
                            case 'Più di 3h': return 3.5;
                            default: return 0;
                          }
                        }).reduce((a, b) => a + b, 0) / Object.keys(dailyCheckIns).length;
                        return `${avgTime.toFixed(1)}h`;
                      })()}
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                      <div className="bg-blue-500 h-1 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
                    <div className="text-xs text-red-600 font-medium mb-1">🧠 Livello Dopamina</div>
                    <div className="text-lg font-bold text-red-800">
                      {(() => {
                        const avgTime = Object.values(dailyCheckIns).map(day => {
                          switch (day.phoneTime) {
                            case 'Meno di 1h': return 1; // Basso
                            case '1–2h': return 2; // Normale
                            case '2–3h': return 3; // Alto
                            case 'Più di 3h': return 4; // Critico
                            default: return 0;
                          }
                        }).reduce((a, b) => a + b, 0) / Object.keys(dailyCheckIns).length;
                        const level = avgTime <= 1.5 ? 'Equilibrato' : avgTime <= 2.5 ? 'Moderato' : avgTime <= 3.5 ? 'Elevato' : 'Critico';
                        return level;
                      })()}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {(() => {
                        const highUsageDays = Object.values(dailyCheckIns).filter(day => 
                          day.phoneTime === '2–3h' || day.phoneTime === 'Più di 3h'
                        ).length;
                        return highUsageDays > 0 ? 'Sovrastimolazione rilevata' : 'Sistema bilanciato';
                      })()}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                    <div className="text-xs text-green-600 font-medium mb-1">🎯 Controllo Impulsi</div>
                    <div className="text-lg font-bold text-green-800">
                      {Math.round((Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length / Object.keys(dailyCheckIns).length) * 100)}%
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                      <div className="bg-green-500 h-1 rounded-full" style={{
                        width: `${(Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length / Object.keys(dailyCheckIns).length) * 100}%`
                      }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="text-xs text-purple-600 font-medium mb-1">💎 Tempo Recuperato</div>
                    <div className="text-lg font-bold text-purple-800">
                      {(() => {
                        // Stima tempo recuperato basato su riduzione uso telefono
                        const savedTime = Object.values(dailyCheckIns).map(day => {
                          switch (day.phoneTime) {
                            case 'Meno di 1h': return 120; // 2h salvate rispetto a media 3h
                            case '1–2h': return 60; // 1h salvata
                            case '2–3h': return 20; // 20min salvati
                            case 'Più di 3h': return 0;
                            default: return 0;
                          }
                        }).reduce((a, b) => a + b, 0);
                        return savedTime >= 60 ? `${(savedTime / 60).toFixed(1)}h` : `${savedTime}m`;
                      })()}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">Per attività significative</div>
                  </div>
                </div>

                {/* Analisi dopamina dettagliata */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                  <div className="text-sm font-medium text-amber-800 mb-3">⚡ Analisi Sistema Dopamina</div>
                  
                  {(() => {
                    const highUsageDays = Object.values(dailyCheckIns).filter(day => 
                      day.phoneTime === '2–3h' || day.phoneTime === 'Più di 3h'
                    ).length;
                    
                    const impulseControl = Object.values(dailyCheckIns).filter(day => 
                      day.scrollImpulse === 'Mai'
                    ).length;
                    
                    const goodMoodDays = Object.values(dailyCheckIns).filter(day => 
                      day.dailyFeeling === 'Calmo/a e concentrato/a'
                    ).length;
                    
                    const totalDays = Object.keys(dailyCheckIns).length;
                    
                    if (highUsageDays / totalDays > 0.6) {
                      return (
                        <div className="space-y-2">
                          <div className="text-sm text-amber-800">
                            🟡 <strong>Sovrastimolazione frequente</strong> - Il tuo sistema dopaminergico potrebbe essere in sovraccarico
                          </div>
                          <div className="text-xs text-amber-700">
                            • Ridurre gradualmente il tempo al telefono aiuta a riequilibrare i neurotrasmettitori
                            • Focus su attività che stimolano dopamina naturale: sport, creatività, relazioni sociali
                          </div>
                        </div>
                      );
                    } else if (impulseControl / totalDays > 0.7) {
                      return (
                        <div className="space-y-2">
                          <div className="text-sm text-green-800">
                            🟢 <strong>Ottimo controllo inibitorio</strong> - Stai riequilibrando efficacemente il sistema della ricompensa
                          </div>
                          <div className="text-xs text-green-700">
                            • La tua corteccia prefrontale sta riprendendo controllo sui circuiti automatici
                            • Continua con pause regolari per consolidare questi nuovi pattern neurali
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-2">
                          <div className="text-sm text-blue-800">
                            🔵 <strong>Fase di ricalibrazione</strong> - Il tuo cervello si sta adattando ai nuovi stimoli
                          </div>
                          <div className="text-xs text-blue-700">
                            • È normale sentire resistenza iniziale - i recettori dopaminergici si stanno resettando
                            • Ogni giorno di controllo rinforza nuove connessioni neurali più sane
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Grafici trend mini */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">Trend ultimi 7 giorni</div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const day = Math.max(1, currentDay - 6 + i);
                      const dayData = dailyCheckIns[day];
                      
                      let dopamineLevel = 0; // 0=nessun dato, 1=equilibrato, 2=moderato, 3=alto, 4=critico
                      if (dayData?.phoneTime) {
                        switch (dayData.phoneTime) {
                          case 'Meno di 1h': dopamineLevel = 1; break;
                          case '1–2h': dopamineLevel = 2; break;
                          case '2–3h': dopamineLevel = 3; break;
                          case 'Più di 3h': dopamineLevel = 4; break;
                        }
                      }
                      
                      const height = dopamineLevel === 0 ? 'h-2' : dopamineLevel === 1 ? 'h-3' : dopamineLevel === 2 ? 'h-5' : dopamineLevel === 3 ? 'h-7' : 'h-9';
                      const color = dopamineLevel === 0 ? 'bg-muted' : dopamineLevel === 1 ? 'bg-green-400' : dopamineLevel === 2 ? 'bg-blue-400' : dopamineLevel === 3 ? 'bg-yellow-400' : 'bg-red-400';
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="h-9 flex items-end justify-center mb-1">
                            <div className={`w-3 rounded-t transition-all duration-300 ${height} ${color}`} />
                          </div>
                          <div className="text-xs text-muted-foreground">{day}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>🟢 Equilibrato</span>
                    <span>🔴 Sovrastimolato</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-4xl mb-2">🧠</div>
                <div className="text-sm">Inizia a completare i check-in per monitorare il tuo sistema dopaminergico</div>
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