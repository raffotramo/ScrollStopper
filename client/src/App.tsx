import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import InstallPrompt from "@/components/InstallPrompt";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EmergencyAntiScroll from "@/pages/EmergencyAntiScroll";
import Pricing from "@/pages/Pricing";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Progress from "@/pages/Progress";
import Achievements from "@/pages/Achievements";
import Challenges from "@/pages/Challenges";
import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import ShopifyIntegration from "@/pages/ShopifyIntegration";
import EmailConfig from "@/pages/EmailConfig";
import TrialGuard from "@/components/TrialGuard";
import PricingChoice from "@/components/PricingChoice";
import AntiScrollingSystem from "@/components/AntiScrollingSystem";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const [userProfile, setUserProfile] = useLocalStorage<any>('digital-detox-profile', null);
  const [location] = useLocation();

  // Se non c'è un profilo e non siamo già in onboarding, mostra onboarding
  if (!userProfile && location !== '/onboarding') {
    return <Onboarding />;
  }

  // Per debug: vai direttamente al pricing
  if (location === '/pricing-test') {
    return (
      <PricingChoice
        onTrialSelect={() => {
          setUserProfile({
            name: 'Test User',
            age: '30',
            screenTime: '1-2 ore',
            trialStartDate: new Date().toISOString(),
            isTrialActive: true,
            isPremium: false
          });
          window.location.href = '/';
        }}
        onPremiumSelect={() => {
          console.log('Premium selected');
        }}
      />
    );
  }

  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Home} />
      <Route path="/emergency" component={EmergencyAntiScroll} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/journal" component={Journal} />
      <Route path="/progress" component={Progress} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/profile" component={Profile} />
      <Route path="/shopify" component={ShopifyIntegration} />
      <Route path="/email" component={EmailConfig} />
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
        <InstallPrompt />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
