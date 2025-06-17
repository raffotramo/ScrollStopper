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
        <section className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Scegli la tua versione
          </h1>
          <p className="text-muted-foreground">
            Inizia il tuo percorso di digital detox oggi stesso
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mt-4"></div>
        </section>

        <div className="grid md:grid-cols-2 gap-4 mx-4">
          {/* Prova Gratuita */}
          <div className="bg-card rounded-2xl shadow-sm p-4 border border-border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center">
                  <span className="font-bold text-foreground mr-2">Prova Gratuita</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-background border border-border/50 text-muted-foreground/70">
                    48 ore
                  </span>
                </div>
                <h3 className="font-medium mt-1 text-foreground">Testa tutte le funzionalità</h3>
              </div>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4" />
                <span>Accesso completo per 2 giorni</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4" />
                <span>Strumenti anti scrolling</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4" />
                <span>Tracking di progresso</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4" />
                <span>Aiuti motivazionali</span>
              </div>
            </div>
            
            <Button 
              onClick={onTrialSelect}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              Inizia Prova Gratuita
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Nessun pagamento richiesto
            </p>
          </div>

          {/* Versione Premium */}
          <div className="bg-orange-500 rounded-2xl shadow-sm p-4 border border-orange-600 border-l-4 border-l-orange-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center">
                  <span className="font-bold text-white mr-2">Versione Premium</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-red-200 text-red-800 line-through">
                      €29,90
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white text-orange-600 font-bold">
                      €14,90
                    </span>
                  </div>
                </div>
                <h3 className="font-medium mt-1 text-orange-100">Accesso illimitato per sempre</h3>
              </div>
              <Crown className="w-5 h-5 text-orange-100" />
            </div>
            
            {/* Badge sconto prominente */}
            <div className="mb-4 p-3 bg-orange-200 border border-orange-300 rounded-lg">
              <p className="text-sm text-orange-800 font-bold text-center">
                Dacci fiducia e attivala subito - Sconto 50%
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Star className="w-4 h-4" />
                <span>Accesso alla sfida completa</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Star className="w-4 h-4" />
                <span>Nessun limite di tempo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Star className="w-4 h-4" />
                <span>Strumenti anti scrolling avanzati</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Star className="w-4 h-4" />
                <span>Analisi dettagliate di progresso</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-100">
                <Zap className="w-4 h-4" />
                <span>Aiuti motivazionali</span>
              </div>
            </div>
            
            <Button 
              onClick={onPremiumSelect}
              className="w-full bg-white hover:bg-orange-50 text-orange-600 hover:text-orange-700 font-bold"
              size="sm"
            >
              Sblocca Versione Premium
            </Button>
            
            <p className="text-xs text-orange-200 text-center mt-2">
              Pagamento sicuro con Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingChoice;