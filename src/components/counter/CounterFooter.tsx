import { memo } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { Target, Flame, Trophy, Star, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
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
  const totalHasanat = useTasbeehStore(state => state.totalHasanat);
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
    sessionMode.type === 'routine' ? 'Custom Routine Mode' :
    targetCount > 0 ? `Target Preset: ${targetCount}` : 'Free Dhikr Mode';

  const progressPercent = targetCount > 0 ? Math.min(100, Math.round((currentCount / targetCount) * 100)) : 0;

  if (zenMode) return null;

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-4 pb-2 px-2">
      {/* Translation of current dhikr */}
      {currentDhikr?.translation && (
        <p className="text-muted-foreground/70 text-[10px] sm:text-xs italic text-center px-4 max-w-sm leading-relaxed">
          "{currentDhikr.translation}"
        </p>
      )}

      {/* Target Mode Quick Preset Dashboard View */}
      {isPresetTargetMode && !hideStats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-4 rounded-3xl border bg-card/60 border-primary/25 backdrop-blur-xl shadow-lg space-y-3"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Preset Title Header & Progress Status */}
          <div className="flex items-center justify-between gap-2 border-b border-border/20 pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-xl bg-primary/15 text-primary border border-primary/30 shrink-0">
                <Target size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Quick Target Preset</span>
                <p className="text-xs font-bold text-foreground truncate">{targetTitle}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-black text-primary tabular-nums">{progressPercent}%</span>
              <p className="text-[9px] text-muted-foreground font-semibold">{currentCount}/{targetCount || '∞'}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {targetCount > 0 && (
            <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden border border-border/20 p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          )}

          {/* All Items Grid — Footer Counters (Total, Rounds, Streak, Hasanat) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {/* 1. All-time Total */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider mb-0.5">
                {t('counter.total')}
              </span>
              <span className="text-xs font-black text-primary tabular-nums">
                {toArabicNumerals(totalAllTime, isRTL)}
              </span>
            </div>

            {/* 2. Current Session Rounds */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider mb-0.5">
                {t('counter.rounds')}
              </span>
              <span className="text-xs font-black text-primary tabular-nums">
                {toArabicNumerals(roundsDone, isRTL)} ×33
              </span>
            </div>

            {/* 3. Daily Streak */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-0.5">
                <Flame size={10} className="text-orange-500 fill-orange-500" />
                {t('counter.streak')}
              </span>
              <span className="text-xs font-black text-orange-500 tabular-nums">
                {toArabicNumerals(streakDays, isRTL)}d
              </span>
            </div>

            {/* 4. Hasanat Earned */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-foreground/[0.03] border border-border/20">
              <span className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-0.5">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                Hasanat
              </span>
              <span className="text-xs font-black text-yellow-400 tabular-nums">
                +{toArabicNumerals(currentCount * 10, isRTL)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Free Mode Footer Stats Strip */}
      {!isPresetTargetMode && !hideStats && (
        <div className="flex items-center gap-5 sm:gap-8">
          {/* All time count */}
          <div className="flex flex-col items-center">
            <span
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-base sm:text-lg font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 12px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(totalAllTime, isRTL)}
            </span>
            <span className="text-foreground/75 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
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
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-base sm:text-lg font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 12px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(roundsDone, isRTL)}
            </span>
            <span className="text-foreground/75 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
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
              className={`${isRTL ? 'font-arabic' : 'font-sans'} text-base sm:text-lg font-bold`}
              style={{
                color: 'hsl(var(--primary))',
                textShadow: '0 0 12px hsl(var(--primary) / 0.4)'
              }}
            >
              {toArabicNumerals(streakDays, isRTL)}
            </span>
            <span className="text-foreground/75 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
              {t('counter.streak')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
