import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { ProgressRing } from './ProgressRing';
import { SoundManager } from '@/lib/sound';

export function Counter() {
  const {
    currentCount,
    targetCount,
    currentDhikr,
    showTransliteration,
    sessionMode,
    increment,
    exitSessionMode,
    soundEnabled,
  } = useTasbeehStore();

  const [showCompletion, setShowCompletion] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const lastCompletionRef = useRef<number>(0);

  // Calculate progress based on mode
  const getProgress = () => {
    if (sessionMode.type === 'tasbih100') {
      const phaseTargets = [33, 33, 33, 1];
      const currentTarget = phaseTargets[sessionMode.currentPhase];
      return Math.min(currentCount / currentTarget, 1);
    }
    return targetCount > 0 ? Math.min(currentCount / targetCount, 1) : 0;
  };

  const getCurrentTarget = () => {
    if (sessionMode.type === 'tasbih100') {
      return [33, 33, 33, 1][sessionMode.currentPhase];
    }
    return targetCount;
  };

  const getTotalSessionProgress = () => {
    if (sessionMode.type !== 'tasbih100') return null;
    const completed = sessionMode.phaseCounts.slice(0, sessionMode.currentPhase).reduce((a, b) => a + b, 0);
    const total = 100;
    return ((completed + currentCount) / total) * 100;
  };

  const handleTap = useCallback(() => {
    if (sessionMode.isComplete) return;

    increment();

    // Play detailed click sound
    if (soundEnabled) {
      SoundManager.playClick();
    }

    // Check for phase/target completion
    const currentTarget = getCurrentTarget();
    const completionMilestone = Math.floor((currentCount + 1) / currentTarget);

    if ((currentCount + 1) % currentTarget === 0 && completionMilestone > lastCompletionRef.current) {
      lastCompletionRef.current = completionMilestone;
      setShowCompletion(true);

      // Play completion sound
      if (soundEnabled) {
        SoundManager.playCompletion();
      }

      setTimeout(() => setShowCompletion(false), 1500);
    }

    // Check for 100 session complete
    if (sessionMode.type === 'tasbih100' && sessionMode.currentPhase === 3 && currentCount + 1 >= 1) {
      setTimeout(() => {
        setShowSessionComplete(true);
      }, 500);
    }
  }, [increment, currentCount, sessionMode]);

  const handleDismissSessionComplete = () => {
    setShowSessionComplete(false);
    exitSessionMode();
  };

  const progress = getProgress();
  const totalProgress = getTotalSessionProgress();

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 relative">
      {/* Session mode indicator */}
      <AnimatePresence>
        {sessionMode.type === 'tasbih100' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-0 right-0"
          >
            <div className="flex justify-center gap-2 mb-2">
              {[0, 1, 2, 3].map((phase) => (
                <div
                  key={phase}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${phase < sessionMode.currentPhase
                    ? 'bg-primary'
                    : phase === sessionMode.currentPhase
                      ? 'bg-primary animate-pulse'
                      : 'bg-muted'
                    }`}
                />
              ))}
            </div>
            {totalProgress !== null && (
              <div className="w-48 mx-auto h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dhikr text */}
      <div className="text-center mb-8 animate-fade-in-up pt-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentDhikr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-arabic text-4xl md:text-5xl text-foreground leading-relaxed mb-3"
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
              className="text-muted-foreground text-base tracking-wide"
            >
              {currentDhikr.transliteration}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Phase indicator for 100 session */}
        {sessionMode.type === 'tasbih100' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-primary mt-2"
          >
            Phase {sessionMode.currentPhase + 1} of 4 • {sessionMode.currentPhase === 3 ? '1' : '33'} counts
          </motion.p>
        )}
      </div>

      {/* Counter with progress ring */}
      <div className="relative">
        <ProgressRing
          progress={progress}
          size={280}
          strokeWidth={4}
        />

        {/* Counter button */}
        <motion.button
          onClick={handleTap}
          disabled={sessionMode.isComplete}
          className={`
            absolute inset-4
            rounded-full 
            bg-counter-bg
            flex items-center justify-center
            cursor-pointer
            select-none
            touch-manipulation
            transition-shadow duration-300
            disabled:opacity-50
            ${showCompletion ? 'animate-completion' : 'counter-glow'}
          `}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          aria-label="Increment counter"
        >
          <div className="absolute inset-3 rounded-full border border-border/50" />

          <motion.span
            key={currentCount}
            initial={{ scale: 1.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="counter-number text-6xl md:text-7xl text-counter-text"
          >
            {currentCount}
          </motion.span>
        </motion.button>
      </div>

      {/* Target indicator */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {currentCount} / {getCurrentTarget()}
        </p>

        <AnimatePresence>
          {showCompletion && !sessionMode.isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3"
            >
              <p className="text-primary text-sm font-medium">
                {sessionMode.type === 'tasbih100' && sessionMode.currentPhase < 3
                  ? '✓ Phase complete'
                  : '✓ Set complete'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Complete Modal */}
      <AnimatePresence>
        {showSessionComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={handleDismissSessionComplete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-4xl">✨</span>
              </motion.div>

              <h2 className="text-2xl font-medium text-foreground mb-2">
                ما شاء الله
              </h2>
              <p className="text-lg text-foreground mb-1 font-arabic">
                Session Complete
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                You have completed 100 dhikr
                <br />
                <span className="text-xs">33 + 33 + 33 + 1</span>
              </p>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {defaultDhikrs.slice(0, 4).map((d, i) => (
                  <div key={d.id} className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs text-primary">✓</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{i === 3 ? '1' : '33'}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleDismissSessionComplete}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                Alhamdulillah
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
