import React, { useState } from 'react';
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      goal: ""
    }
  });

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <section className="mx-4 mt-8 mb-6">
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
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 border border-border/30">
            <h2 className="text-xl font-bold text-foreground mb-2">Iniziamo insieme</h2>
            <p className="text-muted-foreground mb-6">Solo 3 informazioni per personalizzare la tua esperienza</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">Nome utente</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">Età</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="La tua età" 
                          {...field} 
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground text-sm font-medium">Obiettivo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Qual è il tuo obiettivo alla fine dei 30 giorni?" 
                          {...field}
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-20 rounded-xl resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold h-12 rounded-full mt-6"
                >
                  Avanti
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;