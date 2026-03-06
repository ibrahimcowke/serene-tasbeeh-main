import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MainFeed } from '../components/MainFeed';
import { RoutinesView } from '@/components/RoutinesView';
import { DhikrPulse } from '@/components/DhikrPulse';
import { ScreenOffMode } from '@/components/ScreenOffMode';
import { WhatsNew } from '@/components/WhatsNew';
import { BreathingGuide } from '@/components/BreathingGuide';
import { CommunitySidebar } from '@/components/CommunitySidebar';
import { JoinNotifier } from '@/components/JoinNotifier';
import ClassicDashboard from '../components/dashboards/ClassicDashboard';
import { ChocoDashboard } from '../components/dashboards/ChocoDashboard';
import { PremiumHub } from '@/components/PremiumHub';

const Index = () => {
  const { zenMode, setZenMode, layout, setLayout, dashboardType } = useTasbeehStore();

  const renderDashboard = () => {
    if (dashboardType === 'choco') {
      return <ChocoDashboard />;
    }

    if (layout === 'zen') {
      return <ClassicDashboard />;
    }

    return (
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
        {/* Main Content Area */}
        <div className="w-full flex-1">
          <div className="lg:hidden">
            <ClassicDashboard />
          </div>
          <div className="hidden lg:block">
            <PremiumHub />
          </div>
        </div>

        {/* Desktop Community Sidebar - Only show if not PremiumHub since PremiumHub includes it */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:hidden w-80 xl:w-96 sticky top-24 h-[calc(100vh-8rem)]"
        >
          <CommunitySidebar />
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <DhikrPulse />
      <JoinNotifier />
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <div className="h-screen h-dvh min-h-svh w-full bg-background flex flex-col overflow-hidden relative">
            <ScreenOffMode />
            <WhatsNew />
            <BreathingGuide />

            {/* Sidebar Toggle (Visible when sidebar is collapsed or on mobile) */}
            {!zenMode && (
              <div className="fixed top-4 left-4 z-50 pointer-events-auto">
                <SidebarTrigger className="h-10 w-10 bg-card/40 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/5 transition-all duration-300" />
              </div>
            )}

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main Content Area */}
            <div className={`flex-1 min-h-0 w-full overflow-hidden px-4 sm:px-6 md:px-8 pb-4 pt-16 xs:pt-2 transition-all duration-500 pb-safe ${zenMode ? 'flex items-center justify-center pt-0 pb-0' : ''}`}>
              <div className={`max-w-[1600px] mx-auto w-full ${zenMode ? 'max-w-4xl' : ''}`}>
                {renderDashboard()}
              </div>
            </div>

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
