import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StatsViewContent } from './StatsView';
import { AchievementsContent } from './AchievementsView';
import { RemindersContent } from './RemindersView';
import { BarChart3, Trophy, Bell } from 'lucide-react';

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
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Progress</SheetTitle>
                </SheetHeader>

                <Tabs defaultValue="stats" className="w-full h-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="stats" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Stats
                        </TabsTrigger>
                        <TabsTrigger value="awards" className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Awards
                        </TabsTrigger>
                        <TabsTrigger value="alerts" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Alerts
                        </TabsTrigger>
                    </TabsList>

                    <div className="h-[calc(100%-80px)] overflow-y-auto pb-8">
                        <TabsContent value="stats" className="mt-0 h-full">
                            <StatsViewContent />
                        </TabsContent>
                        <TabsContent value="awards" className="mt-0 h-full">
                            <AchievementsContent />
                        </TabsContent>
                        <TabsContent value="alerts" className="mt-0 h-full">
                            <RemindersContent />
                        </TabsContent>
                    </div>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
