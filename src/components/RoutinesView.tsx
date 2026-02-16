import { useTasbeehStore } from '@/store/tasbeehStore';
import { defaultRoutines } from '@/data/routines';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Play, ClipboardList, Clock, Sun, Moon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface RoutinesViewProps {
    children: React.ReactNode;
}

export function RoutinesView({ children }: RoutinesViewProps) {
    const [open, setOpen] = useState(false);
    const { startRoutine, sessionMode, currentDhikr } = useTasbeehStore();

    const handleStartRoutine = (routineId: string) => {
        startRoutine(routineId);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        Dhikr Routines
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-full pb-20">
                    <div className="space-y-4 px-1">
                        <p className="text-sm text-muted-foreground">
                            Guided sequences of Adhkar for morning, evening, and special occasions.
                        </p>

                        <div className="grid gap-4">
                            {defaultRoutines.map((routine, index) => {
                                const isActive = sessionMode.type === 'routine' && sessionMode.routineId === routine.id;
                                const isComplete = isActive && sessionMode.isComplete;

                                return (
                                    <motion.button
                                        key={routine.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleStartRoutine(routine.id)}
                                        className={`
                                            relative overflow-hidden w-full text-left rounded-2xl border transition-all duration-300
                                            ${isActive
                                                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                                : 'bg-card border-border hover:border-primary/50 hover:bg-accent/50'}
                                        `}
                                    >
                                        {/* Background Gradient */}
                                        <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${routine.color}`} />

                                        <div className="relative p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        w-10 h-10 rounded-xl flex items-center justify-center
                                                        bg-gradient-to-br ${routine.color} text-white shadow-sm
                                                    `}>
                                                        {routine.icon === 'Sun' && <Sun className="w-5 h-5" />}
                                                        {routine.icon === 'Moon' && <Moon className="w-5 h-5" />}
                                                        {routine.icon === 'PrayerRug' && <span className="text-lg">🤲</span>}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{routine.title}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                ~{Math.ceil(routine.steps.reduce((acc, s) => acc + s.target, 0) * 1.5 / 60)} min
                                                            </span>
                                                            <span>•</span>
                                                            <span>{routine.steps.length} Steps</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {isActive && (
                                                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                        <Play className="w-3 h-3 fill-current" />
                                                        Active
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-sm text-foreground/80 line-clamp-2">
                                                {routine.description}
                                            </p>

                                            {/* Preview Steps */}
                                            <div className="space-y-2 pt-2 border-t border-border/50">
                                                {routine.steps.slice(0, 3).map((step, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                                        <span className="truncate flex-1">{step.description || `Step ${i + 1}`}</span>
                                                        {isActive && sessionMode.currentStepIndex > i && (
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                        )}
                                                    </div>
                                                ))}
                                                {routine.steps.length > 3 && (
                                                    <div className="text-xs text-muted-foreground pl-3.5">
                                                        + {routine.steps.length - 3} more...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
