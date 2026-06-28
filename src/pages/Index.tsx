import { useTasbeehStore } from '@/store/tasbeehStore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { RoutinesView } from '@/components/RoutinesView';
import { ScreenOffMode } from '@/components/ScreenOffMode';
import { WhatsNew } from '@/components/WhatsNew';
import { BreathingGuide } from '@/components/BreathingGuide';
import { MobileNavBar } from '@/components/MobileNavBar';
import { Counter } from '@/components/Counter';
import { CongratsPopup } from '@/components/CongratsPopup';
import { DateBanner } from '@/components/DateBanner';

const Index = () => {
  const zenMode = useTasbeehStore((state) => state.zenMode);
  const setZenMode = useTasbeehStore((state) => state.setZenMode);

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="h-dvh overflow-hidden">

          {/* Full screen deep background */}
          <div
            className="h-dvh w-full flex flex-col overflow-hidden relative"
            style={{
              background: 'radial-gradient(circle at top left, hsl(var(--primary) / 0.12), transparent 50%), radial-gradient(circle at bottom right, hsl(var(--accent) / 0.08), transparent 50%), hsl(var(--background))',
            }}
          >
            <ScreenOffMode />
            <WhatsNew />
            <BreathingGuide />

            {/* Subtle starfield / particle overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {/* Static star dots */}
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 1.5 + 0.5 + 'px',
                    height: Math.random() * 1.5 + 0.5 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.2 + 0.05,
                    backgroundColor: 'hsl(var(--primary))',
                  }}
                />
              ))}
            </div>

            {/* Top navigation bar */}
            {!zenMode && (
              <div
                className="relative z-50 flex items-center justify-between px-4 sm:px-6 pt-safe gap-4"
                style={{
                  height: 'calc(64px + env(safe-area-inset-top, 0px))',
                  background: 'linear-gradient(to bottom, hsl(var(--background) / 0.95) 0%, transparent 100%)',
                }}
              >
                {/* Date banner */}
                <div className="flex-1 min-w-0 max-w-sm">
                  <DateBanner className="px-0" />
                </div>

                {/* Sidebar trigger */}
                <SidebarTrigger className="h-9 w-9 rounded-full flex items-center justify-center text-primary/80 hover:text-primary transition-colors shrink-0"
                  style={{
                    background: 'hsl(var(--foreground) / 0.05)',
                    border: '1px solid hsl(var(--primary) / 0.2)',
                  }}
                />
              </div>
            )}

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main counter area */}
            <div className={`flex-1 min-h-0 w-full flex flex-col ${zenMode ? 'pt-0 pb-0' : 'pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] lg:pb-4'}`}>
              <div className="max-w-md mx-auto w-full h-full flex flex-col px-2 sm:px-4">
                <Counter />
              </div>
            </div>

            {/* Bottom navigation */}
            {!zenMode && <MobileNavBar />}

            {/* Congrats popup */}
            <CongratsPopup />

            {/* Zen mode exit */}
            {zenMode && (
              <button
                onClick={() => setZenMode(false)}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-full text-xs transition-all animate-fade-in-up flex items-center gap-2"
                style={{
                  background: 'hsl(var(--foreground) / 0.03)',
                  border: '1px solid hsl(var(--primary) / 0.2)',
                  color: 'hsl(var(--primary) / 0.8)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                Exit Zen Mode
              </button>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Index;
