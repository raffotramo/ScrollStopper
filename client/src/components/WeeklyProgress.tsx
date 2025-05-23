import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Lock, Zap, Brain, Calendar } from 'lucide-react';

interface WeeklyProgressProps {
  currentDay: number;
  completedDays: number[];
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ currentDay, completedDays }) => {
  const getCurrentWeek = () => Math.ceil(currentDay / 7);
  const currentWeek = getCurrentWeek();
  
  const weeklyMissions = [
    { 
      week: 1, 
      title: "Scopri i tuoi trigger", 
      icon: Target, 
      description: "Identifica i momenti in cui scrolli di più",
      color: "bg-blue-500"
    },
    { 
      week: 2, 
      title: "Crea confini digitali", 
      icon: Lock, 
      description: "Stabilisci orari e spazi senza telefono",
      color: "bg-purple-500"
    },
    { 
      week: 3, 
      title: "Sostituisci lo scroll", 
      icon: Zap, 
      description: "Trova attività alternative più gratificanti",
      color: "bg-orange-500"
    },
    { 
      week: 4, 
      title: "Mantieni il cambiamento", 
      icon: Brain, 
      description: "Consolida le nuove abitudini",
      color: "bg-green-500"
    }
  ];

  const getWeekProgress = (week: number) => {
    const weekStart = (week - 1) * 7 + 1;
    const weekEnd = week * 7;
    const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i);
    const completedInWeek = weekDays.filter(day => completedDays.includes(day)).length;
    return { completed: completedInWeek, total: 7, percentage: (completedInWeek / 7) * 100 };
  };

  const getBadges = () => {
    const badges = [];
    
    // Badge per giorni consecutivi
    const consecutiveDays = getConsecutiveDays();
    if (consecutiveDays >= 3) {
      badges.push({ emoji: "🔥", text: `${consecutiveDays} giorni consecutivi`, color: "bg-red-500" });
    }
    
    // Badge per settimane completate
    for (let week = 1; week <= 4; week++) {
      const weekProgress = getWeekProgress(week);
      if (weekProgress.completed >= 5) {
        badges.push({ 
          emoji: "🏅", 
          text: `Settimana ${week} completata!`, 
          color: weeklyMissions[week - 1].color 
        });
      }
    }
    
    // Badge speciali
    if (completedDays.length >= 10) {
      badges.push({ emoji: "⭐", text: "Veterano del detox", color: "bg-yellow-500" });
    }
    
    if (completedDays.length >= 20) {
      badges.push({ emoji: "🎯", text: "Master del controllo", color: "bg-indigo-500" });
    }

    return badges;
  };

  const getConsecutiveDays = () => {
    if (completedDays.length === 0) return 0;
    
    const sortedDays = [...completedDays].sort((a, b) => b - a);
    let consecutive = 1;
    
    for (let i = 1; i < sortedDays.length; i++) {
      if (sortedDays[i-1] - sortedDays[i] === 1) {
        consecutive++;
      } else {
        break;
      }
    }
    
    return consecutive;
  };

  const badges = getBadges();

  return (
    <div className="space-y-4">
      {/* Missione Settimanale Corrente */}
      <Card className="bg-card border border-border rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            Missione Settimana {currentWeek}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyMissions.map((mission) => {
            const Icon = mission.icon;
            const isCurrentWeek = mission.week === currentWeek;
            const isCompleted = mission.week < currentWeek;
            const weekProgress = getWeekProgress(mission.week);
            
            return (
              <div 
                key={mission.week}
                className={`p-3 rounded-lg border mb-3 ${
                  isCurrentWeek 
                    ? 'border-primary bg-primary/10' 
                    : isCompleted 
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-500 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full ${mission.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{mission.title}</h4>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                  {isCompleted && <Trophy className="w-5 h-5 text-yellow-500" />}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="text-foreground font-semibold">{weekProgress.completed}/7 giorni</span>
                  </div>
                  <Progress value={weekProgress.percentage} className="h-2" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Badge Motivazionali */}
      {badges.length > 0 && (
        <Card className="bg-card border border-border rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              I tuoi badge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  className={`${badge.color} text-white border-0 px-3 py-1`}
                >
                  {badge.emoji} {badge.text}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar Generale */}
      <Card className="bg-card border border-border rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            Progresso totale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Giorni completati</span>
              <span className="text-foreground font-semibold">{completedDays.length}/30</span>
            </div>
            <Progress value={(completedDays.length / 30) * 100} className="h-3" />
            
            {/* Striscia giorni completati */}
            <div className="grid grid-cols-10 gap-1 mt-4">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium transition-colors ${
                    completedDays.includes(day)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : day === currentDay
                        ? 'border border-primary text-primary bg-primary/10'
                        : day < currentDay
                          ? 'bg-card text-muted-foreground/60 border border-border/30'
                          : 'bg-background text-muted-foreground/50 border border-border/20'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyProgress;