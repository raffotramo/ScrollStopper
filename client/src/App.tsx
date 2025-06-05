import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EmergencyAntiScroll from "@/pages/EmergencyAntiScroll";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Progress from "@/pages/Progress";
import Onboarding from "@/pages/Onboarding";
import useLocalStorage from "@/hooks/useLocalStorage";

function Router() {
  const [userProfile] = useLocalStorage<any>('digital-detox-profile', null);
  const [location, setLocation] = useLocation();
  
  // Debug per capire lo stato del profilo
  console.log('Router - userProfile:', userProfile, 'location:', location);
  
  // Controlla se c'è un profilo valido
  const hasValidProfile = userProfile && userProfile.name && userProfile.age && userProfile.screenTime;
  
  // Reindirizza alla pagina di onboarding se non c'è un profilo valido
  useEffect(() => {
    if (!hasValidProfile && location === '/') {
      console.log('Redirecting to onboarding - no valid profile');
      setLocation('/onboarding');
    }
  }, [hasValidProfile, location, setLocation]);

  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Home} />
      <Route path="/emergency" component={EmergencyAntiScroll} />
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
