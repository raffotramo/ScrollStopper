import React from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import TabNavigation from '@/components/TabNavigation';
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
      return <Badge className="bg-amber-500 hover:bg-amber-500/90">Parziale</Badge>;
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
      {/* Header */}
      <header className="sticky top-0 bg-neutral-800 shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-secondary">Diario</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24">
        <section className="mx-4 my-4">
          <h2 className="text-lg font-semibold mb-4">Le tue riflessioni</h2>
          
          {reflectionEntries.length === 0 ? (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-1">Nessuna riflessione</h3>
                  <p className="text-neutral-500">
                    Completa le sfide giornaliere e scrivi le tue riflessioni per vederle qui.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reflectionEntries.map((entry, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800">
                          Giorno {entry.day}: {getChallengeTitle(entry.day)}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-neutral-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{formatDate(entry.completedAt)}</span>
                        </div>
                      </div>
                      <div>
                        {getCompletionBadge(entry.completionStatus)}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <p className="text-neutral-700 whitespace-pre-line">{entry.reflectionText}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
        
        {reflectionEntries.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm mx-4 my-4 p-6 mb-10">
            <h2 className="text-lg font-semibold mb-3">Statistiche sul diario</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500">Riflessioni</p>
                <p className="text-xl font-bold text-neutral-800">{reflectionEntries.length}</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500">Completamento</p>
                <p className="text-xl font-bold text-neutral-800">
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
