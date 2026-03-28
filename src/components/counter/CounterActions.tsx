import { memo } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { SettingsView } from '../SettingsView';
import { UndoButton } from '../UndoButton';
import { counterShapes } from '@/lib/constants';

export const CounterActions = memo(function CounterActions() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const counterShape = useTasbeehStore(state => state.counterShape || 'plain');
  const zenMode = useTasbeehStore(state => state.zenMode);
  
  const decrement = useTasbeehStore(state => state.decrement);
  const reset = useTasbeehStore(state => state.reset);

  const currentShapeData = counterShapes.find(s => s.id === counterShape);
  const shapeColor = currentShapeData?.color || 'currentColor';

  if (zenMode) return null;

  return (
    <div className="flex items-center justify-center gap-2 xs:gap-6 sm:gap-8 mt-2 xs:mt-5 sm:mt-6 relative z-20 transition-opacity duration-300">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          decrement();
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
            reset();
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
  );
});
