import { memo } from 'react';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { HadithSlider } from '../HadithSlider';

export const CounterFooter = memo(function CounterFooter() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const currentDhikrId = useTasbeehStore(state => state.currentDhikr.id);
  const sessionMode = useTasbeehStore(state => state.sessionMode);
  const hadithSlidePosition = useTasbeehStore(state => state.hadithSlidePosition);
  const zenMode = useTasbeehStore(state => state.zenMode);
  
  const currentDhikr = defaultDhikrs.find(d => d.id === currentDhikrId) || { id: currentDhikrId };

  if (zenMode || hadithSlidePosition === 'none') {
    return (
      <div className="w-full flex flex-col items-center justify-center py-4">
        <p className="text-xs xs:text-sm text-muted-foreground opacity-50">
          {currentCount} / {targetCount > 0 ? targetCount : '∞'}
        </p>
      </div>
    );
  }

  const getCurrentTarget = () => {
    if (sessionMode.type === 'tasbih100') return [33, 33, 33, 1][sessionMode.currentPhase];
    if (sessionMode.type === 'tasbih1000') return 125;
    return targetCount;
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 py-2 transition-all duration-500">
      <div className="w-full flex justify-center">
        <HadithSlider dhikr={currentDhikr as any} />
      </div>
      
      <div className="text-center">
        <p className="text-[10px] xs:text-xs text-muted-foreground uppercase tracking-widest font-medium opacity-60">
          Progress: {currentCount} / {getCurrentTarget() > 0 ? getCurrentTarget() : '∞'}
        </p>
      </div>
    </div>
  );
});
