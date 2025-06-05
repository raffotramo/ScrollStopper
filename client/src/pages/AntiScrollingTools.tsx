import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Hand, Zap, Activity, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import ScrollInterceptor from '@/components/ScrollInterceptor';
import ScrollFeedback from '@/components/ScrollFeedback';
import MindfulGestures from '@/components/MindfulGestures';
import HapticFeedback from '@/components/HapticFeedback';

const AntiScrollingTools: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoStats, setDemoStats] = useState({
    interceptorTriggers: 0,
    gesturesCompleted: 0,
    mindfulMoments: 0
  });

  const tools = [
    {
      id: 'interceptor',
      title: 'Intercettazione Scrolling',
      description: 'Rileva e blocca lo scrolling veloce e compulsivo',
      icon: Shield,
      color: 'bg-red-50 text-red-600 border-red-200',
      features: ['Blocco automatico', 'Soglia personalizzabile', 'Pausa forzata'],
      demo: true
    },
    {
      id: 'feedback',
      title: 'Feedback Visivo Real-time',
      description: 'Mostra metriche di scrolling in tempo reale',
      icon: Eye,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      features: ['Velocità scrolling', 'Pattern comportamentali', 'Avvisi visivi'],
      demo: true
    },
    {
      id: 'gestures',
      title: 'Gesti Mindful',
      description: 'Esercizi interattivi di consapevolezza',
      icon: Hand,
      color: 'bg-green-50 text-green-600 border-green-200',
      features: ['Respirazione guidata', 'Pause riflessive', 'Reset mentale'],
      demo: true
    },
    {
      id: 'haptic',
      title: 'Feedback Tattile',
      description: 'Vibrazione del dispositivo per interruzioni',
      icon: Zap,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      features: ['Vibrazione personalizzata', 'Pattern intensità', 'Avvisi discreti'],
      demo: true
    }
  ];

  const handleDemoStart = (toolId: string) => {
    setActiveDemo(toolId);
  };

  const handleDemoEnd = () => {
    setActiveDemo(null);
  };

  const handleScrollDetected = () => {
    setDemoStats(prev => ({
      ...prev,
      interceptorTriggers: prev.interceptorTriggers + 1
    }));
  };

  const handleGestureComplete = (gesture: string) => {
    setDemoStats(prev => ({
      ...prev,
      gesturesCompleted: prev.gesturesCompleted + 1,
      mindfulMoments: prev.mindfulMoments + 1
    }));
    setActiveDemo(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Strumenti Anti-Scrolling</h1>
            <p className="text-muted-foreground">Micro-interazioni per ridurre lo scrolling compulsivo</p>
          </div>
        </div>

        {/* Demo Stats */}
        {(demoStats.interceptorTriggers > 0 || demoStats.gesturesCompleted > 0) && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Activity className="w-5 h-5 text-blue-600" />
                <div className="flex gap-4 text-sm">
                  <span>Interventi: <strong>{demoStats.interceptorTriggers}</strong></span>
                  <span>Gesti: <strong>{demoStats.gesturesCompleted}</strong></span>
                  <span>Momenti mindful: <strong>{demoStats.mindfulMoments}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tools Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeDemo === tool.id;
            
            return (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`cursor-pointer transition-all ${
                  isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tool.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          {isActive && <Badge variant="secondary" className="mt-1">Attivo</Badge>}
                        </div>
                      </div>
                      {tool.demo && (
                        <Button
                          onClick={() => isActive ? handleDemoEnd() : handleDemoStart(tool.id)}
                          size="sm"
                          variant={isActive ? "destructive" : "default"}
                        >
                          {isActive ? 'Stop' : 'Demo'}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{tool.description}</p>
                    <div className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Come Funziona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">1. Rilevamento Automatico</h4>
                <p className="text-sm text-muted-foreground">
                  Il sistema monitora i pattern di scrolling e rileva comportamenti compulsivi
                  in tempo reale, utilizzando metriche di velocità e frequenza.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Intervento Mindful</h4>
                <p className="text-sm text-muted-foreground">
                  Quando viene rilevato scrolling eccessivo, vengono attivate micro-interazioni
                  che incoraggiano pause e riflessione consapevole.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Feedback Personalizzato</h4>
                <p className="text-sm text-muted-foreground">
                  Il sistema si adatta al tuo comportamento, fornendo feedback visivo, tattile
                  e interattivo personalizzato per le tue abitudini.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">4. Apprendimento Progressivo</h4>
                <p className="text-sm text-muted-foreground">
                  Le statistiche aiutano a identificare i pattern e migliorare gradualmente
                  la consapevolezza digitale nel tempo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Consigli per l'Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Inizia con sensibilità bassa</p>
                  <p className="text-sm text-muted-foreground">
                    Abituati gradualmente agli interventi per evitare frustrazione
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-green-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Pratica i gesti mindful</p>
                  <p className="text-sm text-muted-foreground">
                    Dedica tempo agli esercizi di respirazione e riflessione
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Monitora le statistiche</p>
                  <p className="text-sm text-muted-foreground">
                    Osserva i tuoi pattern per identificare momenti di miglioramento
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <TabNavigation />

      {/* Demo Components */}
      {activeDemo === 'interceptor' && (
        <ScrollInterceptor
          isActive={true}
          sensitivity={2}
          onScrollDetected={handleScrollDetected}
        />
      )}

      {activeDemo === 'feedback' && (
        <ScrollFeedback
          isActive={true}
          onScrollBehaviorChange={(behavior) => {
            console.log('Behavior detected:', behavior);
          }}
        />
      )}

      {activeDemo === 'gestures' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Prova i Gesti Mindful</h3>
            <MindfulGestures onGestureComplete={handleGestureComplete} />
            <Button
              onClick={handleDemoEnd}
              variant="outline"
              className="w-full mt-4"
            >
              Chiudi Demo
            </Button>
          </div>
        </div>
      )}

      {activeDemo === 'haptic' && (
        <HapticFeedback
          trigger={true}
          intensity="medium"
          pattern={[200, 100, 200]}
          onComplete={handleDemoEnd}
        />
      )}
    </div>
  );
};

export default AntiScrollingTools;