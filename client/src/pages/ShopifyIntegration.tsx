import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Store, Download, Webhook, Mail, CheckCircle } from 'lucide-react';

const ShopifyIntegration: React.FC = () => {
  const [shopUrl, setShopUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!shopUrl || !apiKey) {
      toast({
        title: "Campi obbligatori",
        description: "Inserisci URL shop e API key",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const response = await apiRequest('POST', '/api/shopify/import', {
        shopUrl: shopUrl.replace('.myshopify.com', ''),
        shopifyApiKey: apiKey
      });

      const result = await response.json();
      setImportResult(result);
      
      toast({
        title: "Importazione completata",
        description: `Importati ${result.imported} clienti su ${result.total}`,
      });
    } catch (error) {
      toast({
        title: "Errore importazione",
        description: "Verifica URL e API key",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const webhookUrl = window.location.origin;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="mx-4 mt-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Integrazione Shopify
          </h1>
          <p className="text-muted-foreground">
            Connetti il tuo negozio per registrare automaticamente i clienti
          </p>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto mt-4"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 overflow-auto hide-scrollbar pb-24 mx-4">
        {/* Setup Guide */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Guida Configurazione
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">1. Crea API Key in Shopify</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Vai su Settings → Apps and sales channels</li>
                <li>• Clicca "Develop apps" → "Create an app"</li>
                <li>• Configura permessi: read_customers, read_orders</li>
                <li>• Copia la Admin API access token</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">2. Configura Webhook (Opzionale)</h4>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">URL Webhook per nuovi clienti:</p>
                <code className="text-xs break-all">{webhookUrl}/api/shopify/webhooks/customers/create</code>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">URL Webhook per nuovi ordini:</p>
                <code className="text-xs break-all">{webhookUrl}/api/shopify/webhooks/orders/create</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Importa Clienti Esistenti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shopUrl">URL Negozio Shopify</Label>
              <Input
                id="shopUrl"
                placeholder="mio-negozio"
                value={shopUrl}
                onChange={(e) => setShopUrl(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Solo il nome (senza .myshopify.com)
              </p>
            </div>

            <div>
              <Label htmlFor="apiKey">Admin API Access Token</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="shpat_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleImport}
              disabled={isImporting}
              className="w-full"
            >
              {isImporting ? 'Importazione in corso...' : 'Importa Clienti'}
            </Button>

            {importResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Importazione completata</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  {importResult.imported} clienti importati su {importResult.total} totali
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Vantaggi Integrazione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Registrazione automatica clienti che acquistano</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Attivazione premium automatica per ordini €14.90+</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Email di benvenuto automatiche</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sincronizzazione dati cliente unificata</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ShopifyIntegration;