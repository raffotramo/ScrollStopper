import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Star, Zap, Crown, Check } from 'lucide-react';

interface PricingChoiceProps {
  onTrialSelect: () => void;
  onPremiumSelect: () => void;
}

const PricingChoice: React.FC<PricingChoiceProps> = ({ onTrialSelect, onPremiumSelect }) => {
  return (
    <div className="min-h-screen bg-[#eeeded] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            Scegli la tua versione di ScrollStop
          </h1>
          <p className="text-gray-700">
            Inizia il tuo percorso di digital detox oggi stesso
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Prova Gratuita */}
          <Card className="relative bg-white border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl font-bold text-black">
                Prova Gratuita
              </CardTitle>
              <div className="text-2xl font-bold text-black">
                48 ore
              </div>
              <p className="text-gray-700">
                Testa tutte le funzionalità
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Accesso completo per 2 giorni</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Strumenti anti scrolling</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Tracking di progresso</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Aiuti motivazionali</span>
                </li>
              </ul>
              
              <Button 
                onClick={onTrialSelect}
                className="w-full bg-black hover:bg-gray-800 text-white"
                size="lg"
              >
                Inizia Prova Gratuita
              </Button>
              
              <p className="text-xs text-gray-600 text-center">
                Nessun pagamento richiesto
              </p>
            </CardContent>
          </Card>

          {/* Versione Premium */}
          <Card className="relative bg-white border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                Consigliato
              </div>
            </div>
            
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl font-bold text-black">
                Versione Premium
              </CardTitle>
              <div className="text-2xl font-bold text-black">
                €14,90
              </div>
              <p className="text-gray-700">
                Accesso illimitato per sempre
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Accesso alla sfida completa</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Nessun limite di tempo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Strumenti anti scrolling avanzati</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Analisi dettagliate di progresso</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span>Aiuti motivazionali</span>
                </li>
              </ul>
              
              <Button 
                onClick={onPremiumSelect}
                className="w-full bg-black hover:bg-gray-800 text-white"
                size="lg"
              >
                Sblocca Versione Premium
              </Button>
              
              <p className="text-xs text-gray-600 text-center">
                Pagamento sicuro con Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingChoice;