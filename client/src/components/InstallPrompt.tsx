import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useLocalStorage from '@/hooks/useLocalStorage';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [promptDismissed, setPromptDismissed] = useLocalStorage('install-prompt-dismissed', false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
      
      // If app is standalone, automatically dismiss the prompt
      if (standalone) {
        setPromptDismissed(true);
        setShowInstallPrompt(false);
      }
    };

    checkStandalone();
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (!promptDismissed && !isStandalone) {
        setShowInstallPrompt(true);
      }
    };

    // Show install prompt for mobile devices only if not already installed
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile && !promptDismissed && !isStandalone) {
      setShowInstallPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mediaQuery.removeEventListener('change', checkStandalone);
    };
  }, [promptDismissed, isStandalone]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // Show manual instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let instructions = "";
      if (isIOS) {
        instructions = "Tocca l'icona 'Condividi' in basso, poi 'Aggiungi alla schermata Home'";
      } else if (isAndroid) {
        instructions = "Tocca il menu (3 punti) e seleziona 'Aggiungi alla schermata principale'";
      } else {
        instructions = "Cerca l'icona di installazione nella barra degli indirizzi del browser";
      }
      
      alert(`Per installare ScrollStop:\n\n${instructions}`);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setPromptDismissed(true);
  };

  if (!showInstallPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <Card className="bg-primary text-primary-foreground shadow-xl border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Installa ScrollStop</div>
                <div className="text-xs opacity-90">
                  {deferredPrompt ? 'Pronto per installazione' : 'Aggiungi alla schermata principale'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-primary-foreground hover:bg-white/20 h-8 w-8 p-0"
                onClick={handleDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 text-xs px-3"
                onClick={handleInstall}
              >
                Installa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPrompt;