import React from 'react';
import { Clock, Lock, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DailyAccessControlProps {
  canAccessToday: boolean;
  timeUntilUnlock: number;
  currentDay: number;
  lastAccessDate: Date | null;
  isDayCompleted: boolean;
  onReset?: () => void;
  showResetButton?: boolean;
}

const DailyAccessControl: React.FC<DailyAccessControlProps> = ({
  canAccessToday,
  timeUntilUnlock,
  currentDay,
  lastAccessDate,
  isDayCompleted,
  onReset,
  showResetButton = false
}) => {
  // Format time until unlock
  const formatTimeUntilUnlock = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Format last access date
  const formatLastAccess = (date: Date | null): string => {
    if (!date) return 'Mai';
    
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateString = date.toISOString().split('T')[0];
    const todayString = now.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    if (dateString === todayString) {
      return 'Oggi';
    } else if (dateString === yesterdayString) {
      return 'Ieri';
    } else {
      return date.toLocaleDateString('it-IT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (!canAccessToday) {
    return (
      <Card className="w-full border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Lock className="w-5 h-5" />
            Accesso Limitato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Giorno {currentDay} - Bloccato
            </h3>
            <p className="text-sm text-amber-700 mb-4">
              Puoi accedere al prossimo giorno solo dopo la mezzanotte
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-800">Sblocco in:</span>
              <Badge variant="outline" className="text-amber-700 border-amber-300">
                {formatTimeUntilUnlock(timeUntilUnlock)}
              </Badge>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${100 - (timeUntilUnlock / 86400) * 100}%` // 86400 seconds in a day
                }}
              />
            </div>
          </div>

          <div className="text-center text-xs text-amber-600">
            <p>Ultimo accesso: {formatLastAccess(lastAccessDate)}</p>
            <p className="mt-1">
              Il sistema giornaliero aiuta a mantenere un ritmo costante e salutare
            </p>
          </div>

          {showResetButton && onReset && (
            <Button 
              onClick={onReset}
              variant="outline"
              size="sm"
              className="w-full text-amber-700 border-amber-300 hover:bg-amber-100"
            >
              Reset Giornaliero (Solo per Test)
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // When access is allowed
  return (
    <Card className="w-full border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            {isDayCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Calendar className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-green-900">
                Giorno {currentDay}
              </h3>
              {isDayCompleted && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Completato
                </Badge>
              )}
            </div>
            <p className="text-sm text-green-700">
              {isDayCompleted 
                ? 'Ottimo lavoro! Attività completata per oggi'
                : 'Puoi accedere all\'attività di oggi'
              }
            </p>
          </div>
        </div>

        {showResetButton && onReset && (
          <Button 
            onClick={onReset}
            variant="outline"
            size="sm"
            className="w-full mt-3 text-green-700 border-green-300 hover:bg-green-100"
          >
            Reset Giornaliero (Solo per Test)
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyAccessControl;