import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { ProgressRing } from './ProgressRing';
import { HadithSlider } from './HadithSlider';
import { SoundManager } from '@/lib/sound';
import { CounterVisuals } from './CounterVisuals';
import { Palette } from 'lucide-react';
import { GlobalStats } from './GlobalStats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionTimer } from './SessionTimer';
import { UndoButton } from './UndoButton';
import { initShakeDetection, isShakeDetectionSupported } from '@/lib/shakeDetection';

export function Counter() {
  const {
    currentCount,
    targetCount,
    currentDhikr: stateCurrentDhikr,
    showTransliteration,
    sessionMode,
    increment,
    exitSessionMode,
    theme,
    themeSettings,
    layout = 'default',
    counterShape = 'plain', // Default to plain if undefined in persisted state
    hadithSlidePosition = 'right',
    verticalOffset = 0,
    dhikrVerticalOffset = 0,
    counterVerticalOffset = 0,
    counterScale = 1,
    countFontSize = 1,
    dhikrTextPosition = 'below-counter',
    layoutOrder,
    setLayoutOrder,
    shakeToReset,
    reset,
    nextRoutineStep,
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
  const [isEditingLayout, setIsEditingLayout] = useState(false);
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
      <div className="text-center mt-0 mb-1 px-3 sm:px-0 relative z-20"
        style={{ transform: `translateY(${dhikrVerticalOffset}px)` }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentDhikr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-arabic text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground leading-snug mb-0 max-w-[90vw] mx-auto overflow-visible"
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

  const progress = getProgress();
  const totalProgress = getTotalSessionProgress();

  const renderSection = (id: string) => {
    switch (id) {
      case 'dhikr':
        return renderDhikrText();
      case 'counter':
        return (
          <div className="flex flex-col items-center justify-center w-full relative z-10 my-0.5 select-none">
            <div className={`transition-opacity duration-300 ${isEditingLayout ? 'pointer-events-none opacity-50' : ''}`}>
              <CounterVisuals
                layout={layout}
                counterShape={counterShape}
                counterVerticalOffset={counterVerticalOffset}
                counterScale={counterScale}
                progress={progress}
                currentCount={currentCount}
                currentSettings={currentSettings}
                countFontSize={countFontSize}
                handleTap={handleTap}
                showCompletion={showCompletion}
                disabled={sessionMode.type === 'tasbih100' && sessionMode.isComplete}
              />
            </div>

            {/* Mobile controls (Minus & Reset) moved below counter */}
            <div className={`flex items-center justify-center gap-3 xs:gap-6 sm:gap-8 mt-4 xs:mt-5 sm:mt-6 lg:hidden relative z-20 transition-opacity duration-300 ${isEditingLayout ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  useTasbeehStore.getState().decrement();
                }}
                disabled={currentCount === 0}
                className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors border border-white/5"
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
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
              </motion.button>

              <UndoButton />

              {/* Theme & Shape selectors moved inline from absolute position */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors border border-white/5"
                    title="Change Theme"
                  >
                    <Palette className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-48 bg-card/90 backdrop-blur-xl border-border/50 max-h-[40dvh] overflow-hidden flex flex-col">
                  <DropdownMenuLabel>Theme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="overflow-y-auto custom-scrollbar p-1">
                    {[
                      { id: 'light', label: 'Light', icon: '☀️' },
                      { id: 'dark', label: 'Dark', icon: '🌙' },
                      { id: 'theme-midnight', label: 'Midnight', icon: '🌌' },
                      { id: 'theme-neon', label: 'Neon', icon: '🎆' },
                      { id: 'theme-green', label: 'Matrix', icon: '💻' },
                      { id: 'theme-cyberpunk', label: 'Cyberpunk', icon: '🤖' },
                      { id: 'theme-glass', label: 'Glass', icon: '🧊' },
                      { id: 'theme-sunset', label: 'Sunset', icon: '🌅' },
                      { id: 'theme-forest', label: 'Forest', icon: '🌲' },
                    ].map((t) => (
                      <DropdownMenuItem
                        key={t.id}
                        onClick={() => useTasbeehStore.getState().setTheme(t.id as any)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-base">{t.icon}</span>
                        <span className={`flex-1 ${theme === t.id ? 'font-bold text-primary' : ''}`}>{t.label}</span>
                        {theme === t.id && <span className="text-primary text-xs">●</span>}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            {/* Routine Next Step Button Removed */}
          </div>
        );
      case 'stats':
        return (
          <div className={`mt-0 sm:mt-1 text-center transition-opacity duration-300 ${layout === 'focus' ? 'opacity-50 hover:opacity-100' : ''}`}>
            {/* SessionTimer removed */}
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
    <>
      <div className={`flex flex-col items-center flex-1 px-4 sm:px-6 md:px-8 lg:px-12 relative w-full min-h-full transition-all duration-500 py-1
      ${layout === 'ergonomic' ? 'justify-end pb-8' : ''}
    `}
        style={{ transform: `translateY(${verticalOffset}px)` }}
      >

        <button
          onClick={() => setIsEditingLayout(!isEditingLayout)}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isEditingLayout ? 'bg-primary text-primary-foreground shadow-lg scale-110' : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'}`}
          title="Edit Layout"
        >
          {isEditingLayout ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          )}
        </button>

        <AnimatePresence>
          {/* Session mode indicators moved to renderDhikrText to be grouped with Dhikr text */}
        </AnimatePresence>

        <div className={`relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto z-10 ${layout !== 'ergonomic' ? 'my-auto' : ''}`}>

          <Reorder.Group axis="y" values={layoutOrder || ['dhikr', 'counter']} onReorder={setLayoutOrder} className="flex flex-col items-center w-full">
            {(layoutOrder || ['dhikr', 'counter']).map(item => (
              <Reorder.Item key={item} value={item} dragListener={isEditingLayout} className={`w-full flex justify-center touch-none ${isEditingLayout ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/30 rounded-xl p-4 my-2 hover:bg-primary/5 relative bg-background/50 backdrop-blur-sm' : ''}`}>
                {isEditingLayout && (
                  <div className="absolute top-2 right-2 text-muted-foreground pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M5.5 3C5.5 3.55228 5.05228 4 4.5 4C3.94772 4 3.5 3.55228 3.5 3C3.5 2.44772 3.94772 2 4.5 2C5.05228 2 5.5 2.44772 5.5 3ZM8.5 3C8.5 3.55228 8.05228 4 7.5 4C6.94772 4 6.5 3.55228 6.5 3C6.5 2.44772 6.94772 2 7.5 2C8.05228 2 8.5 2.44772 8.5 3ZM11.5 3C11.5 3.55228 11.0523 4 10.5 4C9.94772 4 9.5 3.55228 9.5 3C9.5 2.44772 9.94772 2 10.5 2C11.0523 2 11.5 2.44772 11.5 3ZM5.5 7.5C5.5 8.05228 5.05228 8.5 4.5 8.5C3.94772 8.5 3.5 8.05228 3.5 7.5C3.5 6.94772 3.94772 6.5 4.5 6.5C5.05228 6.5 5.5 6.94772 5.5 7.5ZM8.5 7.5C8.5 8.05228 8.05228 8.5 7.5 8.5C6.94772 8.5 6.5 8.05228 6.5 7.5C6.5 6.94772 6.94772 6.5 7.5 6.5C8.05228 6.5 8.5 6.94772 8.5 7.5ZM11.5 7.5C11.5 8.05228 11.0523 8.5 10.5 8.5C9.94772 8.5 9.5 8.05228 9.5 7.5C9.5 6.94772 9.94772 6.5 10.5 6.5C11.0523 6.5 11.5 6.94772 11.5 7.5ZM5.5 12C5.5 12.5523 5.05228 13 4.5 13C3.94772 13 3.5 12.5523 3.5 12C3.5 11.4477 3.94772 11 4.5 11C5.05228 11 5.5 11.4477 5.5 12ZM8.5 12C8.5 12.5523 8.05228 13 7.5 13C6.94772 13 6.5 12.5523 6.5 12C6.5 11.4477 6.94772 11 7.5 11C8.05228 11 8.5 11.4477 8.5 12ZM11.5 12C11.5 12.5523 11.0523 13 10.5 13C9.94772 13 9.5 12.5523 9.5 12C9.5 11.4477 9.94772 11 10.5 11C11.0523 11 11.5 11.4477 11.5 12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </div>
                )}
                {renderSection(item)}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

      </div>

      <AnimatePresence>
      </AnimatePresence>
    </>
  );
}
