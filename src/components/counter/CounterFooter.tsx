import { memo } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { Target, Flame, Star, Trophy, RefreshCw, Sparkles } from 'lucide-react';
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
    sessionMode.type === 'tasbih100' ? '100 Sprint Challenge' :
    sessionMode.type === 'tasbih1000' ? '1000 Endurance Challenge' :
    sessionMode.type === 'salatul-tasbeeh' ? `Salatul Tasbeeh (Rak'ah ${sessionMode.rakah || 1}/4)` :
    sessionMode.type === 'routine' ? 'Custom Routine' :
    targetCount > 0 ? `Target Preset: ${targetCount}` : 'Free Dhikr Mode';

  const progressPercent = targetCount > 0 ? Math.min(100, Math.round((currentCount / targetCount) * 100)) : 0;

  if (zenMode) return null;

  return (
    <div className="w-full flex flex-col items-center gap-2 pb-1 px-2 max-w-lg mx-auto">
      {/* Translation of current dhikr */}
      {currentDhikr?.translation && (
        <p className="text-muted-foreground/80 text-[11px] sm:text-xs italic text-center px-4 max-w-md leading-relaxed truncate">
          "{currentDhikr.translation}"
        </p>
      )}

      {/* PRO PRESET TARGET DASHBOARD CARD */}
      {isPresetTargetMode && !hideStats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-3.5 sm:p-4 rounded-3xl border border-primary/30 bg-gradient-to-b from-card/80 via-card/60 to-background/90 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.35)] space-y-3 relative overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header: Active Target Badge & Progress */}
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)] shrink-0">
                <Target className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/90">Target Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{targetTitle}</h4>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-black text-primary tabular-nums tracking-tight">
                {progressPercent}%
              </span>
              <p className="text-[10px] text-muted-foreground font-medium">
                {currentCount} / {targetCount || '∞'}
              </p>
            </div>
          </div>

          {/* Glowing Animated Progress Bar */}
          {targetCount > 0 && (
            <div className="w-full h-2 rounded-full bg-secondary/80 overflow-hidden p-0.5 border border-border/30 shadow-inner relative z-10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-amber-400 shadow-[0_0_12px_rgba(var(--primary),0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          )}

          {/* 4 PRO METRIC CARDS (2x2 Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5 relative z-10">
            {/* 1. All-time Total */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-background/50 border border-primary/20 backdrop-blur-md flex items-center gap-2 shadow-sm hover:border-primary/40 transition-all">
              <div className="p-1.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Trophy size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t('counter.total')}
                </span>
                <span className="text-xs font-black text-foreground tabular-nums">
                  {toArabicNumerals(totalAllTime, isRTL)}
                </span>
              </div>
            </div>

            {/* 2. Current Session Rounds */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-background/50 border border-primary/20 backdrop-blur-md flex items-center gap-2 shadow-sm hover:border-primary/40 transition-all">
              <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                <RefreshCw size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t('counter.rounds')}
                </span>
                <span className="text-xs font-black text-indigo-400 tabular-nums">
                  {toArabicNumerals(roundsDone, isRTL)} ×33
                </span>
              </div>
            </div>

            {/* 3. Daily Streak */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-background/50 border border-orange-500/20 backdrop-blur-md flex items-center gap-2 shadow-sm hover:border-orange-500/40 transition-all">
              <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                <Flame size={13} className="fill-orange-500/30" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {t('counter.streak')}
                </span>
                <span className="text-xs font-black text-orange-500 tabular-nums">
                  {toArabicNumerals(streakDays, isRTL)}d
                </span>
              </div>
            </div>

            {/* 4. Hasanat Earned */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-background/50 border border-yellow-500/20 backdrop-blur-md flex items-center gap-2 shadow-sm hover:border-yellow-500/40 transition-all">
              <div className="p-1.5 rounded-xl bg-yellow-500/10 text-yellow-400 shrink-0">
                <Star size={13} className="fill-yellow-400/30" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Hasanat
                </span>
                <span className="text-xs font-black text-yellow-400 tabular-nums">
                  +{toArabicNumerals(currentCount * 10, isRTL)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Free Mode Pro Stats Strip */}
      {!isPresetTargetMode && !hideStats && (
        <div className="flex items-center justify-around w-full max-w-sm px-4 py-2.5 rounded-2xl bg-card/60 border border-border/30 backdrop-blur-xl shadow-md">
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm sm:text-base font-black`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(totalAllTime, isRTL)}
            </span>
            <span className="text-foreground/75 text-[9px] font-bold uppercase tracking-widest mt-0.5">
              {t('counter.total')}
            </span>
          </div>

          <div className="w-1 h-4 bg-border/40 rounded-full" />

          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm sm:text-base font-black`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(roundsDone, isRTL)}
            </span>
            <span className="text-foreground/75 text-[9px] font-bold uppercase tracking-widest mt-0.5">
              {t('counter.rounds')}
            </span>
          </div>

          <div className="w-1 h-4 bg-border/40 rounded-full" />

          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm sm:text-base font-black`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(streakDays, isRTL)}
            </span>
            <span className="text-foreground/75 text-[9px] font-bold uppercase tracking-widest mt-0.5">
              {t('counter.streak')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
