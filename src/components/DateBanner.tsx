import { useTasbeehStore } from '@/store/tasbeehStore';
import { useEffect } from 'react';
import { Moon, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { themes, counterShapes } from '@/lib/constants';

export function DateBanner() {
    const { dateContext, updateDateContext, theme, counterShape } = useTasbeehStore();

    const currentThemeLabel = themes.find(t => t.id === theme)?.label || 'Unknown';
    const currentShapeLabel = counterShapes.find(s => s.id === counterShape)?.label || 'Unknown';

    useEffect(() => {
        updateDateContext();
    }, []);

    useEffect(() => {
        if (dateContext.specialDayName) {
            //Simple check to avoid spamming? For now rely on component mount
            //In a real app we'd track 'lastShown' in store
            toast.success(dateContext.specialDayName, {
                description: "Don't forget your special Adhkar today!",
                duration: 5000,
                icon: '🌙'
            });
        }
    }, [dateContext.specialDayName]);

    if (!dateContext.hijriDate) return null;

    const isSpecial = dateContext.isJummah || dateContext.isWhiteDay || dateContext.isRamadan || dateContext.specialDayName;

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-4 mb-1"
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
                    <span className="px-1.5 py-0.5 rounded-md bg-secondary/60 text-foreground/60 text-[10px] uppercase tracking-widest font-medium border border-border/40">
                        {currentShapeLabel} <span className="opacity-40 mx-0.5">|</span> {currentThemeLabel}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
