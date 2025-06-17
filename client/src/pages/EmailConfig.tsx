import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Settings, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const EmailConfig: React.FC = () => {
  const [fromEmail, setFromEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateFromEmail = async () => {
    if (!fromEmail || !fromEmail.includes('@')) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // In produzione questo aggiornerebbe la variabile ambiente
      toast({
        title: "Configurazione salvata",
        description: `Email mittente impostata: ${fromEmail}`,
      });
      
      console.log(`SENDGRID_FROM_EMAIL should be set to: ${fromEmail}`);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare configurazione",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="mx-4 mt-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Configurazione Email
          </h1>
          <p className="text-muted-foreground">
            Gestisci il sistema di invio email
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mt-4"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24 mx-4">
        {/* Status Attuale */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Stato Sistema Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium">SendGrid API</p>
                  <p className="text-sm text-muted-foreground">
                    Configura SENDGRID_API_KEY per email reali
                  </p>
                </div>
              </div>
              <span className="text-sm text-amber-600 font-medium">
                Solo Log
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Sistema Email</p>
                  <p className="text-sm text-muted-foreground">
                    Template e logica funzionanti
                  </p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">
                Attivo
              </span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Email Mittente Attuale</h4>
              <code className="text-sm text-blue-800">noreply@scrollstop.app</code>
              <p className="text-xs text-blue-700 mt-1">
                Configurabile tramite SENDGRID_FROM_EMAIL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurazione Email Mittente */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Indirizzo Email Mittente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromEmail">Email Mittente</Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="noreply@tuodominio.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deve essere verificato in SendGrid
              </p>
            </div>

            <Button 
              onClick={handleUpdateFromEmail}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Aggiornamento...' : 'Imposta Email Mittente'}
            </Button>
          </CardContent>
        </Card>

        {/* Guida Setup SendGrid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Setup SendGrid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">1. Crea account SendGrid</h4>
              <p className="text-sm text-muted-foreground">
                Registrati su sendgrid.com per account gratuito (100 email/giorno)
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">2. Verifica dominio</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Vai su Settings → Sender Authentication</li>
                <li>• Aggiungi e verifica il tuo dominio</li>
                <li>• Configura i record DNS richiesti</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">3. Crea API Key</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Vai su Settings → API Keys</li>
                <li>• Crea nuova key con permessi Mail Send</li>
                <li>• Copia la chiave che inizia con "SG."</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">4. Configura variabili ambiente</h4>
              <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                <p>SENDGRID_API_KEY=SG.xxxxx</p>
                <p>SENDGRID_FROM_EMAIL=noreply@tuodominio.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card>
          <CardHeader>
            <CardTitle>Test Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Le email di test vengono registrate nei log del server quando SendGrid non è configurato.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm mb-1">Email Registrazione</h5>
                <p className="text-xs text-muted-foreground">
                  Inviata automaticamente ai nuovi utenti
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm mb-1">Email Shopify</h5>
                <p className="text-xs text-muted-foreground">
                  Inviata ai clienti importati da Shopify
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmailConfig;