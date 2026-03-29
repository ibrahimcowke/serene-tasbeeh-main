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
          
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.h2
                key={currentCount}
                initial={{ opacity: 0.5, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 1.1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  mass: 0.8
                }}
                className="counter-number pointer-events-none select-none text-foreground z-10"
                style={{ 
                  fontSize: `clamp(40px, 12vh, ${countFontSize || 80}px)`,
                  transform: `scale(${counterScale || 1})`,
                  lineHeight: 1
                }}
              >
                {currentCount.toLocaleString()}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>

        {/* Improved shadow/glow for depth */}
        <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </motion.div>
    </div>
  );
});
