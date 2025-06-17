import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EmergencyAntiScroll from "@/pages/EmergencyAntiScroll";
import Pricing from "@/pages/Pricing";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Progress from "@/pages/Progress";
import Achievements from "@/pages/Achievements";
import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import ShopifyIntegration from "@/pages/ShopifyIntegration";
import TrialGuard from "@/components/TrialGuard";
import AntiScrollingSystem from "@/components/AntiScrollingSystem";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [userProfile] = useLocalStorage<any>('digital-detox-profile', {
    name: 'Utente Premium',
    age: '30',
    screenTime: '3-4 ore',
    isPremium: true,
    purchaseDate: new Date().toISOString(),
    isTrialActive: false
  });
  const [location] = useLocation();

  // Mostra caricamento durante verifica autenticazione
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Se non autenticato, mostra login
  if (!isAuthenticated) {
    return <Login />;
  }
  
  // Se autenticato ma non c'è un profilo e non siamo già in onboarding, mostra onboarding
  if (!userProfile && location !== '/onboarding') {
    return <Onboarding />;
  }

  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Home} />
      <Route path="/emergency" component={EmergencyAntiScroll} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/journal" component={Journal} />
      <Route path="/progress" component={Progress} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/profile" component={Profile} />
      <Route path="/shopify" component={ShopifyIntegration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
