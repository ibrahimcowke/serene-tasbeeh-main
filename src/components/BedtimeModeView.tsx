import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X, ChevronRight, CheckCircle2, Volume2 } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';

interface BedtimeModeViewProps {
  onClose: () => void;
}

interface BedtimeStep {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  repetitions: number; // how many times to complete `count`
}

const BEDTIME_STEPS: BedtimeStep[] = [
  {
    id: 'ayat-kursi', title: 'Ayat al-Kursi',
    arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    transliteration: 'Allahu la ilaha illa huwal-Hayyul-Qayyum...',
    meaning: 'The Throne Verse — the greatest verse of the Quran',
    count: 1, repetitions: 1,
  },
  {
    id: 'ikhlas', title: 'Surah Al-Ikhlas',
    arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ',
    transliteration: 'Qul huwallahu ahad, Allahus-samad...',
    meaning: 'Say: He is Allah, the One — equivalent to a third of the Quran',
    count: 1, repetitions: 3,
  },
  {
    id: 'falaq', title: 'Surah Al-Falaq',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    transliteration: "Qul a'udhu birabbil-falaq...",
    meaning: 'Say: I seek refuge in the Lord of the daybreak',
    count: 1, repetitions: 3,
  },
  {
    id: 'nas', title: 'Surah An-Nas',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
    transliteration: "Qul a'udhu birabbin-nas...",
    meaning: 'Say: I seek refuge in the Lord of mankind',
    count: 1, repetitions: 3,
  },
  {
    id: 'subhan', title: 'Subhan-Allah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'Subhan-Allah',
    meaning: 'Glory be to Allah — recite 33 times before sleep',
    count: 33, repetitions: 1,
  },
  {
    id: 'alhamd', title: 'Alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Praise be to Allah — recite 33 times before sleep',
    count: 33, repetitions: 1,
  },
  {
    id: 'akbar', title: 'Allahu Akbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest — recite 34 times before sleep',
    count: 34, repetitions: 1,
  },
];

export function BedtimeModeView({ onClose }: BedtimeModeViewProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [repIndex, setRepIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [dimmed, setDimmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const dimTimer = useRef<ReturnType<typeof setTimeout>>();

  const { increment } = useTasbeehStore(useShallow(s => ({ increment: s.increment })));

  const step = BEDTIME_STEPS[stepIndex];
  const totalRepsTarget = step ? step.count * step.repetitions : 1;
  const overallCount = repIndex * (step?.count ?? 0) + tapCount;
  const progress = step ? Math.min(overallCount / totalRepsTarget, 1) : 0;

  // Auto-dim after 20s inactivity
  const resetDimTimer = useCallback(() => {
    setDimmed(false);
    clearTimeout(dimTimer.current);
    dimTimer.current = setTimeout(() => setDimmed(true), 20_000);
  }, []);

  useEffect(() => {
    resetDimTimer();
    return () => clearTimeout(dimTimer.current);
  }, []);

  const handleTap = useCallback(() => {
    if (!step) return;
    resetDimTimer();
    const next = tapCount + 1;

    if (next >= step.count) {
      // Completed one repetition
      const nextRep = repIndex + 1;
      if (nextRep >= step.repetitions) {
        // Step complete
        const nextStep = stepIndex + 1;
        if (nextStep >= BEDTIME_STEPS.length) {
          setCompleted(true);
          toast.success('🌙 Bedtime adhkar complete. Sleep in peace, in sha Allah.');
        } else {
          setStepIndex(nextStep);
          setRepIndex(0);
          setTapCount(0);
        }
      } else {
        setRepIndex(nextRep);
        setTapCount(0);
      }
    } else {
      setTapCount(next);
    }
    increment();
  }, [tapCount, repIndex, stepIndex, step, resetDimTimer, increment]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') handleTap();
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleTap, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#050208' }}
      onClick={dimmed ? resetDimTimer : handleTap}
    >
      {/* Dim overlay */}
      <AnimatePresence>
        {dimmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Close button */}
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-safe-top right-4 p-2 rounded-xl bg-white/5 text-white/30 hover:text-white/70 transition-colors z-20 cursor-pointer"
        style={{ top: 'max(16px, env(safe-area-inset-top))' }}
      >
        <X size={18} />
      </button>

      {/* Mode label */}
      <div className="absolute top-safe-top left-4 flex items-center gap-2 z-20" style={{ top: 'max(16px, env(safe-area-inset-top))' }}>
        <Moon className="w-4 h-4 text-blue-400/60" />
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Bedtime Mode</span>
      </div>

      {completed ? (
        /* Completion screen */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-8 space-y-4">
          <span className="text-6xl">🌙</span>
          <h2 className="text-2xl font-black text-white/90">Adhkar Complete</h2>
          <p className="text-sm text-white/40 max-w-[240px] mx-auto">
            May Allah bless your night and grant you peaceful sleep. In sha Allah.
          </p>
          <button onClick={onClose} className="mt-4 px-6 py-3 rounded-2xl bg-white/10 text-white/70 text-xs font-black uppercase tracking-wider hover:bg-white/15 transition-all">
            Close
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-sm px-6 space-y-8 text-center">
          {/* Step progress dots */}
          <div className="flex items-center justify-center gap-1.5">
            {BEDTIME_STEPS.map((s, i) => (
              <div key={s.id} className={`transition-all rounded-full ${
                i < stepIndex ? 'w-2 h-2 bg-blue-400/60' :
                i === stepIndex ? 'w-4 h-2 bg-blue-400' :
                'w-2 h-2 bg-white/10'
              }`} />
            ))}
          </div>

          {/* Step info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em]">{step?.title}</p>

              {/* Arabic text */}
              <p
                className="text-3xl leading-loose text-blue-300/90"
                style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
              >
                {step?.arabic}
              </p>

              <p className="text-xs text-white/30 italic">{step?.meaning}</p>
            </motion.div>
          </AnimatePresence>

          {/* Circular progress + count */}
          <div className="relative flex items-center justify-center mx-auto" style={{ width: 140, height: 140 }}>
            <svg className="absolute inset-0 -rotate-90" width={140} height={140}>
              <circle cx={70} cy={70} r={62} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
              <circle
                cx={70} cy={70} r={62}
                fill="none"
                stroke="rgb(147,197,253)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 62}`}
                strokeDashoffset={`${2 * Math.PI * 62 * (1 - progress)}`}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div className="text-center">
              <p className="text-4xl font-black text-white/90 tabular-nums">{tapCount}</p>
              <p className="text-[10px] text-white/30">of {step?.count}</p>
              {step && step.repetitions > 1 && (
                <p className="text-[9px] text-blue-400/60">Rep {repIndex + 1}/{step.repetitions}</p>
              )}
            </div>
          </div>

          {/* Tap instruction */}
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-[10px] text-white/25 uppercase tracking-[0.2em]"
          >
            Tap anywhere to count
          </motion.p>
        </div>
      )}
    </motion.div>
  );
}
