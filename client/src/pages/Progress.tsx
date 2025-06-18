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
            
            {/* OPZIONE 1: Dashboard con widgets modulari */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-6">
                <div className="text-sm font-medium text-foreground">OPZIONE 1: Dashboard Modulari</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="text-xs text-blue-600 font-medium mb-1">Tempo Telefono</div>
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
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                    <div className="text-xs text-green-600 font-medium mb-1">Controllo</div>
                    <div className="text-lg font-bold text-green-800">
                      {Math.round((Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length / Object.keys(dailyCheckIns).length) * 100)}%
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                      <div className="bg-green-500 h-1 rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="text-xs text-purple-600 font-medium mb-1">Umore</div>
                    <div className="text-lg font-bold text-purple-800">Stabile</div>
                    <div className="flex gap-1 mt-2">
                      {Array.from({length: 5}, (_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-purple-500' : 'bg-purple-200'}`}></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                    <div className="text-xs text-orange-600 font-medium mb-1">Streak</div>
                    <div className="text-lg font-bold text-orange-800">{Object.keys(dailyCheckIns).length} giorni</div>
                    <div className="text-xs text-orange-600 mt-1">In crescita</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* OPZIONE 2: Timeline interattiva */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-6 mt-8">
                <div className="text-sm font-medium text-foreground">OPZIONE 2: Timeline Interattiva</div>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                  {Array.from({ length: 7 }, (_, i) => {
                    const day = Math.max(1, currentDay - 6 + i);
                    const dayData = dailyCheckIns[day];
                    const isGoodDay = dayData && (
                      (dayData.phoneTime === 'Meno di 1h' || dayData.phoneTime === '1–2h') ||
                      dayData.scrollImpulse === 'Mai'
                    );
                    
                    return (
                      <div key={i} className="relative flex items-center gap-4 pb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                          isGoodDay ? 'bg-green-100 border-green-500 text-green-700' : 
                          dayData ? 'bg-yellow-100 border-yellow-500 text-yellow-700' :
                          'bg-muted border-border text-muted-foreground'
                        }`}>
                          {day}
                        </div>
                        <div className="flex-1 bg-card rounded-lg p-3 border">
                          <div className="text-sm font-medium">Giorno {day}</div>
                          {dayData ? (
                            <div className="text-xs text-muted-foreground mt-1">
                              📱 {dayData.phoneTime} • 🎯 {dayData.scrollImpulse || 'N/A'} • 😌 {dayData.dailyFeeling?.slice(0, 10) || 'N/A'}...
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground mt-1">Nessun check-in</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* OPZIONE 3: Grafici a torta + barre */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-6 mt-8">
                <div className="text-sm font-medium text-foreground">OPZIONE 3: Distribuzione + Confronti</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-sm font-medium mb-3">Tempo Telefono</div>
                    <div className="space-y-2">
                      {['Meno di 1h', '1–2h', '2–3h', 'Più di 3h'].map(time => {
                        const count = Object.values(dailyCheckIns).filter(day => day.phoneTime === time).length;
                        const percentage = (count / Object.keys(dailyCheckIns).length) * 100;
                        return (
                          <div key={time} className="flex items-center gap-2">
                            <div className="text-xs w-16">{time}</div>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <div className="text-xs w-8">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-sm font-medium mb-3">Controllo Impulsi</div>
                    <div className="space-y-2">
                      {['Mai', 'Una volta', 'Più volte'].map(impulse => {
                        const count = Object.values(dailyCheckIns).filter(day => day.scrollImpulse === impulse).length;
                        const percentage = (count / Object.keys(dailyCheckIns).length) * 100;
                        const color = impulse === 'Mai' ? 'bg-green-500' : impulse === 'Una volta' ? 'bg-yellow-500' : 'bg-red-500';
                        return (
                          <div key={impulse} className="flex items-center gap-2">
                            <div className="text-xs w-16">{impulse}</div>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className={`${color} h-2 rounded-full transition-all duration-300`}
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <div className="text-xs w-8">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* OPZIONE 4: Stile fitness tracker */}
            {Object.keys(dailyCheckIns).length > 0 ? (
              <div className="space-y-6 mt-8">
                <div className="text-sm font-medium text-foreground">OPZIONE 4: Fitness Tracker Style</div>
                
                {/* Anelli di progresso */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      {/* Anello esterno - Tempo */}
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="6"/>
                      <circle 
                        cx="60" cy="60" r="54" fill="none" stroke="#22c55e" strokeWidth="6"
                        strokeDasharray={`${(Object.values(dailyCheckIns).filter(day => day.phoneTime === 'Meno di 1h').length / Object.keys(dailyCheckIns).length) * 339.292} 339.292`}
                        strokeLinecap="round"
                      />
                      
                      {/* Anello medio - Controllo */}
                      <circle cx="60" cy="60" r="42" fill="none" stroke="#e2e8f0" strokeWidth="6"/>
                      <circle 
                        cx="60" cy="60" r="42" fill="none" stroke="#3b82f6" strokeWidth="6"
                        strokeDasharray={`${(Object.values(dailyCheckIns).filter(day => day.scrollImpulse === 'Mai').length / Object.keys(dailyCheckIns).length) * 263.894} 263.894`}
                        strokeLinecap="round"
                      />
                      
                      {/* Anello interno - Umore */}
                      <circle cx="60" cy="60" r="30" fill="none" stroke="#e2e8f0" strokeWidth="6"/>
                      <circle 
                        cx="60" cy="60" r="30" fill="none" stroke="#8b5cf6" strokeWidth="6"
                        strokeDasharray={`${(Object.values(dailyCheckIns).filter(day => day.dailyFeeling === 'Calmo/a e concentrato/a').length / Object.keys(dailyCheckIns).length) * 188.496} 188.496`}
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Centro con streak */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Object.keys(dailyCheckIns).length}</div>
                        <div className="text-xs text-muted-foreground">giorni</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legenda anelli */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <div className="text-xs">Tempo</div>
                  </div>
                  <div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <div className="text-xs">Controllo</div>
                  </div>
                  <div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                    <div className="text-xs">Umore</div>
                  </div>
                </div>
                
                {/* Badge achievements */}
                <div className="flex justify-center gap-2">
                  {Object.keys(dailyCheckIns).length >= 3 && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      🔥 3 giorni consecutivi
                    </div>
                  )}
                  {Object.values(dailyCheckIns).filter(day => day.phoneTime === 'Meno di 1h').length >= 2 && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      📱 Master del tempo
                    </div>
                  )}
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