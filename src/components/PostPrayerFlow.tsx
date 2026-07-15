import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { useTranslation } from '@/lib/i18n';

export function PostPrayerFlow() {
  const { t } = useTranslation();
  const currentCount = useTasbeehStore((s) => s.currentCount);
  const targetCount = useTasbeehStore((s) => s.targetCount);
  const sessionMode = useTasbeehStore((s) => s.sessionMode);
  const currentDhikr = useTasbeehStore((s) => s.currentDhikr);
  const increment = useTasbeehStore((s) => s.increment);
  const exitSessionMode = useTasbeehStore((s) => s.exitSessionMode);

  if (sessionMode.type !== 'tasbih100') return null;

  const currentPhase = sessionMode.currentPhase;
  const phases = [
    { label: 'SubhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33 },
    { label: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33 },
    { label: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 33 },
    { label: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', target: 1 }
  ];

  const progress = (currentCount / targetCount) * 100;

  return (
    <div 
      className="fixed inset-0 z-40 flex flex-col justify-between p-6 bg-background/95 backdrop-blur-xl animate-fade-in"
      style={{
        background: `radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.15) 0%, transparent 65%), hsl(var(--background))`
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full pt-safe">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Guided Practice</span>
          <h2 className="text-base font-semibold text-foreground">Post-Prayer Tasbeeh</h2>
        </div>
        <button
          onClick={exitSessionMode}
          className="p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full border border-border/20 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Tap Area and Count */}
      <div className="flex flex-col items-center justify-center flex-grow py-8 select-none">
        {/* Arabic Text */}
        <motion.div
          key={currentDhikr.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="font-arabic text-3xl sm:text-4xl text-primary font-bold mb-2">
            {currentDhikr.arabic}
          </p>
          <p className="text-sm text-muted-foreground italic">
            {currentDhikr.transliteration}
          </p>
        </motion.div>

        {/* Circular Tap Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={increment}
          className="relative w-64 h-64 rounded-full flex items-center justify-center cursor-pointer shadow-2xl focus:outline-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--card) / 0.9) 0%, hsl(var(--card) / 0.7) 100%)',
            border: '1px solid hsl(var(--primary) / 0.15)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 1px hsl(var(--primary-foreground) / 0.1)'
          }}
        >
          {/* Progress Ring */}
          <div className="absolute inset-4">
            <ProgressRing progress={progress} strokeWidth={8} />
          </div>

          {/* Counts */}
          <div className="flex flex-col items-center justify-center z-10">
            <motion.span 
              key={currentCount}
              initial={{ scale: 0.85, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-extrabold text-foreground tabular-nums leading-none mb-1"
            >
              {currentCount}
            </motion.span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              of {targetCount}
            </span>
          </div>
        </motion.button>

        <p className="text-[11px] text-muted-foreground mt-6 text-center animate-pulse">
          Tap anywhere in the circle to count
        </p>
      </div>

      {/* Bottom: Progress Steps Indicator */}
      <div className="w-full space-y-4 pb-safe-bottom">
        <div className="grid grid-cols-4 gap-2">
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentPhase;
            const isActive = idx === currentPhase;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all duration-300"
                style={{
                  background: isActive 
                    ? 'hsl(var(--primary) / 0.12)' 
                    : isCompleted 
                      ? 'hsl(var(--primary) / 0.03)' 
                      : 'transparent',
                  borderColor: isActive 
                    ? 'hsl(var(--primary) / 0.4)' 
                    : isCompleted 
                      ? 'hsl(var(--primary) / 0.2)' 
                      : 'hsl(var(--border) / 0.3)'
                }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-primary mb-1 shrink-0" />
                ) : (
                  <span 
                    className="text-[10px] font-bold mb-1"
                    style={{ color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
                  >
                    Phase {idx + 1}
                  </span>
                )}
                <span 
                  className="text-[9px] font-medium leading-none text-ellipsis overflow-hidden whitespace-nowrap w-full"
                  style={{ color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                >
                  {phase.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
