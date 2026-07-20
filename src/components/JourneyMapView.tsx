import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Compass, X, Check, Award, Lock, Sparkles, BookOpen, RotateCcw, Quote
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { SoundManager } from '@/lib/sound';
import { toast } from 'sonner';

interface JourneyMapViewProps {
    children: React.ReactNode;
}

interface JourneyStage {
    id: number;
    title: string;
    dhikrId: string;
    dhikrLabel: string;
    arabic: string;
    target: number;
    description: string;
    wisdomText: string;
    wisdomSource: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

const STAGES: JourneyStage[] = [
    {
        id: 1,
        title: 'Gate of Repentance',
        dhikrId: 'astaghfirullah',
        dhikrLabel: 'Astaghfirullah',
        arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
        target: 300,
        description: 'Purify the heart by seeking sincere forgiveness.',
        wisdomText: 'And seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful.',
        wisdomSource: 'Surah Al-Muzzammil 73:20',
        icon: Lock,
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 2,
        title: 'Valley of Gratitude',
        dhikrId: 'alhamdulillah',
        dhikrLabel: 'Alhamdulillah',
        arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
        target: 500,
        description: 'Fill the soul with positive remembrance and gratitude.',
        wisdomText: 'If you are grateful, I will surely increase you [in favor].',
        wisdomSource: 'Surah Ibrahim 14:7',
        icon: Sparkles,
        color: 'from-emerald-500 to-teal-500'
    },
    {
        id: 3,
        title: 'Garden of Praise',
        dhikrId: 'subahanallah',
        dhikrLabel: 'SubhanAllah',
        arabic: 'سُبْحَانَ ٱللَّٰهِ',
        target: 500,
        description: 'Praise Allah for His infinite perfection and majesty.',
        wisdomText: 'So glorify Allah when you reach evening and when you reach morning.',
        wisdomSource: 'Surah Ar-Rum 30:17',
        icon: BookOpen,
        color: 'from-blue-500 to-indigo-500'
    },
    {
        id: 4,
        title: 'Summit of Blessings',
        dhikrId: 'allahuma-sali',
        dhikrLabel: 'Salawat (SCW)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        target: 1000,
        description: 'Send peace and blessings upon the Prophet Muhammad (SCW).',
        wisdomText: 'Indeed, Allah and His angels send blessings upon the Prophet. O you who have believed, ask [ Allah to send] blessings upon him and submit in peace.',
        wisdomSource: 'Surah Al-Ahzab 33:56',
        icon: Award,
        color: 'from-amber-500 to-yellow-500'
    }
];

export function JourneyMapView({ children }: JourneyMapViewProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[92vh] p-0 overflow-hidden flex flex-col">
                <SheetDescription className="sr-only">
                    Spiritual Journey Map is a gamified path to complete milestones of dhikr.
                </SheetDescription>
                {open && (
                    <>
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                        </div>
                        <JourneyMapContent onClose={() => setOpen(false)} />
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

function JourneyMapContent({ onClose }: { onClose: () => void }) {
    const journeyStage = useTasbeehStore((s) => s.journeyStage);
    const journeyProgress = useTasbeehStore((s) => s.journeyProgress);
    const journeyPrestige = useTasbeehStore((s) => s.journeyPrestige);
    
    const advanceStage = useTasbeehStore((s) => s.advanceJourneyStage);
    const prestigeJourney = useTasbeehStore((s) => s.prestigeJourney);
    const resetJourney = useTasbeehStore((s) => s.resetJourney);
    
    const setDhikr = useTasbeehStore((s) => s.setDhikr);
    const dhikrs = useTasbeehStore((s) => s.dhikrs);

    const getStageTarget = (stage: JourneyStage) => {
        return stage.target * (journeyPrestige + 1);
    };

    const handleSelectDhikr = (dhikrId: string) => {
        const d = dhikrs.find(x => x.id === dhikrId);
        if (d) {
            setDhikr(d);
            toast.success(`Active Dhikr switched to: ${d.transliteration}`);
            onClose();
        }
    };

    const handleAdvance = (stage: JourneyStage) => {
        const target = getStageTarget(stage);
        const progressVal = journeyProgress[stage.dhikrId] || 0;
        
        if (journeyStage === stage.id && progressVal >= target) {
            if (stage.id === 4) {
                // Completed Stage 4 -> Prestige Ascent!
                prestigeJourney();
                SoundManager.playCompletion();
                toast.success(`MashaAllah! You completed the Spiritual Journey! Ascended to Prestige Level ${journeyPrestige + 1} 🌟`);
            } else {
                advanceStage();
                toast.success(`Congratulations! Stage "${stage.title}" completed. Unlocked next stage.`);
            }
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset your spiritual journey progress and prestige rank?")) {
            resetJourney();
            toast.info("Journey progress has been reset.");
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden px-5 pb-5">
            {/* Header */}
            <div className="flex items-center justify-between py-3 border-b border-border/10 shrink-0">
                <div className="text-left">
                    <h2 className="text-base font-semibold flex items-center gap-2">
                        <Compass size={16} className="text-primary" />
                        Spiritual Journey
                        {journeyPrestige > 0 && (
                            <span className="text-[10px] bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full text-primary font-bold animate-pulse">
                                🌟 Prestige {journeyPrestige}
                            </span>
                        )}
                    </h2>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                        Progress through milestones of dhikr to nurture your soul
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleReset}
                        className="p-2 rounded-xl border border-border/30 hover:bg-muted/10 text-muted-foreground hover:text-foreground transition-colors"
                        title="Reset Journey"
                    >
                        <RotateCcw size={14} />
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-xl border border-border/30 hover:bg-muted/10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Scrollable journey map */}
            <div className="flex-1 overflow-y-auto py-6 flex flex-col items-center min-h-0 relative">
                
                {/* Visual Connector Winding Line */}
                <div className="absolute top-12 bottom-12 w-1 border-r border-dashed border-primary/30 z-0 hidden sm:block" />

                <div className="w-full max-w-lg space-y-8 z-10">
                    {STAGES.map((stage, idx) => {
                        const isCompleted = journeyStage > stage.id;
                        const isActive = journeyStage === stage.id;
                        const isLocked = journeyStage < stage.id;
                        
                        const progressVal = journeyProgress[stage.dhikrId] || 0;
                        const target = getStageTarget(stage);
                        const progressPercent = Math.min(100, Math.round((progressVal / target) * 100));
                        const isReadyToAdvance = isActive && progressVal >= target;
                        
                        const Icon = isCompleted ? Check : (isLocked ? Lock : stage.icon);

                        return (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border transition-all ${
                                    isActive 
                                        ? 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/20' 
                                        : (isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/30 bg-card/20 opacity-60')
                                }`}
                            >
                                {/* Stage marker icon */}
                                <div 
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-transform ${
                                        isActive ? 'scale-105 animate-pulse' : ''
                                    }`}
                                    style={{
                                        background: isCompleted 
                                            ? 'hsl(var(--emerald-500) / 0.12)' 
                                            : (isLocked ? 'rgba(128,128,128,0.1)' : 'hsl(var(--primary) / 0.12)'),
                                        borderColor: isCompleted 
                                            ? '#10b981' 
                                            : (isLocked ? 'rgba(128,128,128,0.3)' : 'hsl(var(--primary) / 0.4)'),
                                        color: isCompleted 
                                            ? '#10b981' 
                                            : (isLocked ? 'gray' : 'hsl(var(--primary))')
                                    }}
                                >
                                    <Icon size={20} />
                                </div>

                                {/* Text content */}
                                <div className="flex-1 text-center sm:text-left min-w-0 space-y-1.5 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Stage {stage.id}: {stage.title}
                                        </h3>
                                        <span className="text-[10px] text-muted-foreground italic truncate">
                                            {stage.arabic}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        {stage.description}
                                    </p>

                                    {/* Quranic/Hadith wisdom box */}
                                    {!isLocked && (
                                        <div className="p-3 rounded-xl bg-card/40 border border-border/10 text-left relative flex flex-col gap-1">
                                            <Quote size={12} className="text-primary/20 self-start" />
                                            <p className="text-[10px] italic text-muted-foreground leading-relaxed pr-2">
                                                {stage.wisdomText}
                                            </p>
                                            <span className="text-[8px] text-primary/60 font-semibold self-end">
                                                — {stage.wisdomSource}
                                            </span>
                                        </div>
                                    )}

                                    {/* Progress view */}
                                    {!isLocked && (
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                <span className="font-semibold text-foreground/80">{stage.dhikrLabel} Progress:</span>
                                                <span>{progressVal} / {target} ({progressPercent}%)</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${
                                                        isCompleted ? 'bg-emerald-500' : 'bg-primary'
                                                    }`}
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Action button */}
                                    {isActive && (
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleSelectDhikr(stage.dhikrId)}
                                                className="px-3 py-1.5 rounded-xl border border-primary/30 text-primary text-[10px] font-semibold hover:bg-primary/5 transition-colors"
                                            >
                                                Switch to this Dhikr
                                            </button>
                                            {isReadyToAdvance && (
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAdvance(stage)}
                                                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                                                >
                                                    {stage.id === 4 ? `Ascend to Prestige ${journeyPrestige + 1} 🌟` : 'Complete Stage'}
                                                </motion.button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
