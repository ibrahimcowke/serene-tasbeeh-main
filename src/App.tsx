import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const MiniCounter = lazy(() => import("./pages/MiniCounter"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Welcome = lazy(() => import("./pages/Welcome"));

import { ThemeProvider } from "./components/ThemeProvider";
import { CongratsPopup } from "./components/CongratsPopup";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PrayerTimesPermissionModal } from "./components/PrayerTimesPermissionModal";
import { AmbientSoundPlayer } from "./components/AmbientSoundPlayer";
import { registerPeriodicSync } from "./lib/notifications";
import { useTasbeehStore } from "./store/tasbeehStore";

const queryClient = new QueryClient();

import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App as CapApp } from '@capacitor/app';

const App = () => {
  const hasSeenWelcome = useTasbeehStore((s) => s.hasSeenWelcome);
  useEffect(() => {
    registerPeriodicSync();
    
    // Background Geolocation & Prayer Times Sync
    import("./lib/prayerTimes").then(({ initPrayerTimeReminders }) => {
      initPrayerTimeReminders().catch(() => {});
    });

    // Resume AudioContext on first user interaction
    const handleGesture = () => {
      import("./lib/sound").then(({ SoundManager }) => {
        SoundManager.resume();
      });
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
    
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });

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

    // Handle hardware back button for Capacitor
    const handleBackButton = async () => {
      // 1. Check if there are any open overlays, sheets, drawers, or dialogs
      const openOverlay = document.querySelector('[role="dialog"], [data-state="open"], .custom-overlay-open');
      
      if (openOverlay) {
        // Dispatch an Escape key event to close it
        const escEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(escEvent);
        return;
      }

      // 2. If no overlay is open, handle navigation back
      if (window.location.pathname !== '/') {
        window.history.back();
      } else {
        // If we are at the home path, minimize the app
        CapApp.minimizeApp().catch(() => {});
      }
    };

    const backButtonListener = CapApp.addListener('backButton', () => {
      handleBackButton();
    });
    
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      backButtonListener.then(l => l.remove()).catch(() => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <CongratsPopup />
          <PWAInstallPrompt />
          <PrayerTimesPermissionModal />
          <AmbientSoundPlayer />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<div className="h-dvh w-full flex items-center justify-center bg-background text-muted-foreground animate-pulse">Loading...</div>}>
              <Routes>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/" element={hasSeenWelcome ? <Index /> : <Navigate to="/welcome" replace />} />
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
