import { useTasbeehStore } from '@/store/tasbeehStore';
import { useEffect } from 'react';
import { Moon, Calendar, Sparkles } from 'lucide-react';
import { getContext } from '@/lib/hijri';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { themes } from '@/lib/constants';

export function DateBanner({ className = "px-4" }: { className?: string }) {
    const { theme } = useTasbeehStore();

    const currentThemeLabel = themes.find(t => t.id === theme)?.label || 'Unknown';

    const context = getContext();
    const dateContext = {
        ...context,
        hijriDate: `${context.hijri.day} ${context.hijri.monthName} ${context.hijri.year}`
    };

    useEffect(() => {
        if (dateContext?.specialDayName) {
            // toast suppressed to avoid spam
        }
    }, [dateContext?.specialDayName]);

    if (!dateContext?.hijriDate) return null;


    const isSpecial = dateContext.isJummah || dateContext.isWhiteDay || dateContext.isRamadan || dateContext.specialDayName;

    // Ramadan countdown
    const ramadanBadge = (() => {
      if (dateContext.isRamadan) {
        return `🌙 Day ${context.hijri.day} of Ramadan`;
      }
      // Days until Ramadan: Ramadan is month 9 in Hijri
      const hijriMonth = context.hijri.month;
      const hijriDay = context.hijri.day;
      let daysLeft: number;
      if (hijriMonth < 9) {
        // Rough: assume 30 days per month for remaining months
        daysLeft = (9 - hijriMonth - 1) * 30 + (30 - hijriDay) + 1;
      } else {
        // After Ramadan, next year
        daysLeft = (12 - hijriMonth) * 30 + (30 - hijriDay) + 9 * 30 + 1;
      }
      if (daysLeft <= 60) return `🌙 Ramadan in ${daysLeft} days`;
      return null;
    })();

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full mb-1 ${className}`}
        >
            <div className={`
                flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs
                ${isSpecial ? 'bg-primary/5 border-primary/20' : 'bg-card/40 border-border/40'}
            `}>
                {/* Left: date */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {dateContext.isRamadan || dateContext.hijriDate.includes('Ramadan') ? (
                        <Moon className="w-3.5 h-3.5 text-primary" />
                    ) : (
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="font-medium text-foreground/80 text-[11px]">{dateContext.hijriDate}</span>
                </div>

                {/* Right: badges + style indicator */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {dateContext.isJummah && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[10px] font-medium border border-green-500/20">
                            <Sparkles className="w-2.5 h-2.5" /> Jumu'ah
                        </span>
                    )}
                    {dateContext.specialDayName && (
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 text-[10px] font-medium border border-purple-500/20">
                            {dateContext.specialDayName}
                        </span>
                    )}
                    {dateContext.isWhiteDay && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-medium border border-blue-500/20">
                            Ayyam al-Bid
                        </span>
                    )}
                    {ramadanBadge && !dateContext.isRamadan && (
                        <span className="px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-500 text-[10px] font-medium border border-violet-500/20">
                            {ramadanBadge}
                        </span>
                    )}
                    <span className="hidden lg:inline-block px-1.5 py-0.5 rounded-md bg-secondary/60 text-foreground/60 text-[10px] uppercase tracking-widest font-medium border border-border/40">
                        {currentThemeLabel}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
