import { Counter } from '@/components/Counter';
import { ActionBar } from '@/components/ActionBar';
import { ThemeProvider } from '@/components/ThemeProvider';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="h-[100dvh] w-full bg-background flex flex-col overflow-hidden">
        {/* Main counter area - wrapped to handle overflow */}
        <div className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto safe-area-top">
          <Counter />
        </div>

        {/* Bottom action bar */}
        <div className="shrink-0 z-50 relative w-full">
          <ActionBar />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
