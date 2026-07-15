import { memo } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';

const toArabicNumerals = (n: number, isRTL: boolean): string => {
  if (!isRTL) return n.toString();
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
  const { t, isRTL } = useTranslation();

  const ROUND_SIZE = 33;
  const roundsDone = Math.floor(currentCount / ROUND_SIZE);

  return (
    <div className="w-full flex flex-col items-center gap-5 pb-2">
      {/* Translation of dhikr */}
      {currentDhikr?.translation && (
        <p className="text-muted-foreground/60 text-[10px] sm:text-xs italic text-center px-6 max-w-xs leading-relaxed mt-2">
          "{currentDhikr.translation}"
        </p>
      )}

      {/* Bottom stats strip */}
      {!zenMode && (
        <div className="flex items-center gap-5 sm:gap-8">
          {/* All time count */}
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-lg font-bold animate-fade-in-up`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 12px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(totalAllTime, isRTL)}
            </span>
            <span className="text-foreground/75 text-[10px] font-semibold uppercase tracking-wider mt-1">
              {t('counter.total')}
            </span>
          </div>

          {/* Divider dot */}
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.4)' }}
          />

          {/* Current session rounds */}
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-lg font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 12px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(roundsDone, isRTL)}
            </span>
            <span className="text-foreground/75 text-[10px] font-semibold uppercase tracking-wider mt-1">
              {t('counter.rounds')}
            </span>
          </div>

          {/* Divider dot */}
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.4)' }}
          />

          {/* Streak */}
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-lg font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 12px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(streakDays, isRTL)}
            </span>
            <span className="text-foreground/75 text-[10px] font-semibold uppercase tracking-wider mt-1">
              {t('counter.streak')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
