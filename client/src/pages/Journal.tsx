import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronRight, BookOpen, BarChart, Clock, CheckCircle } from 'lucide-react';
import TabNavigation from '@/components/TabNavigation';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DayProgress } from '@/types';
import { challenges } from '@/lib/challenges';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Journal: React.FC = () => {
  const [progress] = useLocalStorage<DayProgress[]>('digital-detox-progress', []);
  
  // Get entries with reflections
  const reflectionEntries = progress
    .filter(entry => entry.reflectionText && entry.reflectionText.trim() !== '')
    .sort((a, b) => b.day - a.day); // Sort by day, most recent first
  
  const formatDate = (date: Date | undefined | null): string => {
    if (!date) return 'Data non disponibile';
    return format(new Date(date), 'd MMMM yyyy', { locale: it });
  };
  
  const getCompletionBadge = (status: string | undefined) => {
    if (status === 'yes') {
      return <Badge className="bg-secondary hover:bg-secondary/90">Completato</Badge>;
    } else if (status === 'partial') {
      return <Badge className="bg-muted hover:bg-muted/90 text-muted-foreground">Parziale</Badge>;
    } else if (status === 'no') {
      return <Badge variant="destructive">Non completato</Badge>;
    }
    return null;
  };
  
  const getChallengeTitle = (day: number): string => {
    const challenge = challenges.find(c => c.day === day);
    return challenge ? challenge.title : `Giorno ${day}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with ScrollStop Logo */}
      <Header />

      {/* Header */}
      <section className="mx-4 mt-6 mb-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">
              Diario
            </h1>
          </div>
          <p className="text-foreground text-sm font-bold mb-3">
            Le tue riflessioni e pensieri del percorso
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        <section className="mx-4 my-4">
          
          {reflectionEntries.length === 0 ? (
            <div className="mb-4 bg-neutral-700 rounded-lg p-6 shadow-sm">
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">Nessuna riflessione</h3>
                <p className="text-white/70">
                  Completa le sfide giornaliere e scrivi le tue riflessioni per vederle qui.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reflectionEntries.map((entry, index) => (
                <div key={index} className="mb-4 bg-neutral-700 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Giorno {entry.day}: {getChallengeTitle(entry.day)}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-white/70">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{formatDate(entry.completedAt)}</span>
                      </div>
                    </div>
                    <div>
                      {getCompletionBadge(entry.completionStatus)}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-neutral-600">
                    <p className="text-white whitespace-pre-line">{entry.reflectionText}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {reflectionEntries.length > 0 && (
          <section className="bg-neutral-700 rounded-lg shadow-sm mx-4 my-4 p-6 mb-10">
            <div className="flex items-center mb-3">
              <BarChart className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-white">Statistiche sul diario</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <BookOpen className="w-4 h-4 text-primary mr-1" />
                  <p className="text-sm text-white/70">Riflessioni</p>
                </div>
                <p className="text-xl font-bold text-secondary">{reflectionEntries.length}</p>
              </div>
              <div className="bg-neutral-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <CheckCircle className="w-4 h-4 text-primary mr-1" />
                  <p className="text-sm text-white/70">Completamento</p>
                </div>
                <p className="text-xl font-bold text-secondary">
                  {Math.round((reflectionEntries.length / 30) * 100)}%
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  );
};

export default Journal;
