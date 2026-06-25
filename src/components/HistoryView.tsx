import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';

interface HistoryViewProps {
  children: React.ReactNode;
}

const HistoryStats = React.lazy(() =>
  import('./HistoryStats').then((m) => ({ default: m.HistoryStats }))
);

export function HistoryView({ children }: HistoryViewProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
        <SheetDescription className="sr-only">
          View your dhikr history and progress over time.
        </SheetDescription>
        <div className="sheet-handle" />
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-lg font-medium">Your Progress</SheetTitle>
        </SheetHeader>
        {open && (
          <React.Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading history...</div>}>
            <HistoryStats />
          </React.Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

