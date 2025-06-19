import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PWADevNotice() {
  // Only show in development
  const isDev = window.location.hostname.includes('replit');
  
  if (!isDev) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-orange-800 mb-1">
              Modalità Sviluppo PWA
            </div>
            <div className="text-orange-700">
              <strong>Importante:</strong> Le PWA funzionano completamente solo quando pubblicate su domini reali (non .replit.dev). Per l'esperienza fullscreen:
            </div>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-orange-700">
              <li>Pubblica su Netlify/Vercel con il comando push</li>
              <li>Visita il sito dal dominio pubblico su mobile</li>
              <li>Installa l'app tramite il banner</li>
              <li>Apri solo dall'icona della home screen</li>
            </ol>
            <div className="text-orange-600 text-xs mt-2">
              Solo così il banner sparirà e l'app si aprirà senza barre del browser.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}