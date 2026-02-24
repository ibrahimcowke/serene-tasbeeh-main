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

import { ScreenOffMode } from "@/components/ScreenOffMode";
import { getRecommendedTheme } from '@/lib/timeUtils';
import { VisitorCounter } from '@/components/VisitorCounter';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { zenMode, setZenMode, syncToCloud, theme, counterShape, autoThemeSwitch, setTheme, currentDhikr } = useTasbeehStore();

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

  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <div className="h-screen h-dvh min-h-svh w-full bg-background flex flex-col overflow-hidden relative">
            <ScreenOffMode />
            <WhatsNew />
            <BreathingGuide />

            {/* Header - Optimized for Mobile & Desktop */}
            <div className={`shrink-0 z-50 px-4 pt-4 sm:pt-6 pt-safe flex items-center justify-between gap-3 pointer-events-none ${zenMode ? 'opacity-0' : 'opacity-100'}`}>
              <div className="pointer-events-auto flex items-center gap-2">
                {!zenMode && <SidebarTrigger className="h-9 w-9" />}
                <div className="scale-90 xs:scale-100 origin-left">
                  <VisitorCounter />
                </div>
              </div>
              <div className="pointer-events-auto scale-90 xs:scale-100 origin-right flex items-center">
                {/* On very small screens, the DateBanner might be too wide, but we'll trust its internal responsiveness */}
                <DateBanner />
              </div>
            </div>

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main Content Area */}
            <div className={`flex-1 min-h-0 w-full overflow-y-auto px-4 sm:px-6 md:px-8 pb-12 pt-2 custom-scrollbar transition-all duration-500 pb-safe ${zenMode ? 'flex items-center justify-center pt-0 pb-0' : ''}`}>
              <div className={`max-w-7xl mx-auto w-full ${zenMode ? 'max-w-4xl' : ''}`}>
                {zenMode ? (
                  <Counter />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Personal Stats (Desktop Only) */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="lg:col-span-3 space-y-6 hidden lg:block sticky top-0"
                    >
                      <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-1 overflow-hidden">
                        <div className="p-4 border-b border-border/50">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">My Growth</h2>
                        </div>
                        <div className="p-2">
                          <StatsWidget />
                        </div>
                      </div>
                    </motion.div>

                    {/* Center Column: The Counter (Heart of the App) */}
                    <div className="lg:col-span-6 flex flex-col items-center">
                      <div className="w-full max-w-xl">
                        <Counter />
                      </div>

                      {!zenMode && (
                        <div className="w-full max-w-md mt-4 hidden lg:block">
                          <HadithSlider dhikr={currentDhikr} />
                        </div>
                      )}

                      {/* Mobile-only Optimized Widgets (Tabbed Layout) */}
                      <div className="w-full mt-8 lg:hidden">
                        <Tabs defaultValue="stats" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl h-11 p-1">
                            <TabsTrigger value="stats" className="rounded-xl text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Growth</TabsTrigger>
                            <TabsTrigger value="community" className="rounded-xl text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Live</TabsTrigger>
                            <TabsTrigger value="challenges" className="rounded-xl text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Goals</TabsTrigger>
                          </TabsList>

                          <div className="mt-4">
                            <TabsContent value="stats" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-4">
                                <StatsWidget />
                              </div>
                            </TabsContent>

                            <TabsContent value="community" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">Community Pulse</h2>
                                <GlobalStats />
                              </div>
                            </TabsContent>

                            <TabsContent value="challenges" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-4">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Global Challenges</h2>
                                <GlobalChallenges />
                              </div>
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
                    </div>

                    {/* Right Column: Global Stats (Desktop Only) */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="lg:col-span-3 space-y-6 hidden lg:block sticky top-0"
                    >
                      <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-1 overflow-hidden">
                        <div className="p-4 border-b border-border/50 flex justify-between items-center">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Goals</h2>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Live</span>
                          </div>
                        </div>
                        <div className="p-4 space-y-6">
                          <GlobalStats />
                          <div className="h-px bg-border/50" />
                          <GlobalChallenges />
                        </div>
                      </div>
                    </motion.div>

                  </div>
                )}
              </div>
            </div>

            {/* Zen Mode Exit Button */}
            {zenMode && (
              <button
                onClick={() => setZenMode(false)}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-xl border border-foreground/10 px-8 py-3 rounded-full text-foreground/70 hover:text-foreground transition-all text-sm font-medium z-50 animate-fade-in-up flex items-center gap-2"
              >
                <span>Exit Zen Mode</span>
              </button>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
