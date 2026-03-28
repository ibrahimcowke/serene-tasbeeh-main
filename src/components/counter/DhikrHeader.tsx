import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';

export const DhikrHeader = memo(function DhikrHeader() {
  const currentDhikrId = useTasbeehStore(state => state.currentDhikr.id);
  const showTransliteration = useTasbeehStore(state => state.showTransliteration);
  const dhikrVerticalOffset = useTasbeehStore(state => state.dhikrVerticalOffset);
  const sessionMode = useTasbeehStore(state => state.sessionMode);
  const currentCount = useTasbeehStore(state => state.currentCount);
  
  // Get latest dhikr data
  const currentDhikr = defaultDhikrs.find(d => d.id === currentDhikrId) || { id: currentDhikrId, arabic: '', transliteration: '', translation: '' };

  const totalProgress = (() => {
    if (sessionMode.type === 'tasbih100') {
      const completed = sessionMode.phaseCounts.slice(0, sessionMode.currentPhase).reduce((a, b) => a + b, 0);
      return ((completed + currentCount) / 100) * 100;
    }
    if (sessionMode.type === 'tasbih1000') {
      const completed = sessionMode.currentPhase * 125;
      return ((completed + currentCount) / 1000) * 100;
    }
    return null;
  })();

  return (
    <div className="text-center mt-6 mb-4 px-3 sm:px-0 relative z-20"
      style={{ transform: `translateY(${dhikrVerticalOffset}px)` }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={currentDhikr.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="font-arabic text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground leading-snug mb-0 max-w-[95vw] mx-auto overflow-visible select-none"
        >
          {currentDhikr.arabic}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showTransliteration && (
          <motion.p
            key={currentDhikr.transliteration}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground text-[9px] xs:text-[10px] sm:text-sm tracking-wide px-4"
          >
            {currentDhikr.transliteration}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Phase indicator & Progress for 100 session */}
      {sessionMode.type === 'tasbih100' && (
        <div className="flex flex-col items-center mt-1.5 sm:mt-4 mb-0.5">
          <div className="flex justify-center gap-1.5 mb-1.5">
            {[0, 1, 2, 3].map((phase) => (
              <div
                key={phase}
                className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${phase < sessionMode.currentPhase
                  ? 'bg-primary'
                  : phase === sessionMode.currentPhase
                    ? 'bg-primary animate-pulse scale-125'
                    : 'bg-muted'
                  }`}
              />
            ))}
          </div>
          {totalProgress !== null && (
            <div className="w-24 xs:w-40 sm:w-48 mx-auto h-1 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] xs:text-xs text-muted-foreground"
          >
            Phase {sessionMode.currentPhase + 1}/4 • {sessionMode.currentPhase === 3 ? '1' : '33'} Dhikr
          </motion.p>
        </div>
      )}

      {/* Phase indicator & Progress for 1000 session */}
      {sessionMode.type === 'tasbih1000' && (
        <div className="flex flex-col items-center mt-1.5 sm:mt-4 mb-0.5">
          {totalProgress !== null && (
            <div className="w-32 xs:w-40 sm:w-48 mx-auto h-1 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] xs:text-xs text-muted-foreground text-center"
          >
            Set {sessionMode.currentPhase + 1} of 8 • {Math.floor((sessionMode.currentPhase * 125) + currentCount)}/1000
          </motion.p>
        </div>
      )}

      {/* Routine Progress */}
      {sessionMode.type === 'routine' && (
        <div className="flex flex-col items-center mt-1.5 sm:mt-4 mb-0.5">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <span>Step {sessionMode.currentStepIndex + 1} of {sessionMode.steps.length}</span>
              {sessionMode.steps[sessionMode.currentStepIndex].description && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="text-muted-foreground">{sessionMode.steps[sessionMode.currentStepIndex].description}</span>
                </>
              )}
            </div>

            {/* Step Progress Bar - Logic for targetCount needed or passed as prop */}
            {/* For optimization, better to move targetCount into store selector inside this component or pass it */}
          </motion.div>
        </div>
      )}
    </div>
  );
});
