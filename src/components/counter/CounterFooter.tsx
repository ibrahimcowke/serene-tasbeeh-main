import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { HadithSlider } from '../HadithSlider';

export const CounterFooter = memo(function CounterFooter() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const currentDhikrId = useTasbeehStore(state => state.currentDhikr.id);
  const sessionMode = useTasbeehStore(state => state.sessionMode);
  
  const currentDhikr = defaultDhikrs.find(d => d.id === currentDhikrId) || { id: currentDhikrId };

  const getCurrentTarget = () => {
    if (sessionMode.type === 'tasbih100') return [33, 33, 33, 1][sessionMode.currentPhase];
    if (sessionMode.type === 'tasbih1000') return 125;
    return targetCount;
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-[20%] max-h-[30%] overflow-hidden mt-2">
      <div className="w-full flex justify-center mb-6">
        <HadithSlider dhikr={currentDhikr as any} />
      </div>
      
      <div className="text-center transition-opacity duration-300">
        <p className="text-xs xs:text-sm text-muted-foreground">
          {currentCount} / {getCurrentTarget() > 0 ? getCurrentTarget() : '∞'}
        </p>
      </div>
    </div>
  );
});
