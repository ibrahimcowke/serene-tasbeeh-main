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
              background: 'linear-gradient(160deg, #0a0800 0%, #0d0c07 40%, #080b12 100%)',
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
                  className="absolute rounded-full bg-amber-100"
                  style={{
                    width: Math.random() * 1.5 + 0.5 + 'px',
                    height: Math.random() * 1.5 + 0.5 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.3 + 0.05,
                  }}
                />
              ))}
            </div>

            {/* Top navigation bar */}
            {!zenMode && (
              <div
                className="relative z-50 flex items-center justify-end px-4 sm:px-6 pt-safe"
                style={{
                  height: '64px',
                  background: 'linear-gradient(to bottom, rgba(10,8,0,0.9) 0%, transparent 100%)',
                }}
              >
                {/* Sidebar trigger */}
                <SidebarTrigger className="h-9 w-9 rounded-full flex items-center justify-center text-amber-400/60 hover:text-amber-400 transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(217,119,6,0.15)',
                  }}
                />
              </div>
            )}

            <RoutinesView>
              <span />
            </RoutinesView>

            {/* Main counter area */}
            <div className={`flex-1 min-h-0 w-full flex flex-col ${zenMode ? 'pt-0 pb-0' : 'pb-24 lg:pb-4'}`}>
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
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-full text-xs text-amber-400/60 hover:text-amber-400 transition-all animate-fade-in-up flex items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(217,119,6,0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
