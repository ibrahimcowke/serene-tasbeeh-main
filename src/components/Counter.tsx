import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { ProgressRing } from './ProgressRing';
import { HadithSlider } from './HadithSlider';
import { SoundManager } from '@/lib/sound';

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
    counterShape = 'minimal', // Default to minimal if undefined in persisted state
    hadithSlidePosition = 'right',
    verticalOffset = 0,
    dhikrVerticalOffset = 0,
    counterVerticalOffset = 0,
    counterScale = 1,
    countFontSize = 1,
    dhikrTextPosition = 'below-counter',
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
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const lastCompletionRef = useRef<number>(0);

  // Calculate progress based on mode
  const getProgress = () => {
    if (sessionMode.type === 'tasbih100') {
      const phaseTargets = [33, 33, 33, 1];
      const currentTarget = phaseTargets[sessionMode.currentPhase];
      return Math.min(currentCount / currentTarget, 1);
    }
    if (sessionMode.type === 'tasbih1000') {
      return Math.min(currentCount / 100, 1);
    }
    return targetCount > 0 ? Math.min(currentCount / targetCount, 1) : 0;
  };

  const getCurrentTarget = () => {
    if (sessionMode.type === 'tasbih100') {
      return [33, 33, 33, 1][sessionMode.currentPhase];
    }
    if (sessionMode.type === 'tasbih1000') {
      return 100;
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
      const completed = sessionMode.currentPhase * 100;
      return ((completed + currentCount) / 1000) * 100;
    }
    return null;
  };


  const renderDhikrText = () => {
    if (dhikrTextPosition === 'hidden') return null;
    return (
      <div className="text-center mt-1 xs:mt-3 sm:mt-6 mb-2 sm:mb-4 px-3 sm:px-0 relative z-20"
        style={{ transform: `translateY(${dhikrVerticalOffset}px)` }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentDhikr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-arabic text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-foreground leading-relaxed mb-1 sm:mb-2"
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
              className="text-muted-foreground text-xs xs:text-sm sm:text-base tracking-wide"
            >
              {currentDhikr.transliteration}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Phase indicator & Progress for 100 session */}
        {sessionMode.type === 'tasbih100' && (
          <div className="flex flex-col items-center mt-3 sm:mt-4 mb-1">
            <div className="flex justify-center gap-2 mb-2">
              {[0, 1, 2, 3].map((phase) => (
                <div
                  key={phase}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${phase < sessionMode.currentPhase
                    ? 'bg-primary'
                    : phase === sessionMode.currentPhase
                      ? 'bg-primary animate-pulse scale-125'
                      : 'bg-muted'
                    }`}
                />
              ))}
            </div>
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
              className="text-[10px] xs:text-xs text-muted-foreground"
            >
              Phase {sessionMode.currentPhase + 1} of 4 • {sessionMode.currentPhase === 3 ? '1' : '33'} counts
            </motion.p>
          </div>
        )}

        {/* Phase indicator & Progress for 1000 session */}
        {sessionMode.type === 'tasbih1000' && (
          <div className="flex flex-col items-center mt-3 sm:mt-4 mb-1">
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
              Set {sessionMode.currentPhase + 1} of 10 • {Math.floor((sessionMode.currentPhase * 100) + currentCount)}/1000
            </motion.p>
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
        setShowCompletion(true);

        // Play completion sound
        if (currentSettings.soundEnabled) {
          SoundManager.playCompletion();
        }

        setTimeout(() => setShowCompletion(false), 1500);
      }
    }

    // Check for 100 session complete
    if (sessionMode.type === 'tasbih100' && sessionMode.currentPhase === 3 && currentCount + 1 >= 1) {
      setTimeout(() => {
        setShowSessionComplete(true);
      }, 500);
    }

    // Check for 1000 session complete
    if (sessionMode.type === 'tasbih1000' && sessionMode.currentPhase === 9 && currentCount + 1 >= 100) {
      setTimeout(() => {
        setShowSessionComplete(true);
      }, 500);
    }
  }, [increment, currentCount, sessionMode, currentSettings]);

  const handleDismissSessionComplete = () => {
    setShowSessionComplete(false);
    exitSessionMode();
  };

  const progress = getProgress();
  const totalProgress = getTotalSessionProgress();

  return (
    <div className={`flex flex-col items-center flex-1 px-4 sm:px-6 md:px-8 lg:px-12 relative w-full min-h-full transition-all duration-500 py-6
      ${layout === 'ergonomic' ? 'justify-end pb-16' : ''}
    `}
      style={{ transform: `translateY(${verticalOffset}px)` }}
    >
      <AnimatePresence>
        {/* Session mode indicators moved to renderDhikrText to be grouped with Dhikr text */}
      </AnimatePresence>

      {/* Dhikr text removed from here - moved below counter */}

      {/* Main Content Area: Counter + Hadith Side Panel */}
      <div className={`relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto z-10 ${layout !== 'ergonomic' ? 'my-auto' : ''}`}>

        {/* Dhikr Text - Top Position */}
        {dhikrTextPosition === 'top' && renderDhikrText()}

        {/* Mobile controls (Minus & Reset) placed above counter */}
        <div className="flex items-center justify-center gap-4 xs:gap-6 sm:gap-8 mb-2 xs:mb-3 sm:mb-4 lg:hidden relative z-20">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // We need to access decrement from store, but it's not destructured. 
              // Let's rely on the store hook call at top of file.
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
        </div>

        {/* Dhikr Text - Above Counter Position */}
        {dhikrTextPosition === 'above-counter' && renderDhikrText()}

        {/* Counter visualization - Optimized for all mobile screens */}
        <motion.div
          layout
          className={`relative flex items-center justify-center
          ${layout === 'focus' ? 'scale-100 sm:scale-110' : ''}
          ${layout === 'ergonomic' ? 'scale-90 sm:scale-100 translate-y-2 sm:translate-y-4' : ''}
          w-[min(80vw,60vh)] h-[min(80vw,60vh)] sm:w-[300px] sm:h-[300px] max-w-[320px] max-h-[320px]
        `}
          style={{
            transform: `translateY(${counterVerticalOffset}px) scale(${counterScale})`
          }}
        >
          {/* Encircled BrogressBar - Wraps the counter button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {counterShape === 'classic' && (
              <svg width="100%" height="100%" viewBox="0 0 280 280" className="-rotate-90">
                <rect
                  x="10" y="10" width="260" height="260" rx="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/30"
                />
                <motion.rect
                  x="10" y="10" width="260" height="260" rx="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  pathLength="1"
                  strokeDasharray="1"
                  initial={{ strokeDashoffset: 1 }}
                  animate={{ strokeDashoffset: 1 - progress }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </svg>
            )}

            {counterShape === 'hexagon' && (
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                <path
                  d="M50 2 L95 28 V72 L50 98 L5 72 V28 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted/30"
                />
                <motion.path
                  d="M50 2 L95 28 V72 L50 98 L5 72 V28 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  pathLength="1"
                  strokeDasharray="1"
                  initial={{ strokeDashoffset: 1 }}
                  animate={{ strokeDashoffset: 1 - progress }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </svg>
            )}

            {['minimal', 'beads', 'flower', 'waveform', 'orb'].includes(counterShape) && (
              <svg width="100%" height="100%" viewBox="0 0 290 290" className="-rotate-90">
                <circle
                  cx="145"
                  cy="145"
                  r="140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/30"
                />
                <motion.circle
                  cx="145"
                  cy="145"
                  r="140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  strokeDasharray="880"
                  initial={{ strokeDashoffset: 880 }}
                  animate={{ strokeDashoffset: 880 - (880 * progress) }}
                  strokeLinecap="round"
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </svg>
            )}
          </div>

          {counterShape === 'minimal' && (
            <div className="absolute inset-4 rounded-full border border-border/50" />
          )}

          {counterShape === 'classic' && (
            <div className="absolute inset-x-0 -top-4 bottom-0 bg-secondary/30 rounded-3xl border-4 border-muted flex items-center justify-center -z-10 flex-col">
              {/* Decorative screws */}
              <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
            </div>
          )}

          {counterShape === 'beads' && (
            <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
              <svg className="w-[300px] h-[300px] -rotate-90">
                {/* Track Dots - subtle guide only */}
                <circle cx="150" cy="150" r="140" stroke="currentColor" fill="none" strokeWidth="2" className="text-muted/10" strokeDasharray="1 30" />
              </svg>
            </div>
          )}

          {counterShape === 'flower' && (
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              {/* Flower petals rotating */}
              <motion.div
                animate={{ rotate: currentCount * 10 }}
                className="w-[280px] h-[280px] relative opacity-20"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-24 h-24 bg-primary rounded-full origin-bottom-right"
                    style={{ transform: `rotate(${i * 45}deg) translate(-50%, -100%)` }}
                  />
                ))}
              </motion.div>
            </div>
          )}

          {counterShape === 'waveform' && (
            <div className="absolute inset-0 rounded-full overflow-hidden -z-10 border-4 border-muted/50">
              <div className="absolute inset-0 bg-secondary/30" />
              {/* Distinct Background Level */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-muted/20" />

              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-primary/40 text-primary"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(progress * 100, 5)}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              >
                {/* Glowing Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_15px_currentColor]" />
                <div className="absolute top-0 left-0 right-0 h-6 bg-primary/40 blur-md transform -translate-y-1/2" />
              </motion.div>
              {/* Crisp outline */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none" />
            </div>
          )}

          {counterShape === 'hexagon' && (
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              {/* Distinct Inner Hexagon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-48 h-48 bg-card/50 border-2 border-primary/20 clip-path-hexagon"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <motion.div
                    className="w-full h-full bg-primary/10"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          )}

          {counterShape === 'orb' && (
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-[260px] h-[260px] rounded-full bg-secondary/60 relative overflow-hidden shadow-2xl border-2 border-white/10">
                {/* Liquid Fill - Explicit height calculation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-primary shadow-[0_0_30px_inset_rgba(0,0,0,0.3)]"
                  initial={{ height: '0%' }}
                  animate={{ height: `${progress * 100}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                >
                  {/* Surface tension line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/50 shadow-[0_0_10px_white]" />
                </motion.div>

                {/* Glass Glare */}
                <div className="absolute top-6 left-10 right-10 h-32 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          )}

          {/* Counter button */}
          <motion.button
            onClick={handleTap}
            disabled={sessionMode.type === 'tasbih100' && sessionMode.isComplete}
            className={`
            ${counterShape === 'minimal' ? 'absolute inset-4 rounded-full bg-counter-bg' : ''}
            ${counterShape === 'classic' ? 'w-64 h-64 rounded-2xl bg-gradient-to-br from-card to-background shadow-inner flex flex-col items-center justify-center border-2 border-border/50' : ''}
            ${counterShape === 'beads' ? 'w-64 h-64 rounded-full bg-transparent flex items-center justify-center' : ''}
            ${counterShape === 'flower' ? 'w-64 h-64 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg' : ''}
            ${counterShape === 'waveform' ? 'w-72 h-72 rounded-full flex items-center justify-center backdrop-blur-sm' : ''}
            ${counterShape === 'hexagon' ? 'w-64 h-64 flex items-center justify-center bg-card/10 backdrop-blur-sm' : ''}
            ${counterShape === 'orb' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
            
            flex items-center justify-center
            cursor-pointer
            select-none
            touch-manipulation
            transition-shadow duration-300
            disabled:opacity-50
            ${showCompletion && counterShape === 'minimal' ? 'animate-completion' : ''}
            ${!showCompletion && counterShape === 'minimal' ? 'counter-glow' : ''}
            ${counterShape === 'beads' ? 'hover:scale-105 active:scale-95' : ''}
            ${counterShape === 'orb' ? 'shadow-2xl shadow-primary/20' : ''}
          `}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            aria-label="Increment counter"
          >
            {counterShape === 'minimal' && (
              <div className="absolute inset-3 rounded-full border border-border/50" />
            )}

            {counterShape === 'beads' && (
              // Visual beads ring - Static decoration only
              <div className="absolute inset-0 rounded-full">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="48%" stroke="currentColor" fill="none" strokeWidth="1" className="text-muted/20" />
                  <circle
                    cx="50%" cy="50%" r="48%"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="12"
                    className="text-primary/10"
                    strokeDasharray="1 15"
                  />
                </svg>
              </div>
            )}

            <motion.span
              key={currentCount}
              initial={{ scale: 1.5, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className={`
              counter-number text-counter-text
              ${counterShape === 'classic' ? 'font-mono text-5xl sm:text-6xl md:text-7xl tracking-widest bg-black/10 px-4 sm:px-6 py-2 rounded-lg inset-shadow mb-4' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'}
              ${counterShape === 'waveform' ? 'drop-shadow-md z-10' : ''}
              ${counterShape === 'orb' ? 'text-white mix-blend-overlay' : ''}
            `}
              style={{
                fontSize: `${(counterShape === 'classic' ? 4.5 : 4.5) * currentSettings.fontScale * countFontSize}rem`
              }}
            >
              {currentCount}
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Hadith Slider - Desktop Positioned */}
        {hadithSlidePosition !== 'hidden' && hadithSlidePosition !== 'bottom' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`hidden lg:block absolute w-80 z-20 ${hadithSlidePosition === 'top-right' ? 'top-4 right-0' :
              hadithSlidePosition === 'top-left' ? 'top-4 left-0' :
                hadithSlidePosition === 'bottom-right' ? 'bottom-4 right-0' :
                  hadithSlidePosition === 'bottom-left' ? 'bottom-4 left-0' :
                    'right-0 top-1/2 -translate-y-1/2' // right (default)
              }`}
          >
            <HadithSlider dhikr={currentDhikr} />
          </motion.div>
        )}

      </div>

      {/* Hadith Slider - Bottom (Mobile or when set to bottom) */}
      {hadithSlidePosition === 'bottom' && (
        <div className="w-full max-w-sm mt-6 mb-2 px-4 relative z-20">
          <HadithSlider dhikr={currentDhikr} />
        </div>
      )}

      {/* Dhikr text - Positioned between counter and Hadith slider on mobile */}
      {dhikrTextPosition === 'below-counter' && renderDhikrText()}

      {/* Mobile Hadith Slider (Below dhikr text) - only when position is not bottom or hidden */}
      {hadithSlidePosition !== 'bottom' && hadithSlidePosition !== 'hidden' && (
        <div className="lg:hidden w-full max-w-sm mt-1 sm:mt-2 mb-1 sm:mb-2 px-3 sm:px-4 relative z-20">
          <HadithSlider dhikr={currentDhikr} />
        </div>
      )}

      {/* Dhikr Text - Bottom Position */}
      {dhikrTextPosition === 'bottom' && renderDhikrText()}

      {/* Target indicator */}
      <div className={`mt-2 sm:mt-3 text-center transition-opacity duration-300 ${layout === 'focus' ? 'opacity-50 hover:opacity-100' : ''}`}>
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
                You have completed {sessionMode.type === 'tasbih100' ? '100 dhikr' : '1000 dhikr'}
                <br />
                {sessionMode.type === 'tasbih100' && <span className="text-xs">33 + 33 + 33 + 1</span>}
              </p>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {sessionMode.type === 'tasbih100' && defaultDhikrs.slice(0, 4).map((d, i) => (
                  <div key={d.id} className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs text-primary">✓</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{i === 3 ? '1' : '33'}</p>
                  </div>
                ))}

                {sessionMode.type === 'tasbih1000' && (
                  <div className="col-span-4 text-center">
                    <p className="text-sm font-medium text-foreground">GENERAL DHIKR NOT AS 100</p>
                    <p className="text-xs text-muted-foreground mt-2">You have completed 1000 counts.</p>
                  </div>
                )}
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
