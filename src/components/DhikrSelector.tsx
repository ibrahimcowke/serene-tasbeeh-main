import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DhikrSelectorProps {
  children: React.ReactNode;
}

const DhikrSelectorContent = React.lazy(() =>
  import('./DhikrSelectorContent').then((m) => ({ default: m.DhikrSelectorContent }))
);

export function DhikrSelector({ children }: DhikrSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[80vh] flex flex-col">
        {open && (
          <React.Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading dhikrs...</div>}>
            <DhikrSelectorContent setOpen={setOpen} />
          </React.Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

