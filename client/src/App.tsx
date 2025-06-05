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
import Onboarding from "@/pages/Onboarding";
import TrialGuard from "@/components/TrialGuard";
import AntiScrollingSystem from "@/components/AntiScrollingSystem";
import useLocalStorage from "@/hooks/useLocalStorage";

function Router() {
  const [userProfile] = useLocalStorage<any>('digital-detox-profile', {
    name: 'Utente Premium',
    age: '30',
    screenTime: '3-4 ore',
    isPremium: true,
    purchaseDate: new Date().toISOString(),
    isTrialActive: false
  });
  const [location] = useLocation();
  
  // Se non c'è un profilo e non siamo già in onboarding, mostra onboarding
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
      <Route path="/profile" component={Profile} />
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
