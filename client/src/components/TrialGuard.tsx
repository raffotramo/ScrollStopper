import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Star, Zap } from 'lucide-react';

interface TrialGuardProps {
  children: React.ReactNode;
  userProfile: any;
}

// Componente temporaneo per testare la funzionalità
const TrialTestControls: React.FC<{ userProfile: any }> = ({ userProfile }) => {
  const handleExpireTrial = () => {
    const expiredProfile = {
      ...userProfile,
      trialStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 giorni fa
    };
    localStorage.setItem('digital-detox-profile', JSON.stringify(expiredProfile));
    window.location.reload();
  };

  const handleResetTrial = () => {
    const freshProfile = {
      ...userProfile,
      trialStartDate: new Date().toISOString()
    };
    localStorage.setItem('digital-detox-profile', JSON.stringify(freshProfile));
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-lg text-xs space-y-1 z-50">
      <div className="text-yellow-300 font-semibold">Test Prova (Solo Dev)</div>
      <button onClick={handleExpireTrial} className="block w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded">
        Scadi Prova
      </button>
      <button onClick={handleResetTrial} className="block w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded">
        Reset Prova
      </button>
    </div>
  );
};

const TrialGuard: React.FC<TrialGuardProps> = ({ children, userProfile }) => {
  // Calcola i giorni rimanenti della prova
  const getTrialStatus = () => {
    if (!userProfile?.trialStartDate) {
      return { isExpired: false, daysLeft: 2, hoursLeft: 48 };
    }

    const startDate = new Date(userProfile.trialStartDate);
    const currentDate = new Date();
    const trialEndDate = new Date(startDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 giorni
    
    const timeLeft = trialEndDate.getTime() - currentDate.getTime();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    const daysLeft = Math.max(0, Math.floor(hoursLeft / 24));
    
    return {
      isExpired: timeLeft <= 0,
      daysLeft,
      hoursLeft: hoursLeft % 24,
      totalHoursLeft: hoursLeft
    };
  };

  const trialStatus = getTrialStatus();

  // Se la prova è scaduta, mostra il messaggio di upgrade
  if (trialStatus.isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Prova Terminata
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              La tua prova gratuita di 2 giorni è terminata. 
              Continua il tuo percorso di digital detox con la versione completa!
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Versione Completa Include:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  30 giorni di sfide complete
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Strumenti anti-scrolling avanzati
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-500" />
                  Analisi dettagliate del progresso
                </li>
              </ul>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Acquista Versione Completa
            </Button>
            
            <p className="text-xs text-gray-500">
              I tuoi progressi sono stati salvati e saranno disponibili dopo l'upgrade
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Banner della prova in alto */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">
            Prova gratuita: {trialStatus.daysLeft > 0 
              ? `${trialStatus.daysLeft} giorno${trialStatus.daysLeft > 1 ? 'i' : ''} e ${trialStatus.hoursLeft} ore rimaste`
              : `${trialStatus.totalHoursLeft} ore rimaste`
            }
          </span>
        </div>
      </div>
      {children}
      
      {/* Controlli di test - rimuovere in produzione */}
      <TrialTestControls userProfile={userProfile} />
    </div>
  );
};

export default TrialGuard;