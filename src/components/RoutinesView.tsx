import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from '@/lib/i18n';
import { defaultRoutines } from '@/data/routines';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ClipboardList, Clock, Sun, Moon, CheckCircle2, Plus, Trash2, X, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RoutinesViewProps {
    children: React.ReactNode;
}

export function RoutinesView({ children }: RoutinesViewProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { startRoutine, sessionMode, customRoutines, addCustomRoutine, removeCustomRoutine, dhikrs } = useTasbeehStore(useShallow(state => ({
        startRoutine: state.startRoutine,
        sessionMode: state.sessionMode,
        customRoutines: state.customRoutines || [],
        addCustomRoutine: state.addCustomRoutine,
        removeCustomRoutine: state.removeCustomRoutine,
        dhikrs: state.dhikrs || []
    })));

    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<{ dhikrId: string; target: number }[]>([]);

    const handleStartRoutine = (routineId: string) => {
        startRoutine(routineId);
        setOpen(false);
    };

    const handleAddStep = () => {
        setSteps([...steps, { dhikrId: dhikrs[0]?.id || 'subahanallah', target: 33 }]);
    };

    const handleRemoveStep = (idx: number) => {
        setSteps(steps.filter((_, i) => i !== idx));
    };

    const handleUpdateStepDhikr = (idx: number, dhikrId: string) => {
        setSteps(steps.map((s, i) => i === idx ? { ...s, dhikrId } : s));
    };

    const handleUpdateStepTarget = (idx: number, target: number) => {
        setSteps(steps.map((s, i) => i === idx ? { ...s, target } : s));
    };

    const handleSaveRoutine = () => {
        if (!title.trim()) {
            toast.error('Please enter a routine title.');
            return;
        }
        if (steps.length === 0) {
            toast.error('Please add at least one step.');
            return;
        }
        const newRoutine = {
            id: `custom_${Date.now()}`,
            title: title.trim(),
            description: description.trim() || 'Custom user routine',
            icon: 'PrayerRug',
            color: 'from-emerald-500 to-teal-600',
            steps: steps.map((s, i) => ({
                ...s,
                description: dhikrs.find(d => d.id === s.dhikrId)?.transliteration || `Step ${i+1}`
            }))
        };
        addCustomRoutine(newRoutine);
        toast.success('Custom routine created!');
        
        // Reset form
        setTitle('');
        setDescription('');
        setSteps([]);
        setIsCreating(false);
    };

    const allRoutines = [...defaultRoutines, ...customRoutines];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh] flex flex-col p-0">
                <SheetDescription className="sr-only">
                    View, create, and start guided dhikr routines.
                </SheetDescription>
                {open && (
                    <>
                        <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
                        <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
                            <div className="flex justify-between items-center">
                                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5" />
                                    Dhikr Routines
                                </SheetTitle>
                                <button
                                    onClick={() => setIsCreating(!isCreating)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                                >
                                    {isCreating ? <X size={13} /> : <Plus size={13} />}
                                    {isCreating ? t('general.cancel') : 'Create Custom'}
                                </button>
                            </div>
                        </SheetHeader>

                        <ScrollArea className="flex-1 px-6 py-4">
                            <AnimatePresence mode="wait">
                                {isCreating ? (
                                    <motion.div
                                        key="create-form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4 pb-12"
                                    >
                                        <h3 className="text-sm font-bold text-foreground">Create Custom Routine</h3>
                                        
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Title</label>
                                                <input 
                                                    type="text" 
                                                    value={title} 
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                                                    placeholder="E.g., Morning Meditations"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
                                                <input 
                                                    type="text" 
                                                    value={description} 
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/20 text-sm text-foreground focus:outline-none"
                                                    placeholder="E.g., A collection of focal praises for peace"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Steps ({steps.length})</span>
                                                <button
                                                    onClick={handleAddStep}
                                                    className="text-xs text-primary flex items-center gap-1 hover:underline cursor-pointer"
                                                >
                                                    <PlusCircle size={14} /> Add Step
                                                </button>
                                            </div>

                                            {steps.length === 0 ? (
                                                <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border/30 rounded-xl">
                                                    No steps added. Click "Add Step" above.
                                                </p>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    {steps.map((step, idx) => (
                                                        <div key={idx} className="flex gap-2 items-center p-3.5 rounded-xl bg-foreground/5 border border-border/20">
                                                            <select
                                                                value={step.dhikrId}
                                                                onChange={(e) => handleUpdateStepDhikr(idx, e.target.value)}
                                                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-background text-xs border border-border/20 text-foreground"
                                                            >
                                                                {dhikrs.map(d => (
                                                                    <option key={d.id} value={d.id}>{d.transliteration}</option>
                                                                ))}
                                                            </select>
                                                            
                                                            <input
                                                                type="number"
                                                                value={step.target}
                                                                onChange={(e) => handleUpdateStepTarget(idx, Math.max(1, parseInt(e.target.value) || 0))}
                                                                className="w-16 px-2 py-1 rounded-lg bg-background text-xs text-center border border-border/20 text-foreground"
                                                            />

                                                            <button
                                                                onClick={() => handleRemoveStep(idx)}
                                                                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleSaveRoutine}
                                            className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
                                        >
                                            Save Custom Routine
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="routines-list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4 pb-12"
                                    >
                                        <p className="text-xs text-muted-foreground leading-normal">
                                            Guided sequences of Adhkar for morning, evening, and special occasions.
                                        </p>

                                        <div className="grid gap-3">
                                            {allRoutines.map((routine, index) => {
                                                const isActive = sessionMode.type === 'routine' && sessionMode.routineId === routine.id;
                                                const isCustom = routine.id.startsWith('custom_');

                                                return (
                                                    <div 
                                                        key={routine.id}
                                                        className="relative group border border-border/40 rounded-2xl overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => handleStartRoutine(routine.id)}
                                                            className={`
                                                                w-full text-left transition-all duration-300 relative
                                                                ${isActive ? 'bg-primary/5' : 'bg-card hover:bg-accent/40'}
                                                            `}
                                                        >
                                                            <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${routine.color}`} />
                                                            
                                                            <div className="p-4 space-y-3 relative z-10">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`
                                                                            w-9 h-9 rounded-xl flex items-center justify-center
                                                                            bg-gradient-to-br ${routine.color} text-white shadow-sm
                                                                        `}>
                                                                            {routine.icon === 'Sun' && <Sun className="w-4 h-4" />}
                                                                            {routine.icon === 'Moon' && <Moon className="w-4 h-4" />}
                                                                            {routine.icon === 'PrayerRug' && <span className="text-base">🤲</span>}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-bold text-sm text-foreground">{routine.title}</h3>
                                                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium mt-0.5">
                                                                                <span className="flex items-center gap-0.5">
                                                                                    <Clock className="w-2.5 h-2.5" />
                                                                                    ~{Math.ceil(routine.steps.reduce((acc: number, s: any) => acc + s.target, 0) * 1.5 / 60)} min
                                                                                </span>
                                                                                <span>•</span>
                                                                                <span>{routine.steps.length} Steps</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5">
                                                                        {isActive && (
                                                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                                                                                <Play className="w-2 h-2 fill-current" />
                                                                                Active
                                                                            </span>
                                                                        )}
                                                                        {isCustom && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    removeCustomRoutine(routine.id);
                                                                                    toast.success('Routine deleted.');
                                                                                }}
                                                                                className="p-1 hover:bg-rose-500/10 text-rose-500 rounded-lg opacity-80 hover:opacity-100 cursor-pointer"
                                                                            >
                                                                                <Trash2 size={13} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                                    {routine.description}
                                                                </p>

                                                                <div className="space-y-1.5 pt-2 border-t border-border/10">
                                                                    {routine.steps.slice(0, 3).map((step: any, i: number) => (
                                                                        <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                                            <div className="w-1 h-1 rounded-full bg-primary/30" />
                                                                            <span className="truncate flex-1">{step.description || `Step ${i + 1}`}</span>
                                                                        </div>
                                                                    ))}
                                                                    {routine.steps.length > 3 && (
                                                                        <div className="text-[9px] text-muted-foreground/60 pl-3">
                                                                            + {routine.steps.length - 3} more...
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ScrollArea>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
