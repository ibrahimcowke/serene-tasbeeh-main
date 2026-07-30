import { memo } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { Target, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const toArabicNumerals = (n: number, isRTL: boolean): string => {
  if (!isRTL) return n.toLocaleString();
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toLocaleString().split('').map(c => d[parseInt(c)] ?? c).join('');
};

interface CounterFooterProps {
  hideStats?: boolean;
}

export const CounterFooter = memo(function CounterFooter({ hideStats = false }: CounterFooterProps) {
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

  const isPresetTargetMode = 
    sessionMode.type === 'tasbih100' || 
    sessionMode.type === 'tasbih1000' || 
    sessionMode.type === 'salatul-tasbeeh' || 
    sessionMode.type === 'routine' || 
    targetCount > 0;

  const targetTitle = 
    sessionMode.type === 'tasbih100' ? '100 Sprint' :
    sessionMode.type === 'tasbih1000' ? '1000 Endurance' :
    sessionMode.type === 'salatul-tasbeeh' ? `Salatul Tasbeeh (${sessionMode.rakah || 1}/4)` :
    sessionMode.type === 'routine' ? 'Custom Routine' :
    targetCount > 0 ? `Preset Target ${targetCount}` : 'Free Dhikr Mode';

  const progressPercent = targetCount > 0 ? Math.min(100, Math.round((currentCount / targetCount) * 100)) : 0;

  if (zenMode) return null;

  return (
    <div className="w-full flex flex-col items-center gap-2 sm:gap-3 pb-1 px-2">
      {/* Translation of current dhikr */}
      {currentDhikr?.translation && (
        <p className="text-muted-foreground/75 text-[10px] sm:text-xs italic text-center px-4 max-w-sm leading-relaxed truncate">
          "{currentDhikr.translation}"
        </p>
      )}

      {/* Target Mode & Quick Preset Dashboard View */}
      {isPresetTargetMode && !hideStats && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-3 sm:p-3.5 rounded-2xl border bg-card/70 border-primary/20 backdrop-blur-md shadow-md space-y-2"
        >
          {/* Title & Progress Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/20 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="p-1 rounded-lg bg-primary/15 text-primary border border-primary/25 shrink-0">
                <Target size={12} />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] font-black text-primary uppercase tracking-wider block leading-none">Target Preset</span>
                <p className="text-xs font-bold text-foreground truncate leading-tight">{targetTitle}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-black text-primary tabular-nums">{progressPercent}%</span>
              <p className="text-[8px] text-muted-foreground font-semibold">{currentCount}/{targetCount || '∞'}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {targetCount > 0 && (
            <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden border border-border/20">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          )}

          {/* All 4 Footer Items Grid (Total, Rounds, Streak, Hasanat) */}
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {/* Total */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[8px] text-muted-foreground/80 font-bold uppercase tracking-tight mb-0.5">
                {t('counter.total')}
              </span>
              <span className="text-xs font-bold text-primary tabular-nums">
                {toArabicNumerals(totalAllTime, isRTL)}
              </span>
            </div>

            {/* Rounds */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[8px] text-muted-foreground/80 font-bold uppercase tracking-tight mb-0.5">
                {t('counter.rounds')}
              </span>
              <span className="text-xs font-bold text-primary tabular-nums">
                {toArabicNumerals(roundsDone, isRTL)} ×33
              </span>
            </div>

            {/* Streak */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[8px] text-muted-foreground/80 font-bold uppercase tracking-tight mb-0.5 flex items-center gap-0.5">
                <Flame size={9} className="text-orange-500 fill-orange-500" />
                {t('counter.streak')}
              </span>
              <span className="text-xs font-bold text-orange-500 tabular-nums">
                {toArabicNumerals(streakDays, isRTL)}d
              </span>
            </div>

            {/* Hasanat */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[8px] text-muted-foreground/80 font-bold uppercase tracking-tight mb-0.5 flex items-center gap-0.5">
                <Star size={9} className="text-yellow-400 fill-yellow-400" />
                Hasanat
              </span>
              <span className="text-xs font-bold text-yellow-400 tabular-nums">
                +{toArabicNumerals(currentCount * 10, isRTL)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Free Mode Footer Stats Strip */}
      {!isPresetTargetMode && !hideStats && (
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm sm:text-base font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(totalAllTime, isRTL)}
            </span>
            <span className="text-foreground/75 text-[9px] font-semibold uppercase tracking-wider">
              {t('counter.total')}
            </span>
          </div>

          <div className="w-1 h-1 rounded-full bg-primary/40" />

          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm sm:text-base font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(roundsDone, isRTL)}
            </span>
            <span className="text-foreground/75 text-[9px] font-semibold uppercase tracking-wider">
              {t('counter.rounds')}
            </span>
          </div>

          <div className="w-1 h-1 rounded-full bg-primary/40" />

          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm sm:text-base font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(streakDays, isRTL)}
            </span>
            <span className="text-foreground/75 text-[9px] font-semibold uppercase tracking-wider">
              {t('counter.streak')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
