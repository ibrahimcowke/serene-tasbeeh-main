import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { speakArabic } from '@/lib/audioRecitations';
import { useTranslation } from '@/lib/i18n';

const toArabicNumerals = (n: number | string, isRTL: boolean): string => {
  if (!isRTL) return n.toString();
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(c => d[parseInt(c)] ?? c).join('');
};

export const DhikrHeader = memo(function DhikrHeader() {
  const { isRTL } = useTranslation();
  const currentDhikr = useTasbeehStore(state => state.currentDhikr);
  const showTransliteration = useTasbeehStore(state => state.showTransliteration);
  const sessionMode = useTasbeehStore(state => state.sessionMode);
  const currentCount = useTasbeehStore(state => state.currentCount);
  const dhikrFontSize = useTasbeehStore(state => state.dhikrFontSize || 1);

  const totalProgress = (() => {
    if (sessionMode.type === 'tasbih100') {
      const completed = sessionMode.phaseCounts.slice(0, sessionMode.currentPhase).reduce((a, b) => a + b, 0);
      return ((completed + currentCount) / 100) * 100;
    }
    if (sessionMode.type === 'tasbih1000') {
      const completed = [0, 333, 666, 999][sessionMode.currentPhase] || 0;
      return ((completed + currentCount) / 1000) * 100;
    }
    return null;
  })();

  const handleRecite = () => {
    if (currentDhikr.arabic) {
      speakArabic(currentDhikr.arabic);
    }
  };

  return (
    <div className="text-center px-4 relative z-20 flex flex-col items-center gap-1">
      {/* Decorative top line */}
      <div className="flex items-center gap-3 mb-1 opacity-40">
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
        <span className="text-primary text-[10px] tracking-[0.3em] uppercase font-light">ذِكْر</span>
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/60" />
      </div>

      {/* Arabic Text */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={currentDhikr.id}
          initial={{ opacity: 0, scale: 0.9, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: 6 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={handleRecite}
          className="font-arabic leading-relaxed cursor-pointer hover:opacity-85 select-none active:scale-95 transition-transform"
          style={{
            color: 'hsl(var(--counter-text))',
            textShadow: '0 0 30px hsl(var(--counter-glow) / 0.3), 0 2px 8px rgba(0,0,0,0.4)',
            fontWeight: 400,
            fontSize: `calc(${dhikrFontSize} * 2.2rem)`,
          }}
        >
          {currentDhikr.arabic}
        </motion.p>
      </AnimatePresence>

      {/* Transliteration */}
      <AnimatePresence mode="wait">
        {showTransliteration && (
          <motion.p
            key={currentDhikr.transliteration}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleRecite}
            className="text-primary/50 tracking-wide italic font-light cursor-pointer hover:text-primary transition-colors"
            style={{
              fontSize: `calc(${dhikrFontSize} * 0.85rem)`,
            }}
          >
            {currentDhikr.transliteration}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Phase indicator for tasbih100 */}
      {/* Phase indicator for tasbih100 */}
      {sessionMode.type === 'tasbih100' && (
        <div className="flex flex-col items-center mt-1.5 gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-medium backdrop-blur-sm shadow-sm">
            <div className="flex justify-center gap-1">
              {[0, 1, 2, 3].map((phase) => (
                <div
                  key={phase}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    phase < sessionMode.currentPhase
                      ? 'w-2.5 bg-primary'
                      : phase === sessionMode.currentPhase
                      ? 'w-4 bg-primary shadow-[0_0_8px_hsl(var(--primary))]'
                      : 'w-1.5 bg-primary/20'
                  }`}
                />
              ))}
            </div>
            <span className="opacity-30">•</span>
            <span>Phase {sessionMode.currentPhase + 1} / 4</span>
            <span className="opacity-30">•</span>
            <span className="font-semibold">{sessionMode.currentPhase === 3 ? '1' : '33'} dhikr</span>
          </div>
          {totalProgress !== null && (
            <div
              className="w-36 h-1 backdrop-blur-sm rounded-full overflow-hidden"
              style={{
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                border: '1px solid hsl(var(--primary) / 0.2)'
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--bead-filled-end, #92400e), var(--bead-filled-mid, #d97706), var(--bead-filled-start, #fde68a))',
                  boxShadow: '0 0 4px hsl(var(--primary) / 0.6)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      )}

      {/* Phase indicator for tasbih1000 */}
      {sessionMode.type === 'tasbih1000' && (
        <div className="flex flex-col items-center mt-1.5 gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-medium backdrop-blur-sm shadow-sm">
            <span>
              {isRTL
                ? `المجموعة ${toArabicNumerals(sessionMode.currentPhase + 1, isRTL)} / ${toArabicNumerals(4, isRTL)}`
                : `Set ${sessionMode.currentPhase + 1} / 4`
              }
            </span>
            <span className="opacity-30">•</span>
            <span className="font-bold font-mono">
              {toArabicNumerals(Math.floor(([0, 333, 666, 999][sessionMode.currentPhase] || 0) + currentCount), isRTL)} / {toArabicNumerals(1000, isRTL)}
            </span>
          </div>
          {totalProgress !== null && (
            <div
              className="w-44 h-1 backdrop-blur-sm rounded-full overflow-hidden"
              style={{
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                border: '1px solid hsl(var(--primary) / 0.2)'
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--bead-filled-end, #92400e), var(--bead-filled-mid, #d97706), var(--bead-filled-start, #fde68a))',
                  boxShadow: '0 0 4px hsl(var(--primary) / 0.6)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      )}

      {/* Routine indicator */}
      {sessionMode.type === 'routine' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-medium backdrop-blur-sm"
        >
          <span>
            {isRTL
              ? `الخطوة ${toArabicNumerals(sessionMode.currentStepIndex + 1, isRTL)} من ${toArabicNumerals(sessionMode.steps.length, isRTL)}`
              : `Step ${sessionMode.currentStepIndex + 1} of ${sessionMode.steps.length}`
            }
          </span>
          {sessionMode.steps[sessionMode.currentStepIndex].description && (
            <>
              <span className="opacity-30">•</span>
              <span className="text-foreground/80">{sessionMode.steps[sessionMode.currentStepIndex].description}</span>
            </>
          )}
        </motion.div>
      )}

      {/* Salatul Tasbeeh indicator */}
      {sessionMode.type === 'salatul-tasbeeh' && (
        <div className="flex flex-col items-center mt-1.5 gap-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((rakah) => (
                <div
                  key={rakah}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    rakah < sessionMode.rakah
                      ? 'w-2 bg-emerald-400'
                      : rakah === sessionMode.rakah
                      ? 'w-4 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : 'w-1.5 bg-emerald-400/20'
                  }`}
                />
              ))}
            </div>
            <span className="opacity-30">•</span>
            <span className="font-semibold">Rak'ah {sessionMode.rakah}/4</span>
            <span className="opacity-30">•</span>
            <span className="text-foreground/90 font-medium">{['Qiyam', 'Ruku', "I'tidal", 'Sujud', 'Jalsah'][sessionMode.phase]}</span>
            <span className="opacity-30">•</span>
            <span className="font-bold font-mono text-emerald-300 px-1.5 py-0.5 rounded-md bg-emerald-500/20">{currentCount}/10</span>
          </div>
        </div>
      )}
    </div>

  );
});
