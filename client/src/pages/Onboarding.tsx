import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Clock, Compass, Target, Zap, Smartphone, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
import logoImage from '@assets/Progetto senza titolo (4).png';

// Schema per il form multi-step
const formSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "L'età deve essere un numero positivo",
  }),
  screenTime: z.string().min(1, { message: "Seleziona un'opzione" })
});

type FormValues = z.infer<typeof formSchema>;

const Onboarding: React.FC = () => {
  const [, setUserProfile] = useLocalStorage('user-profile', {});
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      screenTime: ""
    }
  });

  useEffect(() => {
    // Sequenza animazioni
    const timer1 = setTimeout(() => setShowLogo(true), 300);
    const timer2 = setTimeout(() => setShowLogo(false), 2500);
    const timer3 = setTimeout(() => setShowClaim(true), 3000);
    const timer4 = setTimeout(() => setShowButton(true), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted with data:', data);
    try {
      setUserProfile(data);
      console.log('Profile saved, redirecting...');
      setLocation('/');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const name = form.getValues('name');
      if (name.length >= 2) {
        setCurrentStep(2);
      } else {
        form.trigger('name');
      }
    } else if (currentStep === 2) {
      const age = form.getValues('age');
      if (age && !isNaN(parseInt(age)) && parseInt(age) > 0) {
        setCurrentStep(3);
      } else {
        form.trigger('age');
      }
    } else if (currentStep === 3) {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Schermata animazione introduttiva
  if (showIntro) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center">
        <div className="text-center">
          {/* Logo animato */}
          <div className={`transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="mb-8">
              <img 
                src={logoImage} 
                alt="ScrollStop" 
                className="w-80 h-auto mx-auto filter invert transition-all duration-1000"
              />
            </div>
          </div>
          
          {/* Claim animato con icona */}
          <div className={`transition-all duration-1000 ${showClaim ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'}`}>
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${showClaim ? 'animate-icon-zoom' : 'scale-0 rotate-180'}`}>
                <Zap className={`w-8 h-8 text-primary transition-all duration-800 ${showClaim ? 'animate-lightning' : ''}`} />
              </div>
              <h2 className={`text-2xl font-bold text-primary mb-4 transition-all duration-1200 ${showClaim ? 'animate-text-wave' : 'opacity-0 translate-x-8'}`}>
                Trasforma le tue abitudini<br />
                digitali in 30 giorni
              </h2>
              <div className={`h-1 bg-primary rounded-full transition-all duration-1500 ${showClaim ? 'w-20 animate-line-draw' : 'w-0'}`}></div>
            </div>
          </div>
          
          {/* Bottone animato */}
          <div className={`transition-all duration-1000 ${showButton ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8'} mt-8`}>
            <Button 
              onClick={() => setShowIntro(false)}
              className={`bg-primary text-white hover:bg-primary/90 font-semibold h-12 px-8 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 ${showButton ? 'animate-button-glow' : ''}`}
            >
              Inizia la tua sfida
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Logo nero in alto */}
      <section className="mx-4 mt-6 mb-6">
        <div className="text-center">
          <img 
            src={logoImage} 
            alt="ScrollStop" 
            className="w-64 h-auto mx-auto filter invert"
          />
        </div>
      </section>

      {/* Barra di progresso */}
      <section className="mx-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Passo {currentStep} di 3</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </section>
      
      <div className="flex-1 flex flex-col items-center justify-start p-4">
        <div className="max-w-md w-full">
          <Form {...form}>
            <form className="space-y-6">
              
              {/* Step 1: Nome */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <section className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-4">
                      Inizia il tuo percorso
                    </h1>
                    <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
                  </section>

                  <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-lg font-semibold">Come ti chiami?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Inserisci il tuo nome" 
                              {...field} 
                              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl mt-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-primary text-white hover:bg-primary/90 font-semibold h-12 rounded-xl"
                  >
                    Continua <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Età */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <section className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">
                      Il tempo è prezioso
                    </h1>
                    <p className="text-muted-foreground mb-4">Ogni momento conta per il tuo benessere digitale</p>
                    <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
                  </section>

                  <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-lg font-semibold">Quanti anni hai?</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="La tua età" 
                              {...field} 
                              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl mt-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl"
                    >
                      Indietro
                    </Button>
                    <Button 
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-primary text-white hover:bg-primary/90 font-semibold h-12 rounded-xl"
                    >
                      Continua <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Tempo schermo */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <section className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">
                      Scopri la verità
                    </h1>
                    <p className="text-muted-foreground mb-4">La consapevolezza è il primo passo verso il cambiamento</p>
                    <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
                  </section>

                  <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                    <FormField
                      control={form.control}
                      name="screenTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-lg font-semibold">Quanto tempo passi scrollando il telefono?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-secondary border-border h-12 rounded-xl mt-4">
                                <SelectValue placeholder="Seleziona un'opzione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-2 ore">1-2 ore al giorno</SelectItem>
                              <SelectItem value="3-4 ore">3-4 ore al giorno</SelectItem>
                              <SelectItem value="5+ ore">5+ ore al giorno</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl"
                    >
                      Indietro
                    </Button>
                    <Button 
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-primary text-white hover:bg-primary/90 font-semibold h-12 rounded-xl"
                    >
                      Inizia il percorso <Target className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;