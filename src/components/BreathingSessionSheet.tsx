import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';

interface BreathingSessionSheetProps {
  children: React.ReactNode;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export function BreathingSessionSheet({ children }: BreathingSessionSheetProps) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(60); // 60s, 180s, 300s
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(4); // 4 seconds per phase (box breathing)
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<any>(null);

  // Sound effect fallback
  const playBeep = (freq: number, type: 'sine' | 'triangle', dur: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });

        setPhaseTimeLeft((prevPhaseTime) => {
          if (prevPhaseTime <= 1) {
            // Transition phase
            setPhase((prevPhase) => {
              let nextPhase: BreathPhase = 'inhale';
              if (prevPhase === 'inhale') { nextPhase = 'hold1'; playBeep(330, 'triangle', 0.25); }
              else if (prevPhase === 'hold1') { nextPhase = 'exhale'; playBeep(261, 'sine', 0.4); }
              else if (prevPhase === 'exhale') { nextPhase = 'hold2'; playBeep(220, 'triangle', 0.25); }
              else if (prevPhase === 'hold2') { nextPhase = 'inhale'; playBeep(392, 'sine', 0.4); }
              return nextPhase;
            });
            return 4; // Reset phase duration to 4s
          }
          return prevPhaseTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleStartSession = () => {
    setTimeLeft(duration);
    setPhase('inhale');
    setPhaseTimeLeft(4);
    setIsActive(true);
    playBeep(440, 'sine', 0.5);
  };

  const handleEndSession = () => {
    setIsActive(false);
    playBeep(523, 'sine', 0.8);
    toast.success('Peaceful session complete. Alhamdulillah!', { duration: 4000 });
    // Open mood tracker
    useTasbeehStore.getState().setShowMoodTracker(true);
    setOpen(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setPhase('inhale');
    setPhaseTimeLeft(4);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhale Deeply';
      case 'hold1': return 'Hold Breath';
      case 'exhale': return 'Exhale Slowly';
      case 'hold2': return 'Hold Breath';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'hsl(var(--primary))';
      case 'hold1': return 'hsl(var(--accent))';
      case 'exhale': return 'rgb(59, 130, 246)'; // Blue
      case 'hold2': return 'hsl(var(--accent))';
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if(!v) setIsActive(false); }}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh] flex flex-col p-0">
        <SheetDescription className="sr-only">
          Relax with a guided deep breathing session.
        </SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                  <Wind className="w-5 h-5 text-primary" />
                  Guided Breathing
                </SheetTitle>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </SheetHeader>

            <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
              {!isActive && timeLeft === duration ? (
                /* Choice layout */
                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Mindfulness</span>
                    <h3 className="text-xl font-extrabold text-foreground">Guided Box Breathing</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Settle into a comfortable posture. Inhale, hold, exhale, and hold for 4 seconds each to lower stress and sharpen focal awareness.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] px-1">Session Duration</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: '1 Minute', value: 60 },
                        { label: '3 Minutes', value: 180 },
                        { label: '5 Minutes', value: 300 }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setDuration(opt.value); setTimeLeft(opt.value); }}
                          className="py-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer"
                          style={{
                            background: duration === opt.value ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                            borderColor: duration === opt.value ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border) / 0.3)',
                            color: duration === opt.value ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.8)'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStartSession}
                    className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-primary/95 transition-all cursor-pointer shadow-lg mt-4 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Breathing Session
                  </button>
                </div>
              ) : (
                /* Active animation layout */
                <div className="flex-grow flex flex-col justify-between py-6">
                  {/* Timer */}
                  <div className="text-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Time Remaining</span>
                    <h4 className="text-3xl font-extrabold text-foreground tabular-nums mt-1">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </h4>
                  </div>

                  {/* Pulsating Ring */}
                  <div className="relative w-60 h-60 mx-auto flex items-center justify-center my-8">
                    {/* Ring background */}
                    <div className="absolute inset-0 rounded-full border border-border/10" />

                    {/* Animated pulsating circle */}
                    <motion.div
                      animate={{
                        scale: phase === 'inhale' ? [1, 1.45] 
                          : phase === 'hold1' ? 1.45 
                          : phase === 'exhale' ? [1.45, 1] 
                          : 1
                      }}
                      transition={{
                        duration: 4,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-8 rounded-full blur-[80px] opacity-40 transition-all duration-500"
                      style={{ backgroundColor: getPhaseColor() }}
                    />

                    {/* Solid ring visual */}
                    <motion.div
                      animate={{
                        scale: phase === 'inhale' ? [0.8, 1.25] 
                          : phase === 'hold1' ? 1.25 
                          : phase === 'exhale' ? [1.25, 0.8] 
                          : 0.8
                      }}
                      transition={{
                        duration: 4,
                        ease: 'easeInOut'
                      }}
                      className="absolute w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-colors duration-500 bg-card/60 backdrop-blur-md shadow-2xl"
                      style={{ borderColor: getPhaseColor() }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={phase}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs font-black uppercase tracking-wider text-center px-4 leading-normal"
                          style={{ color: getPhaseColor() }}
                        >
                          {getPhaseText()}
                        </motion.span>
                      </AnimatePresence>

                      <span className="text-3xl font-extrabold text-foreground tabular-nums mt-2">
                        {phaseTimeLeft}
                      </span>
                    </motion.div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 rounded-2xl bg-white/5 border border-border/15 hover:bg-white/10 text-foreground text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      {isActive ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
