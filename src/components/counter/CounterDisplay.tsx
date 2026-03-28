import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { CounterVisuals } from '../CounterVisuals';
import { toast } from 'sonner';

export const CounterDisplay = memo(function CounterDisplay() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const sessionMode = useTasbeehStore(state => state.sessionMode);
  const counterShape = useTasbeehStore(state => state.counterShape || 'plain');
  const counterVerticalOffset = useTasbeehStore(state => state.counterVerticalOffset);
  const counterScale = useTasbeehStore(state => state.counterScale);
  const countFontSize = useTasbeehStore(state => state.countFontSize);
  const theme = useTasbeehStore(state => state.theme);
  const themeSettings = useTasbeehStore(state => state.themeSettings);
  const increment = useTasbeehStore(state => state.increment);
  const reset = useTasbeehStore(state => state.reset);
  
  const currentSettings = themeSettings?.[theme] || defaultThemeSettings;
  
  const [pullProgress, setPullProgress] = useState(0);
  const resetThreshold = 100;

  const getProgress = () => {
    if (sessionMode.type === 'tasbih100') {
      const phaseTargets = [33, 33, 33, 1];
      const currentTarget = phaseTargets[sessionMode.currentPhase];
      return Math.min(currentCount / currentTarget, 1);
    }
    if (sessionMode.type === 'tasbih1000') return Math.min(currentCount / 125, 1);
    return targetCount > 0 ? Math.min(currentCount / targetCount, 1) : 0;
  };

  const handleTap = () => {
    if (sessionMode.type === 'tasbih100' && sessionMode.isComplete) return;
    increment();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full relative z-10 my-0.5 select-none rounded-[40px] transition-all duration-700 p-4 xs:p-8">
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
            progress={getProgress()}
            currentCount={currentCount}
            currentSettings={currentSettings}
            handleTap={handleTap}
            showCompletion={false} // Handle completion visuals separately if needed
            countFontSize={countFontSize}
            disabled={sessionMode.type === 'tasbih100' && sessionMode.isComplete}
          />
        </div>
      </motion.div>
    </div>
  );
});
