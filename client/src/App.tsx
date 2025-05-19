import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";
import useLocalStorage from "@/hooks/useLocalStorage";

function Router() {
  const [userProfile] = useLocalStorage<any | null>('digital-detox-profile', null);
  const [location, setLocation] = useLocation();
  
  // Reindirizza alla pagina di onboarding se non c'è un profilo
  useEffect(() => {
    if (!userProfile && location !== '/onboarding') {
      setLocation('/onboarding');
    }
  }, [userProfile, location, setLocation]);

  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Home} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/journal" component={Journal} />
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
