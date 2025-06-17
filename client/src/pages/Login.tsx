import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Zap } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, 'Username deve essere almeno 3 caratteri'),
  password: z.string().min(6, 'Password deve essere almeno 6 caratteri'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const endpoint = showSignup ? '/api/auth/signup' : '/api/auth/login';
      const response = await apiRequest('POST', endpoint, data);
      
      if (response.ok) {
        toast({
          title: showSignup ? "Account creato!" : "Login effettuato!",
          description: showSignup ? "Benvenuto in ScrollStop" : "Bentornato!",
        });
        setLocation('/');
      } else {
        const error = await response.text();
        toast({
          title: "Errore",
          description: error || "Credenziali non valide",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Problema di connessione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">ScrollStop</h1>
          </div>
          <CardTitle className="text-xl">
            {showSignup ? 'Crea Account' : 'Accedi'}
          </CardTitle>
          <p className="text-muted-foreground">
            {showSignup 
              ? 'Inizia il tuo percorso di 30 giorni' 
              : 'Continua il tuo viaggio di detox digitale'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register('username')}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Caricamento...' : (showSignup ? 'Crea Account' : 'Accedi')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowSignup(!showSignup)}
              className="text-primary hover:underline"
            >
              {showSignup 
                ? 'Hai già un account? Accedi' 
                : 'Non hai un account? Registrati'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;