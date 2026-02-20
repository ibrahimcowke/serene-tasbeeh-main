import { useEffect } from 'react';
import { Counter } from '@/components/Counter';
import { ActionBar } from '@/components/ActionBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BreathingGuide } from '@/components/BreathingGuide';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';
import { themes, counterShapes } from '@/lib/constants';

import { WhatsNew } from '@/components/WhatsNew';
import { StatsWidget } from '@/components/StatsWidget';
import { DateBanner } from "@/components/DateBanner";
import { RoutinesView } from "@/components/RoutinesView";
import { GlobalStats } from "@/components/GlobalStats";
import { ScreenOffMode } from "@/components/ScreenOffMode";
import { getRecommendedTheme } from '@/lib/timeUtils';
import { VisitorCounter } from '@/components/VisitorCounter';

const Index = () => {
  const { zenMode, setZenMode, syncToCloud, theme, counterShape, autoThemeSwitch, setTheme } = useTasbeehStore();

  const currentThemeLabel = themes.find(t => t.id === theme)?.label || 'Unknown';
  const currentShapeLabel = counterShapes.find(s => s.id === counterShape)?.label || 'Unknown';

  // Auto theme switch effect
  useEffect(() => {
    if (!autoThemeSwitch) return;

    const checkTime = () => {
      const recommended = getRecommendedTheme();
      if (theme !== recommended) {
        // Only switch if we're not already on the recommended generic theme
        // This allows users to theoretically pick other themes, but the auto switch will force 'light' or 'midnight' eventually
        setTheme(recommended);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [autoThemeSwitch, theme, setTheme]);

  // Handle PWA shortcuts / URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routineId = params.get('routine');
    const sessionType = params.get('session');

    // Slight delay to ensure store hydration
    const timer = setTimeout(() => {
      const { startRoutine, startTasbih100, startTasbih1000 } = useTasbeehStore.getState();

      if (routineId) {
        startRoutine(routineId);
        // Clean URL without reload
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
      <div className="h-[100dvh] w-full bg-background flex flex-col overflow-hidden relative">
        <ScreenOffMode />

        <WhatsNew />
        <BreathingGuide />
        <DateBanner />
        {!zenMode && <GlobalStats />}
        <StatsWidget />
        <RoutinesView>
          {/* Trigger is handled by ActionBar or other UI elements, but we need to mount it */}
          <span />
        </RoutinesView>

        {/* Status Indicators (Top Area) */}
        {!zenMode && (
          <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none flex items-center justify-between">
            <VisitorCounter />

            <div className="opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md border border-white/10 shadow-sm pointer-events-auto">
                <span className="text-[10px] uppercase tracking-widest font-medium text-foreground/80">
                  {currentShapeLabel} <span className="text-foreground/40 mx-1">|</span> {currentThemeLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main counter area */}
        <div className={`flex-1 min-h-0 w-full flex flex-col overflow-y-auto safe-area-top transition-all duration-500 ${zenMode ? 'justify-center' : ''}`}>
          <Counter />
        </div>

        {/* Bottom action bar - Hide in Zen Mode */}
        <div className={`shrink-0 z-50 relative w-full transition-transform duration-500 ${zenMode ? 'translate-y-full absolute bottom-0' : 'translate-y-0'}`}>
          <ActionBar />
        </div>

        {/* Zen Mode Exit Button (only visible in Zen Mode) */}
        {zenMode && (
          <button
            onClick={() => setZenMode(false)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background/20 backdrop-blur-md px-6 py-2 rounded-full text-foreground/50 hover:text-foreground/90 hover:bg-background/40 transition-all text-sm font-medium z-50 animate-fade-in-up"
          >
            Exit Zen Mode
          </button>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
