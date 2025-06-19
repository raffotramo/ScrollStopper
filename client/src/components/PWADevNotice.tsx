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
              Per testare l'esperienza fullscreen senza barre del browser:
            </div>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-orange-700">
              <li>Pubblica l'app su un dominio pubblico</li>
              <li>Installa l'app dal banner di installazione</li>
              <li>Apri l'app dalla home screen (non dal browser)</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}