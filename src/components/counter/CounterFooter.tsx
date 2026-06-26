import { memo } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';

const toArabicNumerals = (n: number): string => {
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(c => d[parseInt(c)] ?? c).join('');
};

export const CounterFooter = memo(function CounterFooter() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const currentDhikr = useTasbeehStore(state => state.currentDhikr);
  const sessionMode = useTasbeehStore(state => state.sessionMode);
  const zenMode = useTasbeehStore(state => state.zenMode);
  const totalAllTime = useTasbeehStore(state => state.totalAllTime);
  const streakDays = useTasbeehStore(state => state.streakDays);
  const { t } = useTranslation();

  const ROUND_SIZE = 33;
  const roundsDone = Math.floor(currentCount / ROUND_SIZE);

  const getCurrentTarget = () => {
    if (sessionMode.type === 'tasbih100') return [33, 33, 33, 1][sessionMode.currentPhase];
    if (sessionMode.type === 'tasbih1000') return 125;
    return targetCount;
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 pb-2">
      {/* Translation of dhikr */}
      {currentDhikr?.translation && (
        <p className="text-white/25 text-[10px] sm:text-xs italic text-center px-6 max-w-xs leading-relaxed">
          "{currentDhikr.translation}"
        </p>
      )}

      {/* Bottom stats strip */}
      {!zenMode && (
        <div className="flex items-center gap-5 sm:gap-8">
          {/* All time count */}
          <div className="flex flex-col items-center">
            <span
              className="font-arabic text-sm font-semibold animate-fade-in-up"
              style={{
                color: 'hsl(var(--primary) / 0.8)',
                textShadow: '0 0 10px hsl(var(--primary) / 0.3)'
              }}
            >
              {toArabicNumerals(totalAllTime)}
            </span>
            <span className="text-white/25 text-[9px] uppercase tracking-widest mt-0.5">
              {t('counter.total')}
            </span>
          </div>

          {/* Divider dot */}
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.2)' }}
          />

          {/* Current session rounds */}
          <div className="flex flex-col items-center">
            <span
              className="font-arabic text-sm font-semibold"
              style={{
                color: 'hsl(var(--primary) / 0.8)',
                textShadow: '0 0 10px hsl(var(--primary) / 0.3)'
              }}
            >
              {toArabicNumerals(roundsDone)}
            </span>
            <span className="text-white/25 text-[9px] uppercase tracking-widest mt-0.5">
              {t('counter.rounds')}
            </span>
          </div>

          {/* Divider dot */}
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.2)' }}
          />

          {/* Streak */}
          <div className="flex flex-col items-center">
            <span
              className="font-arabic text-sm font-semibold"
              style={{
                color: 'hsl(var(--primary) / 0.8)',
                textShadow: '0 0 10px hsl(var(--primary) / 0.3)'
              }}
            >
              {toArabicNumerals(streakDays)}
            </span>
            <span className="text-white/25 text-[9px] uppercase tracking-widest mt-0.5">
              {t('counter.streak')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
