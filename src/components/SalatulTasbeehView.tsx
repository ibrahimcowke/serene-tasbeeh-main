import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, ChevronRight, Info, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';

interface SalatulTasbeehViewProps {
  children: React.ReactNode;
}

const PHASES = ["Qiyam (Standing)", "Ruku' (Bowing)", "I'tidal (Rising)", "Sujud (Prostration)", "Jalsah (Sitting)"];
const DHIKR_TEXT = 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ';

export function SalatulTasbeehView({ children }: SalatulTasbeehViewProps) {
  const [open, setOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { startSalatulTasbeeh, sessionMode } = useTasbeehStore(useShallow(s => ({
    startSalatulTasbeeh: s.startSalatulTasbeeh,
    sessionMode: s.sessionMode,
  })));

  const isActive = sessionMode.type === 'salatul-tasbeeh' && !sessionMode.isComplete;
  const activeMode = sessionMode.type === 'salatul-tasbeeh' ? sessionMode : null;

  const handleBegin = () => {
    startSalatulTasbeeh();
    toast.success('🕌 Salatul Tasbeeh started! Count 10 for each position.');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[90vh] flex flex-col">
        <SheetDescription className="sr-only">Guided Salatul Tasbeeh — 4 rak'ahs, 200 dhikr total.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Salatul Tasbeeh
                </SheetTitle>
                <button
                  onClick={() => setShowInfo(p => !p)}
                  className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Info size={15} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Guided 4-rak'ah prayer · 200 dhikr total</p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8 pt-4">

              {/* Info panel */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2 text-xs text-muted-foreground leading-relaxed">
                      <p className="font-bold text-foreground/80">How Salatul Tasbeeh works</p>
                      <p>Recite the tasbeeh <strong className="text-foreground">10 times</strong> in each of the 5 positions per rak'ah:</p>
                      <ul className="list-disc list-inside space-y-0.5 pl-1">
                        {PHASES.map(p => <li key={p}>{p}</li>)}
                      </ul>
                      <p>4 rak'ahs × 5 positions × 10 = <strong className="text-primary">200 total dhikr</strong></p>
                      <p className="italic opacity-70">Based on the hadith narrated by Ibn Abbas (RA) — Abu Dawud, Tirmidhi, Ibn Majah.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dhikr text */}
              <div className="p-5 rounded-2xl border bg-foreground/[0.02] border-foreground/8 text-center">
                <p
                  className="text-xl leading-loose text-primary mb-2"
                  style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
                >
                  {DHIKR_TEXT}
                </p>
                <p className="text-[11px] text-muted-foreground italic">
                  SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar
                </p>
              </div>

              {/* Current progress (if active) */}
              {isActive && activeMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl border bg-green-500/5 border-green-500/20 space-y-3"
                >
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Session Active</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-foreground">Rak'ah {activeMode.rakah} of 4</p>
                      <p className="text-xs text-muted-foreground">{PHASES[activeMode.phase]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-400 tabular-nums">{activeMode.totalCompleted}</p>
                      <p className="text-[9px] text-muted-foreground uppercase">of 200</p>
                    </div>
                  </div>
                  {/* Rak'ah progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(r => (
                        <div key={r} className={`flex-1 h-1.5 rounded-full transition-all ${r < activeMode.rakah ? 'bg-green-400' : r === activeMode.rakah ? 'bg-green-400/50' : 'bg-foreground/10'}`} />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {PHASES.map((_, idx) => (
                        <div key={idx} className={`flex-1 h-0.5 rounded-full transition-all ${idx < activeMode.phase ? 'bg-primary' : idx === activeMode.phase ? 'bg-primary/50' : 'bg-foreground/10'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 text-center">Return to counter to continue reciting</p>
                </motion.div>
              )}

              {/* Structure overview */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] px-1">Structure per Rak'ah</p>
                {PHASES.map((phase, i) => (
                  <div key={phase} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-black text-primary">{i + 1}</span>
                    </div>
                    <span className="text-xs text-foreground/80 flex-1">{phase}</span>
                    <span className="text-[10px] font-black text-primary">× 10</span>
                  </div>
                ))}
              </div>

              {/* Begin button */}
              <button
                onClick={handleBegin}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
              >
                <Play className="w-4 h-4 fill-current" />
                {isActive ? 'Restart Session' : 'Begin Salatul Tasbeeh'}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
