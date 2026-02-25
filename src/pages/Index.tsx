import { useEffect } from 'react';
import { Counter } from '@/components/Counter';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BreathingGuide } from '@/components/BreathingGuide';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';
import { themes, counterShapes } from '@/lib/constants';

import { WhatsNew } from '@/components/WhatsNew';
import { StatsWidget } from '@/components/StatsWidget';
import { DateBanner } from "@/components/DateBanner";
import { RoutinesView } from "@/components/RoutinesView";
import { GlobalChallenges } from "@/components/GlobalChallenges";
import { GlobalStats } from "@/components/GlobalStats";
import { HadithSlider } from "@/components/HadithSlider";
import { HubDashboard } from '@/components/HubDashboard';
import { MinimalDashboard } from '@/components/MinimalDashboard';
import { DhikrPulse } from "@/components/DhikrPulse";
import { JoinNotifier } from "@/components/JoinNotifier";
import { NotificationCenter } from "@/components/NotificationCenter";

import { ScreenOffMode } from "@/components/ScreenOffMode";
import { getRecommendedTheme } from '@/lib/timeUtils';
import { VisitorCounter } from '@/components/VisitorCounter';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const Index = () => {
  const {
    zenMode,
    setZenMode,
    syncToCloud,
    theme,
    autoThemeSwitch,
    setTheme,
    currentDhikr,
    layout,
    setLayout
  } = useTasbeehStore();

  // Auto theme switch effect
  useEffect(() => {
    if (!autoThemeSwitch) return;

    const checkTime = () => {
      const recommended = getRecommendedTheme();
      if (theme !== recommended) {
        setTheme(recommended);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [autoThemeSwitch, theme, setTheme]);

  // Handle PWA shortcuts / URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routineId = params.get('routine');
    const sessionType = params.get('session');

    const timer = setTimeout(() => {
      const { startRoutine, startTasbih100 } = useTasbeehStore.getState();

      if (routineId) {
        startRoutine(routineId);
        window.history.replaceState({}, '', window.location.pathname);
        toast.success("Started Routine", { description: `Loaded ${routineId} routine` });
      } else if (sessionType === '100') {
        startTasbih100();
        window.history.replaceState({}, '', window.location.pathname);
        toast.success("Started Session", { description: "100 Tasbeeh session started" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      toast.success("You're back online!", {
        description: "Syncing your data to the cloud..."
      });
      syncToCloud();
    };

    const handleOffline = () => {
      toast.info("You're offline", {
        description: "Your progress is saved locally."
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncToCloud]);

  const renderDashboard = () => {
    if (zenMode) return <Counter />;

    switch (layout) {
      case 'hub':
        return <HubDashboard />;
      case 'zen':
        return <MinimalDashboard />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop: Left Column (Personal Stats) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6 hidden lg:block sticky top-24"
            >
              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-1 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">My Growth</h2>
                </div>
                <div className="p-4">
                  <StatsWidget />
                </div>
              </div>
            </motion.div>

            {/* Center Column: The Counter (Heart of the App) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-xl">
                <Counter />
              </div>

              <div className="w-full max-w-md mt-6">
                <HadithSlider dhikr={currentDhikr} />
              </div>

              {/* Premium Mobile Feed (Aesthetic Integrated View) */}
              <div className="w-full mt-8 xs:mt-12 space-y-6 xs:space-y-8 lg:hidden">
                {/* Section 1: Community Pulse & My Quick Stats */}
                <div className="grid grid-cols-2 gap-3 xs:gap-4">
                  <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-3 xs:p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-[9px] xs:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 xs:mb-2">Live Activity</h3>
                    <GlobalStats />
                  </div>
                  <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-3 xs:p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-[9px] xs:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 xs:mb-2">My Best</h3>
                    <StatsWidget mini />
                  </div>
                </div>

                {/* Section 2: Active Challenges (High Density) */}
                <div className="space-y-3 xs:space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Active Challenges</h2>
                    <span className="text-[9px] xs:text-[10px] font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">Community</span>
                  </div>
                  <div className="relative">
                    <GlobalChallenges />
                  </div>
                </div>

                {/* Section 3: Full Progress Details */}
                <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[1.5rem] xs:rounded-[2rem] p-4 xs:p-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 xs:mb-6">Detailed Progress</h2>
                  <StatsWidget />
                </div>
              </div>
            </div>

            {/* Desktop: Right Column (Community & Challenges) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6 hidden lg:block sticky top-24"
            >
              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-1 overflow-hidden">
                <div className="p-6 border-b border-border/50 flex justify-between items-center">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Community</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Live</span>
                  </div>
                </div>
                <div className="p-6 space-y-8">
                  <GlobalStats />
                  <div className="h-px bg-white/5" />
                  <GlobalChallenges />
                </div>
              </div>
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
            <div className={`fixed top-2 xs:top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1rem)] xs:w-[calc(100%-2rem)] max-w-5xl transition-all duration-700 pointer-events-none ${(zenMode || layout === 'zen') ? 'opacity-0 -translate-y-20' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center justify-between gap-1 p-1 xs:p-1.5 pl-2 xs:pl-3 pr-1 xs:pr-2 rounded-full bg-card/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] pointer-events-auto">
                {/* Left: Sidebar & Visitors */}
                <div className="flex items-center gap-1.5 xs:gap-3">
                  <div className="flex items-center gap-1 xs:gap-1.5">
                    {!(zenMode || layout === 'zen') && <SidebarTrigger className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-black/5" />}
                    <div className="h-4 w-px bg-white/10 hidden xs:block" />
                    <div className="scale-75 xs:scale-90 origin-left">
                      <VisitorCounter />
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <NotificationCenter />
                  </div>
                </div>

                {/* Right: Date Capsule */}
                <div className="flex items-center">
                  <div className="hidden xs:block border-l border-white/10 h-4 mx-2" />
                  <div className="scale-[0.85] xs:scale-100 origin-right max-w-[110px] xs:max-w-none overflow-hidden">
                    <DateBanner />
                  </div>
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
