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
      {/* Header with ScrollStop Logo */}
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Welcome Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Creiamo il tuo profilo
            </h1>
            <p className="text-muted-foreground mb-6">
              Questi dati sono necessari per calcolare i tuoi progressi.
            </p>
          </div>
        
          <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Iniziamo insieme</h2>
            <p className="text-muted-foreground mb-6">Solo 3 informazioni per personalizzare la tua esperienza</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center">
                        <User className="w-4 h-4 text-primary mr-2" />
                        Come ti chiami?
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Il tuo nome" 
                          {...field} 
                          className="bg-neutral-700 border-gray-500 text-white placeholder:text-gray-400"
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
                      <FormLabel className="text-white flex items-center">
                        <User className="w-4 h-4 text-primary mr-2" />
                        Quanti anni hai?
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="La tua età" 
                          {...field} 
                          className="bg-neutral-700 border-gray-500 text-white placeholder:text-gray-400"
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
                      <FormLabel className="text-white flex items-center">
                        <Target className="w-4 h-4 text-primary mr-2" />
                        Qual è il tuo obiettivo alla fine dei 30 giorni?
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrivi cosa vuoi ottenere..." 
                          {...field}
                          className="bg-neutral-700 border-gray-500 text-white placeholder:text-gray-400 min-h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 mt-6"
                >
                  Inizia la sfida
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