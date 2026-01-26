import { Counter } from '@/components/Counter';
import { ActionBar } from '@/components/ActionBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useTasbeehStore } from '@/store/tasbeehStore';

const Index = () => {
  const { zenMode, setZenMode } = useTasbeehStore();

  return (
    <ThemeProvider>
      <div className="h-[100dvh] w-full bg-background flex flex-col overflow-hidden relative">
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
