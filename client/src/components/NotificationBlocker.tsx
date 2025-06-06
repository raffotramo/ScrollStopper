import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Shield, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface NotificationBlockerProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const NotificationBlocker: React.FC<NotificationBlockerProps> = ({ isActive, onToggle }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [wakeLockSupported, setWakeLockSupported] = useState<boolean>(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [blockedNotifications, setBlockedNotifications] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }

    // Check Wake Lock API support
    if ('wakeLock' in navigator) {
      setWakeLockSupported(true);
    }

    // Listen for visibility changes to maintain focus
    const handleVisibilityChange = () => {
      if (isActive && document.hidden) {
        // Try to bring app back to focus
        window.focus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setHasPermission(permission === 'granted');
        
        if (permission === 'granted') {
          toast({
            title: "Permesso concesso",
            description: "Ora posso aiutarti a gestire le notifiche durante le sessioni",
          });
        }
      } catch (error) {
        toast({
          title: "Errore",
          description: "Non è stato possibile ottenere il permesso per le notifiche",
          variant: "destructive",
        });
      }
    }
  };

  // Enable notification blocking
  const enableBlocking = async () => {
    try {
      // Request wake lock to keep screen active
      if (wakeLockSupported && !wakeLock) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
      }

      // Set page title to indicate focus mode
      document.title = '🔔 ScrollStop - Modalità Focus Attiva';

      // Add meta tag to prevent app switching on mobile
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
      }

      // Show notification to indicate blocking is active
      if (hasPermission) {
        new Notification('ScrollStop - Modalità Focus', {
          body: 'Modalità focus attivata. Le notifiche esterne saranno minimizzate.',
          icon: '/favicon.ico',
          silent: true,
        });
      }

      onToggle(true);
      
      toast({
        title: "Modalità Focus Attivata",
        description: "Le notifiche sono ora bloccate durante la tua sessione",
      });

    } catch (error) {
      toast({
        title: "Errore",
        description: "Non è stato possibile attivare la modalità focus",
        variant: "destructive",
      });
    }
  };

  // Disable notification blocking
  const disableBlocking = () => {
    // Release wake lock
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }

    // Reset page title
    document.title = 'ScrollStop - Digital Wellness';

    // Reset viewport meta tag
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }

    onToggle(false);
    
    toast({
      title: "Modalità Focus Disattivata",
      description: "Le notifiche sono ora nuovamente attive",
    });
  };

  // Override notification API to intercept notifications
  useEffect(() => {
    if (isActive && hasPermission) {
      const originalNotification = window.Notification;
      
      // Intercept new notifications
      window.Notification = class extends originalNotification {
        constructor(title: string, options?: NotificationOptions) {
          // Block external notifications, only allow our app notifications
          if (!title.startsWith('ScrollStop')) {
            setBlockedNotifications(prev => prev + 1);
            console.log('Notifica bloccata:', title);
            return {} as any; // Return empty object instead of showing notification
          }
          super(title, options);
        }
      } as any;

      return () => {
        window.Notification = originalNotification;
      };
    }
  }, [isActive, hasPermission]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Blocco Notifiche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Modalità Focus</span>
          </div>
          <Switch 
            checked={isActive} 
            onCheckedChange={isActive ? disableBlocking : enableBlocking}
          />
        </div>

        {!hasPermission && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Permesso Notifiche Richiesto
              </span>
            </div>
            <p className="text-xs text-amber-700 mb-3">
              Per bloccare le notifiche durante le sessioni, concedi il permesso per gestire le notifiche.
            </p>
            <Button 
              size="sm" 
              onClick={requestNotificationPermission}
              className="w-full"
            >
              Concedi Permesso
            </Button>
          </div>
        )}

        {isActive && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Modalità Focus Attiva
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-green-700">
                ✓ Schermo mantenuto attivo
              </p>
              <p className="text-xs text-green-700">
                ✓ Notifiche esterne bloccate
              </p>
              {blockedNotifications > 0 && (
                <p className="text-xs text-green-700">
                  ✓ {blockedNotifications} notifiche bloccate
                </p>
              )}
            </div>
          </div>
        )}

        {!wakeLockSupported && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">
                Funzionalità Limitata
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Il tuo browser non supporta il blocco completo dello schermo. 
              Le notifiche verranno comunque ridotte al minimo.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 <strong>Consiglio:</strong> Per risultati ottimali, attiva la modalità "Non Disturbare" del tuo dispositivo e chiudi altre app prima di iniziare la sessione.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationBlocker;