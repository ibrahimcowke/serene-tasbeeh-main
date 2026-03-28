import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const MiniCounter = lazy(() => import("./pages/MiniCounter"));
const Challenges = lazy(() => import("./pages/Challenges"));

import { ThemeProvider } from "./components/ThemeProvider";
import { CongratsPopup } from "./components/CongratsPopup";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { registerPeriodicSync } from "./lib/notifications";
import { useTasbeehStore } from "./store/tasbeehStore";

const queryClient = new QueryClient();

import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

const App = () => {
  useEffect(() => {
    registerPeriodicSync();
    
    // Native Mobile Adjustments
    const configureNative = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });
        await Keyboard.setAccessoryBarVisible({ isVisible: false });
      } catch (e) {
        // Ignore on web
      }
    };
    
    configureNative();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <CongratsPopup />
        <PWAInstallPrompt />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<div className="h-dvh w-full flex items-center justify-center bg-background text-muted-foreground animate-pulse">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mini" element={<MiniCounter />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/challenges" element={<Challenges />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
