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
import { User, Clock, Compass, Target } from 'lucide-react';
import Header from '@/components/Header';
import useLocalStorage from '@/hooks/useLocalStorage';
import logoImage from '@assets/Progetto senza titolo (4).png';

// Schema per il form semplificato
const formSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "L'età deve essere un numero positivo",
  }),
  goal: z.string().min(5, { message: "Inserisci un obiettivo di almeno 5 caratteri" })
});

type FormValues = z.infer<typeof formSchema>;

const Onboarding: React.FC = () => {
  const [, setUserProfile] = useLocalStorage('user-profile', {});
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      goal: ""
    }
  });

  useEffect(() => {
    // Sequenza animazioni
    const timer1 = setTimeout(() => setShowLogo(true), 300);
    const timer2 = setTimeout(() => setShowClaim(true), 1500);
    const timer3 = setTimeout(() => {
      setShowLogo(false);
      setShowClaim(false);
    }, 3500);
    const timer4 = setTimeout(() => setShowIntro(false), 4000);

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

  // Schermata animazione introduttiva
  if (showIntro) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center">
        <div className="text-center">
          {/* Logo animato */}
          <div className={`transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <img 
                src={logoImage} 
                alt="ScrollStop" 
                className="w-80 h-auto mx-auto"
              />
            </div>
          </div>
          
          {/* Claim animato */}
          <div className={`transition-opacity duration-1000 ${showClaim ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-2xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
              Trasforma le tue abitudini digitali<br />
              in 30 giorni
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <section className="mx-4 mt-8 mb-2">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Inizia il tuo percorso
          </h1>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </section>
      
      <div className="flex-1 flex flex-col items-center justify-start p-4">
        <div className="max-w-md w-full space-y-4">
          {/* Intro Card */}
          <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Iniziamo insieme</h2>
            <p className="text-muted-foreground">Solo 3 informazioni per personalizzare la tua esperienza</p>
          </div>
            
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Nome Card */}
              <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-foreground">Il tuo nome</h3>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Inserisci il tuo nome" 
                          {...field} 
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Età Card */}
              <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-foreground">La tua età</h3>
                </div>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Inserisci la tua età" 
                          {...field} 
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Obiettivo Card */}
              <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-foreground">Il tuo obiettivo</h3>
                </div>
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Cosa vuoi ottenere alla fine dei 30 giorni?" 
                          {...field}
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-20 rounded-xl resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button Card */}
              <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white hover:bg-primary/90 font-semibold h-12 rounded-xl"
                >
                  Inizia il percorso
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;