import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { VisitorCounter } from '@/components/VisitorCounter';
import { NotificationCenter } from '@/components/NotificationCenter';
import { DateBanner } from '@/components/DateBanner';
import { MainFeed } from '../components/MainFeed';
import { RoutinesView } from '@/components/RoutinesView';
import { DhikrPulse } from '@/components/DhikrPulse';
import { ScreenOffMode } from '@/components/ScreenOffMode';
import { WhatsNew } from '@/components/WhatsNew';
import { BreathingGuide } from '@/components/BreathingGuide';
import { CommunitySidebar } from '@/components/CommunitySidebar';
import { JoinNotifier } from '@/components/JoinNotifier';
import ClassicDashboard from '../components/dashboards/ClassicDashboard';
import MinimalDashboard from '../components/dashboards/MinimalDashboard';
import TimelineDashboard from '../components/dashboards/TimelineDashboard';
import { HubDashboard } from '@/components/HubDashboard';

const Index = () => {
  const { zenMode, setZenMode, layout, setLayout } = useTasbeehStore();

  const renderDashboard = () => {
    switch (layout) {
      case 'minimal':
        return <MinimalDashboard />;
      case 'timeline':
        return <TimelineDashboard />;
      case 'hub':
        return <HubDashboard />;
      case 'zen':
        return <ClassicDashboard />;
      case 'classic':
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
            {/* Main Content Area */}
            <div className="w-full flex-1">
              <ClassicDashboard />
            </div>

            {/* Desktop Community Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-80 xl:w-96 sticky top-24 h-[calc(100vh-8rem)]"
            >
              <CommunitySidebar />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <DhikrPulse />
      <JoinNotifier />
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <div className="h-screen h-dvh min-h-svh w-full bg-background flex flex-col overflow-hidden relative">
            <ScreenOffMode />
            <WhatsNew />
            <BreathingGuide />

            {/* Premium Floating Header Capsule (Mobile & Desktop) */}
            <div className={`fixed z-40 transition-all duration-700 pointer-events-none 
              ${(zenMode || layout === 'zen') ? 'opacity-0 -translate-y-20' : 'opacity-100 translate-y-0'}
              top-2 xs:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] xs:w-[calc(100%-2rem)] max-w-5xl
              lg:top-0 lg:max-w-none lg:w-full lg:left-0 lg:translate-x-0`}>
              <div className={`
                  flex items-center justify-between w-full h-14 sm:h-16 px-2 sm:px-4 md:px-6 
                  bg-card/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl lg:rounded-none pointer-events-auto
                  transition-all duration-500
                `}>
                <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
                  {/* Left Section: Nav Trigger & Visitor Counter */}
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    {!(zenMode || layout === 'zen') && <SidebarTrigger className="h-8 w-8 hover:bg-black/5" />}
                    <div className="hidden sm:block h-4 w-px bg-white/10" />
                    <div className="scale-[0.85] sm:scale-100 origin-left">
                      <VisitorCounter />
                    </div>
                  </div>

                  {/* Center Section: Date Banner - Hidden on mobile/tablet inside capsule */}
                  <div className="hidden md:block flex-1 max-w-sm">
                    <DateBanner />
                  </div>
                </div>

                {/* Right Section: Notification Center */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="hidden sm:block h-4 w-px bg-white/10 mr-1 sm:mr-2" />
                  <NotificationCenter />
                </div>
              </div>
            </div>

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main Content Area */}
            <div className={`flex-1 min-h-0 w-full overflow-y-auto px-4 sm:px-6 md:px-8 pb-12 pt-16 xs:pt-24 custom-scrollbar transition-all duration-500 pb-safe ${zenMode || layout === 'zen' ? 'flex items-center justify-center pt-0 pb-0' : ''}`}>
              <div className={`max-w-7xl mx-auto w-full ${zenMode || layout === 'zen' ? 'max-w-4xl' : ''}`}>
                {renderDashboard()}
              </div>
            </div>

            {/* Zen Mode Exit Button */}
            {(zenMode || layout === 'zen') && (
              <button
                onClick={() => {
                  setZenMode(false);
                  if (layout === 'zen') setLayout('default');
                }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-xl border border-foreground/10 px-10 py-4 rounded-full text-foreground/70 hover:text-foreground transition-all text-sm font-semibold z-50 animate-fade-in-up flex items-center gap-3 shadow-2xl"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Exit {layout === 'zen' ? 'Zen Layout' : 'Zen Mode'}</span>
              </button>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
