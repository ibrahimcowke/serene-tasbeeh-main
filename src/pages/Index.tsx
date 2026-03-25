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
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const { zenMode, setZenMode } = useTasbeehStore();

  const renderDashboard = () => {
    return <ClassicDashboard />;
  };

  return (
    <>

      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen lg:h-screen w-full bg-background flex flex-col lg:overflow-hidden relative">
            <ScreenOffMode />
            <WhatsNew />
            <BreathingGuide />

            {/* Sidebar Toggle (Visible when sidebar is collapsed or on mobile) */}
            {!zenMode && (
              <>
                <div className="fixed top-4 left-4 z-50 pointer-events-auto">
                  <SidebarTrigger className="h-10 w-10 bg-card/40 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/5 transition-all duration-300" />
                </div>
                <div className="fixed top-4 right-4 z-50 pointer-events-auto">
                  <ThemeToggle />
                </div>
              </>
            )}

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main Content Area */}
            <div className={`flex-1 min-h-0 w-full overflow-hidden flex flex-col transition-all duration-500 pb-safe ${zenMode ? 'items-center justify-center' : 'pt-16 pb-20 xs:pt-4 xs:pb-16'}`}>
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
