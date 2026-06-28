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
    <div className="w-full flex flex-col items-center gap-3 pb-2">
      {/* Translation of dhikr */}
      {currentDhikr?.translation && (
        <p className="text-muted-foreground/60 text-[10px] sm:text-xs italic text-center px-6 max-w-xs leading-relaxed">
          "{currentDhikr.translation}"
        </p>
      )}

      {/* Bottom stats strip */}
      {!zenMode && (
        <div className="flex items-center gap-5 sm:gap-8">
          {/* All time count */}
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm font-semibold animate-fade-in-up`}
              style={{
                color: 'hsl(var(--primary) / 0.8)',
                textShadow: '0 0 10px hsl(var(--primary) / 0.3)'
              }}
            >
              {toArabicNumerals(totalAllTime, isRTL)}
            </span>
            <span className="text-muted-foreground/60 text-[9px] uppercase tracking-widest mt-0.5">
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
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm font-semibold`}
              style={{
                color: 'hsl(var(--primary) / 0.8)',
                textShadow: '0 0 10px hsl(var(--primary) / 0.3)'
              }}
            >
              {toArabicNumerals(roundsDone, isRTL)}
            </span>
            <span className="text-muted-foreground/60 text-[9px] uppercase tracking-widest mt-0.5">
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
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm font-semibold`}
              style={{
                color: 'hsl(var(--primary) / 0.8)',
                textShadow: '0 0 10px hsl(var(--primary) / 0.3)'
              }}
            >
              {toArabicNumerals(streakDays, isRTL)}
            </span>
            <span className="text-muted-foreground/60 text-[9px] uppercase tracking-widest mt-0.5">
              {t('counter.streak')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
