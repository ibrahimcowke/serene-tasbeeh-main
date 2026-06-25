import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';

interface StatsViewProps {
    children: React.ReactNode;
}

const StatsViewContent = React.lazy(() =>
  import('./StatsViewContent').then((m) => ({ default: m.StatsViewContent }))
);

export function StatsView({ children }: StatsViewProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <SheetDescription className="sr-only">
                    Detailed statistics about your dhikr frequency and trends.
                </SheetDescription>
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Statistics</SheetTitle>
                </SheetHeader>
                {open && (
                    <React.Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading stats...</div>}>
                        <StatsViewContent />
                    </React.Suspense>
                )}
            </SheetContent>
        </Sheet>
    );
}

