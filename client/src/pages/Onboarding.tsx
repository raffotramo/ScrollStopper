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
import useLocalStorage from '@/hooks/useLocalStorage';
import logoPath from '../assets/logo.png';

// Schema per il form
const formSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "L'età deve essere un numero positivo",
  }),
  socialTime: z.string({
    required_error: "Seleziona la quantità di tempo",
  }),
  favoriteApp: z.string({
    required_error: "Seleziona un'applicazione",
  }),
  goal: z.string().min(5, { message: "Inserisci un obiettivo di almeno 5 caratteri" })
});

type FormValues = z.infer<typeof formSchema>;

const Onboarding: React.FC = () => {
  const [, setLocation] = useLocation();
  const [userProfile, setUserProfile] = useLocalStorage<FormValues | null>('digital-detox-profile', null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      socialTime: "",
      favoriteApp: "",
      goal: ""
    },
  });

  const onSubmit = (data: FormValues) => {
    setUserProfile(data);
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <img src={logoPath} alt="Digital Detox Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary mb-2">Benvenuto in Digital Detox</h1>
          <p className="text-white/70">Inizia la tua sfida di 30 giorni per ridurre la dipendenza digitale</p>
        </div>
        
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Crea il tuo profilo</CardTitle>
            <CardDescription className="text-white/70">
              Fornisci alcune informazioni per personalizzare la tua esperienza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center">
                        <User className="w-4 h-4 text-primary mr-2" />
                        Il tuo nome
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Inserisci il tuo nome" 
                          {...field}
                          className="bg-neutral-700 border-neutral-600 text-white" 
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
                      <FormLabel className="text-white">Età</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Inserisci la tua età" 
                          {...field}
                          className="bg-neutral-700 border-neutral-600 text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center">
                        <Clock className="w-4 h-4 text-primary mr-2" />
                        Tempo medio giornaliero sui social
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                            <SelectValue placeholder="Seleziona una opzione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="1-2" className="text-white">1-2 ore</SelectItem>
                          <SelectItem value="2-4" className="text-white">2-4 ore</SelectItem>
                          <SelectItem value="4+" className="text-white">Più di 4 ore</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="favoriteApp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center">
                        <Compass className="w-4 h-4 text-primary mr-2" />
                        App in cui passi più tempo
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                            <SelectValue placeholder="Seleziona una app" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-700 border-neutral-600">
                          <SelectItem value="instagram" className="text-white">Instagram</SelectItem>
                          <SelectItem value="tiktok" className="text-white">TikTok</SelectItem>
                          <SelectItem value="facebook" className="text-white">Facebook</SelectItem>
                          <SelectItem value="youtube" className="text-white">YouTube</SelectItem>
                          <SelectItem value="altro" className="text-white">Altro</SelectItem>
                        </SelectContent>
                      </Select>
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
                          placeholder="Descrivi brevemente il tuo obiettivo..." 
                          className="resize-none bg-neutral-700 border-neutral-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                  Inizia la sfida
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;