import React, { useState } from 'react';
import { Crown, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import StripeCheckout from '@/components/StripeCheckout';

const Pricing: React.FC = () => {
  const [, setLocation] = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleTrialSelect = () => {
    // For now, just redirect back - in a real app this would start a 48h trial
    setLocation('/');
  };

  const handlePremiumSelect = () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    // Redirect to home after successful payment
    setLocation('/');
  };

  const handleBack = () => {
    if (showCheckout) {
      setShowCheckout(false);
    } else {
      setLocation('/');
    }
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-[#eeeded]">
        <Header />
        <main className="p-4">
          <StripeCheckout 
            onSuccess={handleCheckoutSuccess}
            onBack={handleBack}
          />
        </main>
      </div>
    );
  }

  const premiumFeatures = [
    "Utilizzi illimitati del Pronto Soccorso Scroll",
    "Accesso completo a tutti gli strumenti anti-scrolling",
    "Statistiche dettagliate di progresso",
    "Analisi personalizzate del comportamento",
    "Gesti mindful con feedback aptico",
    "Timer personalizzabili",
    "Cronologia completa delle attività",
    "Supporto prioritario",
    "Aggiornamenti anticipati delle funzionalità"
  ];

  return (
    <div className="min-h-screen bg-[#eeeded]">
      <Header />
      
      <main className="p-4 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Scegli il tuo piano</h1>
        </div>

        {/* Trial Option */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-primary">Prova Gratuita 48h</CardTitle>
            <div className="text-3xl font-bold">€0</div>
            <p className="text-muted-foreground text-sm">
              Prova tutte le funzionalità premium per 48 ore
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {premiumFeatures.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground pt-2">
                + Accesso limitato nel tempo a tutte le altre funzionalità
              </div>
            </div>
            
            <Button 
              onClick={handleTrialSelect}
              className="w-full"
              variant="outline"
            >
              Inizia Prova Gratuita
            </Button>
          </CardContent>
        </Card>

        {/* Premium Option */}
        <Card className="border-2 border-orange-500 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              <CardTitle className="text-xl">ScrollStop Premium</CardTitle>
            </div>
            <div className="text-4xl font-bold">€14.90</div>
            <p className="text-orange-100 text-sm">
              Accesso completo e illimitato per sempre
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-green-800 text-sm font-medium">
                💡 Investimento una tantum
              </div>
              <div className="text-green-700 text-xs">
                Nessun abbonamento ricorrente
              </div>
            </div>
            
            <Button 
              onClick={handlePremiumSelect}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              Sblocca Premium Ora
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground pt-4">
          Pagamento sicuro elaborato da Stripe • Politica di rimborso 30 giorni
        </div>
      </main>
    </div>
  );
};

export default Pricing;