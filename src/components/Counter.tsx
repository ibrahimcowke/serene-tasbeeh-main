import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { ProgressRing } from './ProgressRing';
import { HadithSlider } from './HadithSlider';
import { SoundManager } from '@/lib/sound';
import { CounterVisuals } from './CounterVisuals';
import { Settings, Palette, Grid } from 'lucide-react';
import { SettingsView } from './SettingsView';
import { SessionTimer } from './SessionTimer';
import { UndoButton } from './UndoButton';
import { initShakeDetection, isShakeDetectionSupported } from '@/lib/shakeDetection';
import { requestWakeLock, releaseWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { initVolumeButtonListener } from '@/lib/volumeButtons';
import { themes, counterShapes } from '@/lib/constants';
import { toast } from 'sonner';

export function Counter() {
  const {
    currentCount,
    targetCount,
    zenMode,
    currentDhikr: stateCurrentDhikr,
    showTransliteration,
    sessionMode,
    theme,
    themeSettings,
    counterShape = 'plain',
    dhikrVerticalOffset = 0,
    counterVerticalOffset = 0,
    counterScale = 1,
    countFontSize = 1,
    shakeToReset,
    wakeLockEnabled,
    volumeButtonCounting,
    reset,
    increment,
    decrement,
  } = useTasbeehStore();

  // Ensure we have the latest data (e.g. hadiths) even if state is persisted
  const currentDhikr = defaultDhikrs.find(d => d.id === stateCurrentDhikr.id) || stateCurrentDhikr;

  const currentSettings = themeSettings?.[theme] || {
    hapticEnabled: true,
    soundEnabled: false,
    vibrationIntensity: 'medium',
    fontScale: 1,
    soundType: 'click'
  };

  const [showCompletion, setShowCompletion] = useState(false);
  const lastCompletionRef = useRef<number>(0);

  // Calculate progress based on mode
  const getProgress = () => {
    if (sessionMode.type === 'tasbih100') {
      const phaseTargets = [33, 33, 33, 1];
      const currentTarget = phaseTargets[sessionMode.currentPhase];
      return Math.min(currentCount / currentTarget, 1);
    }
    if (sessionMode.type === 'tasbih1000') {
      return Math.min(currentCount / 125, 1);
    }
    return targetCount > 0 ? Math.min(currentCount / targetCount, 1) : 0;
  };

  const getCurrentTarget = () => {
    if (sessionMode.type === 'tasbih100') {
      return [33, 33, 33, 1][sessionMode.currentPhase];
    }
    if (sessionMode.type === 'tasbih1000') {
      return 125;
    }
    return targetCount;
  };

  const getTotalSessionProgress = () => {
    if (sessionMode.type === 'tasbih100') {
      const completed = sessionMode.phaseCounts.slice(0, sessionMode.currentPhase).reduce((a, b) => a + b, 0);
      const total = 100;
      return ((completed + currentCount) / total) * 100;
    }
    if (sessionMode.type === 'tasbih1000') {
      const completed = sessionMode.currentPhase * 125;
      return ((completed + currentCount) / 1000) * 100;
    }
    return null;
  };


  const renderDhikrText = () => {
    // if (dhikrTextPosition === 'hidden') return null;
    return (
      <div className="text-center mt-6 mb-4 px-3 sm:px-0 relative z-20"
        style={{ transform: `translateY(${dhikrVerticalOffset}px)` }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentDhikr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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

              {/* Step Progress Bar */}
              <div className="w-32 xs:w-40 sm:w-48 mx-auto h-1 bg-muted rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentCount / targetCount) * 100, 100)}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    )
  };
  const handleTap = useCallback(() => {
    if (sessionMode.type === 'tasbih100' && sessionMode.isComplete) return;

    increment();

    // Play detailed click sound
    if (currentSettings.soundEnabled) {
      SoundManager.playClick(currentSettings.soundType as 'click' | 'soft' | 'water');
    }

    // Check for phase/target completion
    const currentTarget = getCurrentTarget();

    if (currentTarget > 0) {
      const completionMilestone = Math.floor((currentCount + 1) / currentTarget);

      if ((currentCount + 1) % currentTarget === 0 && completionMilestone > lastCompletionRef.current) {
        lastCompletionRef.current = completionMilestone;

        // Play completion sound
        if (currentSettings.soundEnabled) {
          SoundManager.playCompletion();
        }
      }
    }

    // Session complete pop-ups disabled




  }, [increment, currentCount, sessionMode, currentSettings]);

  // Shake to reset functionality
  useEffect(() => {
    if (!shakeToReset || !isShakeDetectionSupported()) return;

    const cleanup = initShakeDetection(() => {
      if (currentCount > 0) {
        if (window.confirm('Reset counter by shaking?')) {
          reset();
        }
      }
    });

    return cleanup;
  }, [shakeToReset, currentCount, reset]);

  // Screen Wake Lock
  useEffect(() => {
    if (!wakeLockEnabled || !isWakeLockSupported()) {
      releaseWakeLock();
      return;
    }

    // Request wake lock when session is active (count > 0 or in specific mode)
    const shouldHaveWakeLock = currentCount > 0 || sessionMode.type !== 'free';
    
    if (shouldHaveWakeLock) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [wakeLockEnabled, currentCount, sessionMode.type]);

  // Volume Button Counting
  useEffect(() => {
    if (!volumeButtonCounting) return;

    const cleanup = initVolumeButtonListener((direction) => {
      if (direction === 'up') {
        increment();
      } else if (direction === 'down') {
        decrement();
      }
    });

    return cleanup;
  }, [volumeButtonCounting, increment, decrement]);

  const [pullProgress, setPullProgress] = useState(0);
  const resetThreshold = 100; // pixels to pull down for reset

  const progress = getProgress();
  const totalProgress = getTotalSessionProgress();

  const currentShapeData = counterShapes.find(s => s.id === counterShape);
  const shapeBg = currentShapeData?.bg || 'transparent';
  const shapeColor = currentShapeData?.color || 'currentColor';

  const renderSection = (id: string) => {
    switch (id) {
      case 'dhikr':
        return renderDhikrText();
      case 'counter':
        return (
          <div 
            className="flex flex-col items-center justify-center w-full relative z-10 my-0.5 select-none rounded-[40px] transition-all duration-700 p-4 xs:p-8"
            style={{ backgroundColor: shapeBg }}
          >
            {/* Pull-to-Reset Wrapper */}
            <motion.div 
              drag="y"
              dragConstraints={{ top: 0, bottom: resetThreshold + 50 }}
              dragElastic={0.2}
              onDrag={(e, info) => {
                const progress = Math.min(info.offset.y / resetThreshold, 1);
                setPullProgress(progress);
              }}
              onDragEnd={(e, info) => {
                if (info.offset.y > resetThreshold && currentCount > 0) {
                  if (window.confirm('Reset counter?')) {
                    reset();
                    toast.success('Counter reset', { icon: '🔄' });
                  }
                }
                setPullProgress(0);
              }}
              className="relative w-full flex flex-col items-center"
            >
              {/* Pull Indicator */}
              <AnimatePresence>
                {pullProgress > 0.1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: pullProgress, y: 10 + (pullProgress * 10) }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute -top-12 flex flex-col items-center gap-1 z-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                      <motion.svg 
                        animate={{ rotate: pullProgress * 360 }}
                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"
                      >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" />
                      </motion.svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-primary/60">
                      {pullProgress >= 1 ? 'Release to Reset' : 'Pull to Reset'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
 
              <div className="relative transition-all duration-300 transform-none select-none"
                style={{ 
                  filter: pullProgress > 0 ? `blur(${pullProgress * 4}px)` : 'none',
                  opacity: 1 - (pullProgress * 0.3)
                }}
              >
                <CounterVisuals
                  counterShape={counterShape}
                  counterVerticalOffset={counterVerticalOffset}
                  counterScale={counterScale}
                  progress={progress}
                  currentCount={currentCount}
                  currentSettings={currentSettings}
                  handleTap={handleTap}
                  showCompletion={showCompletion}
                  countFontSize={countFontSize}
                  disabled={sessionMode.type === 'tasbih100' && sessionMode.isComplete}
                />
              </div>
            </motion.div>
 
            {/* Main Controls - Unified below the counter */}
            {!zenMode && (
              <div className={`flex items-center justify-center gap-2 xs:gap-6 sm:gap-8 mt-2 xs:mt-5 sm:mt-6 relative z-20 transition-opacity duration-300`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    useTasbeehStore.getState().decrement();
                  }}
                  disabled={currentCount === 0}
                  className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors border border-white/5"
                  title="Decrement"
                  style={{ color: shapeColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                </motion.button>
 
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Reset counter?')) {
                      useTasbeehStore.getState().reset();
                    }
                  }}
                  disabled={currentCount === 0}
                  className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors border border-white/5"
                  title="Reset"
                  style={{ color: shapeColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                </motion.button>
 
                <SettingsView defaultTab="appearance">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors border border-white/5"
                    title="Settings"
                    style={{ color: shapeColor }}
                  >
                    <Settings className="w-5 h-5 xs:w-6 xs:h-6" />
                  </motion.button>
                </SettingsView>

                <UndoButton />
              </div>
            )}
          </div>
        );
      case 'stats':
        return (
          <div className="mt-0 sm:mt-1 text-center transition-opacity duration-300">
            <p className="text-xs xs:text-sm text-muted-foreground">
              {currentCount} / {getCurrentTarget() > 0 ? getCurrentTarget() : '∞'}
            </p>

            <AnimatePresence>
              {showCompletion && !(sessionMode.type === 'tasbih100' && sessionMode.isComplete) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3"
                >
                  <p className="text-primary text-sm font-medium">
                    {sessionMode.type === 'tasbih100' && sessionMode.currentPhase < 3
                      ? '✓ Phase complete'
                      : sessionMode.type === 'tasbih1000' && sessionMode.currentPhase < 9
                        ? '✓ Set complete'
                        : '✓ Set complete'
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'hadith':
        return (
          <div className="w-full flex justify-center mt-2 mb-6">
            <HadithSlider dhikr={currentDhikr} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden py-4 sm:py-8">
      {/* Top Section: Dhikr */}
      <div className="w-full flex justify-center items-end min-h-[20%] max-h-[30%]">
        {renderSection('dhikr')}
      </div>

      {/* Center Section: Counter - This stays visually fixed */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto z-10 flex-1">
        <div className="flex flex-col items-center w-full">
          {renderSection('counter')}
        </div>
      </div>

      {/* Bottom Section: Hadith & Stats */}
      <div className="w-full flex flex-col items-center justify-start min-h-[20%] max-h-[30%] overflow-hidden">
        {renderSection('hadith')}
        {renderSection('stats')}
      </div>
    </div>
  );
}
