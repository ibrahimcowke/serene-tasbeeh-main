import { useEffect, useState } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { formatSessionTime } from '@/lib/timeUtils';
import { useTranslation } from '@/lib/i18n';
import { Clock, Timer, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { SoundManager } from '@/lib/sound';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function SessionTimer() {
  const {
    sessionStartTime,
    currentCount,
    sessionTimerDuration,
    sessionTimerActive,
    setSessionTimerDuration,
    setSessionTimerActive,
    stopAutoCount,
    reset,
    saveActiveSession,
  } = useTasbeehStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [open, setOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [customVal, setCustomVal] = useState(15); // Default custom 15 mins
  const { t, isRTL } = useTranslation();

  // Tick effect
  useEffect(() => {
    if (!sessionStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      setElapsedSeconds(elapsed);

      // Check if timer finished
      if (sessionTimerDuration > 0 && sessionTimerActive && elapsed >= sessionTimerDuration) {
        // Complete session
        SoundManager.playCompletion();
        setCompletionCount(currentCount);
        setShowCompletion(true);
        
        // Stop counting
        stopAutoCount();
        setSessionTimerActive(false);
        saveActiveSession();
        reset();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, sessionTimerDuration, sessionTimerActive, currentCount, stopAutoCount, setSessionTimerActive, saveActiveSession, reset]);

  // Formatter helper
  const getDisplayTime = () => {
    if (sessionTimerDuration > 0 && sessionTimerActive) {
      const remaining = Math.max(0, sessionTimerDuration - elapsedSeconds);
      return formatSessionTime(remaining);
    }
    return formatSessionTime(elapsedSeconds);
  };

  const handleSelectPreset = (seconds: number) => {
    setSessionTimerDuration(seconds);
    setSessionTimerActive(seconds > 0);
    setOpen(false);
  };

  // If timer is disabled and elapsed is 0, display a "Set Timer" pill
  const isCountdown = sessionTimerDuration > 0 && sessionTimerActive;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-light tracking-wide flex items-center gap-1.5 backdrop-blur-sm transition-all border ${
              isCountdown
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {isCountdown ? <Timer className="w-3 h-3 animate-pulse" /> : <Clock className="w-3 h-3" />}
            <span className="font-mono tabular-nums">
              {isCountdown ? `${getDisplayTime()} remaining` : (t('timer.off') || 'Off')}
            </span>
          </motion.button>
        </SheetTrigger>

        <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <SheetDescription className="sr-only">Choose a timer duration for your session.</SheetDescription>
          <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
          <SheetHeader className="text-left px-6 pt-2 pb-4">
            <SheetTitle className="text-lg font-medium flex items-center gap-2">
              <Timer className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
              {t('timer.title') || 'Session Timer'}
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 space-y-6">
            {/* Presets */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('timer.5min') || '5 Minutes', val: 300 },
                { label: t('timer.10min') || '10 Minutes', val: 600 },
                { label: t('timer.20min') || '20 Minutes', val: 1200 },
                { label: t('timer.off') || 'Off', val: 0 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => handleSelectPreset(p.val)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-center flex items-center justify-between ${
                    sessionTimerDuration === p.val
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-background border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{p.label}</span>
                  {sessionTimerDuration === p.val && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>

            {/* Custom slider */}
            <div className="space-y-3 p-4 rounded-2xl bg-card border border-border/40">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>{t('timer.custom') || 'Custom'}</span>
                <span className="text-primary font-mono">{customVal} min</span>
              </div>
              <Slider
                min={1}
                max={60}
                step={1}
                value={[customVal]}
                onValueChange={([val]) => setCustomVal(val)}
                className="w-full accent-primary"
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectPreset(customVal * 60)}
                className="w-full mt-2 py-2 rounded-xl text-xs font-semibold text-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                Set {customVal} Minutes
              </motion.button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Completion Dialog */}
      <Dialog open={showCompletion} onOpenChange={setShowCompletion}>
        <DialogContent className="max-w-xs rounded-2xl p-6 text-center bg-sheet-bg border border-border/40" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogDescription className="sr-only">Session complete summary.</DialogDescription>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <Check className="w-6 h-6 text-emerald-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-center text-foreground">
                {t('timer.done') || 'Session Complete!'}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('timer.counted') || 'You counted'} <span className="font-bold text-primary font-mono">{completionCount}</span> {t('timer.times') || 'times'}.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setShowCompletion(false);
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold mt-2"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
                color: 'hsl(var(--primary-foreground))',
                boxShadow: '0 4px 15px hsl(var(--primary) / 0.2)',
              }}
            >
              Alhamdulillah
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
