import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { RoutinesView } from '@/components/RoutinesView';

import { ScreenOffMode } from '@/components/ScreenOffMode';
import { WhatsNew } from '@/components/WhatsNew';
import { BreathingGuide } from '@/components/BreathingGuide';
import ClassicDashboard from '../components/dashboards/ClassicDashboard';
import { MobileNavBar } from '@/components/MobileNavBar';

const Index = () => {
  const { zenMode, setZenMode } = useTasbeehStore();

  const renderDashboard = () => {
    return <ClassicDashboard />;
  };

  return (
    <>

      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="h-dvh overflow-hidden">
          <div className="h-dvh w-full bg-background flex flex-col overflow-hidden relative">
            <ScreenOffMode />
            <WhatsNew />
            <BreathingGuide />

            {/* Sidebar Trigger */}
            {!zenMode && (
              <div className="fixed top-4 left-4 z-50 pointer-events-auto">
                <SidebarTrigger className="h-10 w-10 bg-card/40 backdrop-blur-xl border border-white/10 shadow-lg" />
              </div>
            )}

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main Content Area - Fixed layout without transitions to prevent auto-movement */}
            <div className={`flex-1 min-h-0 w-full flex flex-col pb-safe ${zenMode ? 'items-center justify-center' : 'pt-12 pb-16 xs:pt-2 xs:pb-12'}`}>
              <div className={`max-w-[1600px] mx-auto w-full h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 ${zenMode ? 'max-w-4xl' : ''}`}>
                {renderDashboard()}
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {!zenMode && <MobileNavBar />}

            {/* Zen Mode Exit Button */}
            {zenMode && (
              <button
                onClick={() => setZenMode(false)}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-xl border border-foreground/10 px-10 py-4 rounded-full text-foreground/70 hover:text-foreground transition-all text-sm font-semibold z-50 animate-fade-in-up flex items-center gap-3 shadow-2xl"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Exit Zen Mode</span>
              </button>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Index;
