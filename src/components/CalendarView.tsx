import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { StreakCalendar } from './StreakCalendar';

interface CalendarViewProps {
    children: React.ReactNode;
}

export function CalendarView({ children }: CalendarViewProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <SheetDescription className="sr-only">
                    View your Hijri streak calendar.
                </SheetDescription>
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Calendar</SheetTitle>
                </SheetHeader>

                <div className="h-[calc(100%-40px)] overflow-y-auto pb-8">
                    <StreakCalendar />
                </div>
            </SheetContent>
        </Sheet>
    );
}
