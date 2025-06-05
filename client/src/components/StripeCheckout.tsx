import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface StripeCheckoutProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CheckoutForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Errore nel pagamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento completato!",
        description: "Benvenuto nella versione premium di ScrollStop",
      });
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Elaborazione...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Completa Acquisto €14,90
          </>
        )}
      </Button>
    </form>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onSuccess, onBack }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Crea il PaymentIntent quando il componente si monta
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 14.90,
        currency: 'eur',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eeeded] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2">Preparazione pagamento...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-[#eeeded] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-red-600">Errore nella preparazione del pagamento. Riprova più tardi.</p>
            <Button onClick={onBack} className="mt-4">
              Torna Indietro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeded] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit p-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ScrollStop Premium
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Accesso illimitato per sempre
            </p>
            <div className="text-3xl font-bold text-blue-600 mt-4">
              €14,90
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm onSuccess={onSuccess} />
          </Elements>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Pagamento sicuro elaborato da Stripe
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeCheckout;