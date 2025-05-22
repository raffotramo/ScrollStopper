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
  const [, setUserProfile] = useLocalStorage('user-profile', {});
  const [, setLocation] = useLocation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      socialTime: "",
      favoriteApp: "",
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
    <div className="min-h-screen flex flex-col">
      {/* Header with ScrollStop Logo */}
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* New Titles */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-3">
              Il tuo tempo vale più di uno scroll.
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              Hai più potere di quanto pensi.
            </p>
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
                          Come ti chiami?
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Il tuo nome" 
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
                        <FormLabel className="text-white flex items-center">
                          <User className="w-4 h-4 text-primary mr-2" />
                          Quanti anni hai?
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="La tua età" 
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
                          Quanto tempo passi sui social ogni giorno?
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Seleziona il tempo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-2 ore">1-2 ore</SelectItem>
                            <SelectItem value="3-4 ore">3-4 ore</SelectItem>
                            <SelectItem value="5-6 ore">5-6 ore</SelectItem>
                            <SelectItem value="7+ ore">7+ ore</SelectItem>
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
                          Su quale app passi più tempo?
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Seleziona l'app" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="twitter">Twitter/X</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="altro">Altro</SelectItem>
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
                            placeholder="Descrivi cosa vuoi ottenere..." 
                            {...field}
                            className="bg-neutral-700 border-neutral-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                  >
                    Inizia la sfida
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;