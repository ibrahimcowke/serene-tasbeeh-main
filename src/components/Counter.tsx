import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { ProgressRing } from './ProgressRing';
import { HadithSlider } from './HadithSlider';
import { SoundManager } from '@/lib/sound';
import { CounterVisuals } from './CounterVisuals';
import { Palette, Shapes } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    layoutOrder,
    setLayoutOrder,
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
    // if (dhikrTextPosition === 'hidden') return null;
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

  const renderSection = (id: string) => {
    switch (id) {
      case 'dhikr':
        return renderDhikrText();
      case 'counter':
        return (
          <div className="flex flex-col items-center justify-center w-full relative z-10 my-4 select-none">
            {/* Mobile controls (Minus & Reset) placed above counter */}
            <div className={`flex items-center justify-center gap-4 xs:gap-6 sm:gap-8 mb-2 xs:mb-3 sm:mb-4 lg:hidden relative z-20 transition-opacity duration-300 ${isEditingLayout ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            </div>

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
          </div>
        );
      case 'stats':
        return (
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
        );
      case 'hadith':
        if (hadithSlidePosition === 'hidden' && !isEditingLayout) return null;
        const isSidePosition = hadithSlidePosition !== 'bottom' && hadithSlidePosition !== 'hidden';
        return (
          <div className={`w-full max-w-sm mt-1 sm:mt-2 mb-1 sm:mb-2 px-3 sm:px-4 relative z-20 ${isSidePosition ? 'lg:hidden' : ''}`}>
            <HadithSlider dhikr={currentDhikr} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`flex flex-col items-center flex-1 px-4 sm:px-6 md:px-8 lg:px-12 relative w-full min-h-full transition-all duration-500 py-6
      ${layout === 'ergonomic' ? 'justify-end pb-16' : ''}
    `}
        style={{ transform: `translateY(${verticalOffset}px)` }}
      >
        {/* NEW THEME CHANGER DROPDOWN */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full backdrop-blur-md transition-all duration-300 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                title="Change Theme"
              >
                <Palette className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-card/90 backdrop-blur-xl border-border/50 max-h-[50dvh] overflow-hidden flex flex-col">
              <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
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
                  { id: 'theme-oled', label: 'OLED', icon: '🖤' },
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full backdrop-blur-md transition-all duration-300 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                title="Change Counter Style"
              >
                <Shapes className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-card/90 backdrop-blur-xl border-border/50 max-h-[50dvh] overflow-hidden flex flex-col">
              <DropdownMenuLabel>Counter Style</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="overflow-y-auto custom-scrollbar p-1">
                {[
                  { id: 'minimal', label: 'Minimal', icon: '○' },
                  { id: 'classic', label: 'Classic', icon: '□' },
                  { id: 'beads', label: 'Beads', icon: 'ooo' },
                  { id: 'flower', label: 'Flower', icon: '❀' },
                  { id: 'waveform', label: 'Wave', icon: '〰' },
                  { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
                  { id: 'orb', label: 'Orb', icon: '●' },
                  { id: 'digital', label: 'Premium', icon: '✨' },
                  { id: 'modern-ring', label: 'Modern', icon: '◎' },
                  { id: 'vintage-wood', label: 'Vintage', icon: '📜' },
                  { id: 'geometric-star', label: 'Star', icon: '۞' },
                  { id: 'fluid', label: 'Fluid', icon: '💧' },
                  { id: 'neumorph', label: 'Soft', icon: '☁' },
                  { id: 'real-beads', label: 'Real', icon: '📿' },
                  { id: 'cyber-3d', label: 'Cyber', icon: '💎' },
                  { id: 'glass-orb', label: 'Glass', icon: '🔮' },
                  { id: 'crystal-iso', label: 'Crystal', icon: '🕋' },
                  { id: 'portal-depth', label: 'Portal', icon: '🌀' },
                  { id: 'luminous-ring', label: 'Lume', icon: '⭕' },
                  { id: 'ring-light', label: 'Ring Light', icon: '🔆' },
                  { id: 'galaxy', label: 'Galaxy', icon: '🌌' },
                  { id: 'tally-clicker', label: 'Tally 3D', icon: '🖱️' },
                ].map((style) => (
                  <DropdownMenuItem
                    key={style.id}
                    onClick={() => useTasbeehStore.getState().setCounterShape(style.id as any)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-base scale-125 inline-block w-5 text-center">{style.icon}</span>
                    <span className={`flex-1 ${counterShape === style.id ? 'font-bold text-primary' : ''}`}>{style.label}</span>
                    {counterShape === style.id && <span className="text-primary text-xs">●</span>}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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

          <Reorder.Group axis="y" values={layoutOrder || ['dhikr', 'counter', 'stats', 'hadith']} onReorder={setLayoutOrder} className="flex flex-col items-center w-full">
            {(layoutOrder || ['dhikr', 'counter', 'stats', 'hadith']).map(item => (
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

      </div>

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
    </>
  );
}
