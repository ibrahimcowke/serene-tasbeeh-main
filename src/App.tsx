import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MiniCounter from "./pages/MiniCounter";
import Challenges from "./pages/Challenges";
import { ThemeProvider } from "./components/ThemeProvider";
import { CongratsPopup } from "./components/CongratsPopup";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { useEffect } from "react";
import { registerPeriodicSync } from "./lib/notifications";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    registerPeriodicSync();
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mini" element={<MiniCounter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/challenges" element={<Challenges />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
