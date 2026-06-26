import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { AchievementsContent } from './AchievementsView';
import { BarChart3, Trophy } from 'lucide-react';

const StatsViewContent = React.lazy(() =>
  import('./StatsViewContent').then((m) => ({ default: m.StatsViewContent }))
);

interface ProgressViewProps {
    children: React.ReactNode;
}

export function ProgressView({ children }: ProgressViewProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <SheetDescription className="sr-only">
                    View your stats, awards, and streak calendar.
                </SheetDescription>
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Progress</SheetTitle>
                </SheetHeader>

                <Tabs defaultValue="stats" className="w-full h-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="stats" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Stats
                        </TabsTrigger>
                        <TabsTrigger value="awards" className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Awards
                        </TabsTrigger>
                    </TabsList>

                    <div className="h-[calc(100%-80px)] overflow-y-auto pb-8">
                        <TabsContent value="stats" className="mt-0 h-full">
                            <React.Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Loading stats...</div>}>
                                <StatsViewContent />
                            </React.Suspense>
                        </TabsContent>
                        <TabsContent value="awards" className="mt-0 h-full">
                            <AchievementsContent />
                        </TabsContent>
                    </div>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}

