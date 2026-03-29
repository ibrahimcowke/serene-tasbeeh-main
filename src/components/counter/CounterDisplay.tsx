import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { CounterVisuals } from '../CounterVisuals';

export const CounterDisplay = memo(function CounterDisplay() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const increment = useTasbeehStore(state => state.increment);
  const theme = useTasbeehStore(state => state.theme);
  const counterShape = useTasbeehStore(state => state.counterShape);
  const counterVerticalOffset = useTasbeehStore(state => state.counterVerticalOffset);
  const counterScale = useTasbeehStore(state => state.counterScale);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const countFontSize = useTasbeehStore(state => state.countFontSize);
  
  const currentSettings = useTasbeehStore(state => state.themeSettings[theme]);

  const handleTap = () => {
    increment();
  };

  const progress = targetCount > 0 ? currentCount / targetCount : 0;
  const showCompletion = targetCount > 0 && currentCount >= targetCount;

  return (
    <div className="flex flex-col items-center justify-center w-full max-h-min py-1 xs:py-2">
      <motion.div
        whileTap={{ scale: 0.96 }}
        onClick={handleTap}
        className="relative cursor-pointer transition-transform duration-300 ease-out preserve-3d group"
      >
        <div className="relative p-2 xs:p-4 sm:p-6 scale-[0.8] xs:scale-100 transition-transform origin-center">
          <CounterVisuals 
            counterShape={counterShape}
            counterVerticalOffset={counterVerticalOffset}
            counterScale={counterScale}
            progress={progress}
            currentCount={currentCount}
            currentSettings={currentSettings}
            countFontSize={countFontSize}
            handleTap={handleTap}
            showCompletion={showCompletion}
            disabled={false}
          />
        </div>

        {/* Improved shadow/glow for depth */}
        <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </motion.div>
    </div>
  );
});
