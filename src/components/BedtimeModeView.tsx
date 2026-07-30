import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X, Volume2, Sparkles, Wind, CheckCircle2 } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { speakArabic } from '@/lib/audioRecitations';
import { ambientEngine } from '@/lib/sound';
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
  repetitions: number;
}

const BEDTIME_STEPS: BedtimeStep[] = [
  {
    id: 'ayat-kursi', title: 'Ayat al-Kursi',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    transliteration: 'Allahu la ilaha illa huwal-Hayyul-Qayyum, la ta\'khudhuhus-sinatuw-wa la nawm...',
    meaning: 'The Throne Verse — recite before sleep for continuous divine protection through the night',
    count: 1, repetitions: 1,
  },
  {
    id: 'ikhlas', title: 'Surah Al-Ikhlas',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: 'Qul huwallahu ahad, Allahus-samad...',
    meaning: 'Say: He is Allah, the One — equivalent to a third of the Quran (recite 3 times)',
    count: 1, repetitions: 3,
  },
  {
    id: 'falaq', title: 'Surah Al-Falaq',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ',
    transliteration: "Qul a'udhu birabbil-falaq...",
    meaning: 'Say: I seek refuge in the Lord of the daybreak (recite 3 times)',
    count: 1, repetitions: 3,
  },
  {
    id: 'nas', title: 'Surah An-Nas',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ',
    transliteration: "Qul a'udhu birabbin-nas...",
    meaning: 'Say: I seek refuge in the Lord of mankind (recite 3 times)',
    count: 1, repetitions: 3,
  },
  {
    id: 'subhan', title: 'Subhan-Allah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhan-Allah',
    meaning: 'Glory be to Allah — recite 33 times before sleep',
    count: 33, repetitions: 1,
  },
  {
    id: 'alhamd', title: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Praise be to Allah — recite 33 times before sleep',
    count: 33, repetitions: 1,
  },
  {
    id: 'akbar', title: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);
  const dimTimer = useRef<ReturnType<typeof setTimeout>>();

  const { increment } = useTasbeehStore(useShallow(s => ({ increment: s.increment })));

  const step = BEDTIME_STEPS[stepIndex];
  const totalRepsTarget = step ? step.count * step.repetitions : 1;
  const overallCount = repIndex * (step?.count ?? 0) + tapCount;
  const progress = step ? Math.min(overallCount / totalRepsTarget, 1) : 0;

  const resetDimTimer = useCallback(() => {
    setDimmed(false);
    clearTimeout(dimTimer.current);
    dimTimer.current = setTimeout(() => setDimmed(true), 15_000);
  }, []);

  useEffect(() => {
    resetDimTimer();
    return () => {
      clearTimeout(dimTimer.current);
      ambientEngine.stop();
    };
  }, [resetDimTimer]);

  const toggleAmbient = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ambientActive) {
      ambientEngine.stop();
      setAmbientActive(false);
    } else {
      ambientEngine.play('rain', 0.25);
      setAmbientActive(true);
      toast.success('🌧️ Soft rain ambient sound playing');
    }
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!step) return;
    setIsPlayingAudio(true);
    speakArabic(step.arabic);
    setTimeout(() => setIsPlayingAudio(false), 4000);
  };

  const handleTap = useCallback(() => {
    if (!step) return;
    resetDimTimer();
    const next = tapCount + 1;

    if (next >= step.count) {
      const nextRep = repIndex + 1;
      if (nextRep >= step.repetitions) {
        const nextStep = stepIndex + 1;
        if (nextStep >= BEDTIME_STEPS.length) {
          setCompleted(true);
          ambientEngine.stop();
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
      if (e.code === 'Escape') {
        ambientEngine.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleTap, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
      style={{ background: '#04020a' }}
      onClick={dimmed ? resetDimTimer : handleTap}
    >
      {/* Dim overlay */}
      <AnimatePresence>
        {dimmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.88 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div
        className="absolute left-0 right-0 z-20 flex justify-between items-center w-full max-w-md mx-auto px-6"
        style={{ top: 'max(24px, calc(env(safe-area-inset-top) + 12px))' }}
      >
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Bedtime Adhkar</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAmbient}
            className={`p-2.5 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
              ambientActive ? 'bg-blue-500/20 text-blue-300 border-blue-400/40' : 'bg-white/10 text-white/60 border-white/5 hover:bg-white/20'
            }`}
            title="Toggle Ambient Rain Sound"
          >
            <Wind size={16} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); ambientEngine.stop(); onClose(); }}
            className="p-2.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/5 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {completed ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-8 space-y-4 z-20">
          <span className="text-6xl">🌙</span>
          <h2 className="text-2xl font-bold text-white/90">Bedtime Adhkar Complete</h2>
          <p className="text-sm text-white/50 max-w-[260px] mx-auto leading-relaxed">
            May Allah protect your night, forgive your sins, and grant you peaceful sleep. In sha Allah.
          </p>
          <button
            onClick={() => { ambientEngine.stop(); onClose(); }}
            className="mt-4 px-8 py-3.5 rounded-2xl bg-white/15 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/25 transition-all cursor-pointer"
          >
            Close
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-sm px-6 space-y-7 text-center z-20">
          {/* Step progress dots */}
          <div className="flex items-center justify-center gap-2">
            {BEDTIME_STEPS.map((s, i) => (
              <div key={s.id} className={`transition-all rounded-full ${
                i < stepIndex ? 'w-2.5 h-2.5 bg-blue-400' :
                i === stepIndex ? 'w-5 h-2.5 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' :
                'w-2.5 h-2.5 bg-white/10'
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
              <div className="flex items-center justify-center gap-2">
                <p className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.25em]">{step?.title}</p>
                <button
                  onClick={handlePlayAudio}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isPlayingAudio ? 'text-blue-300 animate-pulse' : 'text-white/40 hover:text-white/80'
                  }`}
                  title="Listen to recitation"
                >
                  <Volume2 size={14} />
                </button>
              </div>

              {/* Arabic text */}
              <p
                className="text-2xl sm:text-3xl leading-loose text-blue-200/90 font-bold"
                style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
              >
                {step?.arabic}
              </p>

              <p className="text-xs text-white/40 italic leading-relaxed px-2">{step?.meaning}</p>
            </motion.div>
          </AnimatePresence>

          {/* Circular progress + count */}
          <div className="relative flex items-center justify-center mx-auto" style={{ width: 140, height: 140 }}>
            <svg className="absolute inset-0 -rotate-90" width={140} height={140}>
              <circle cx={70} cy={70} r={62} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
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
              <p className="text-4xl font-bold text-white/90 tabular-nums">{tapCount}</p>
              <p className="text-[10px] text-white/40">of {step?.count}</p>
              {step && step.repetitions > 1 && (
                <p className="text-[10px] text-blue-400 font-semibold mt-0.5">Rep {repIndex + 1}/{step.repetitions}</p>
              )}
            </div>
          </div>

          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-[10px] text-white/30 uppercase tracking-[0.2em]"
          >
            Tap anywhere to count
          </motion.p>
        </div>
      )}
    </motion.div>
  );
}
