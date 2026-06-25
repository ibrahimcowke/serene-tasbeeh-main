import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SettingsViewProps {
  children: React.ReactNode;
  defaultTab?: string;
}

const SettingsViewContent = React.lazy(() =>
  import('./SettingsViewContent').then((m) => ({ default: m.SettingsViewContent }))
);

export function SettingsView({ children, defaultTab = 'themes' }: SettingsViewProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-background/80 backdrop-blur-md rounded-t-3xl h-[85vh] flex flex-col gap-0 outline-none border-t-0 z-50">
        {open && (
          <React.Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading settings...</div>}>
            <SettingsViewContent defaultTab={defaultTab} setOpen={setOpen} />
          </React.Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

