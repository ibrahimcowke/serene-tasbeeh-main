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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-4 mb-4"
        >
            <div className={`
                relative overflow-hidden rounded-2xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left
                ${isSpecial ? 'bg-primary/5 border-primary/20' : 'bg-card/50 border-border/50'}
            `}>
                {/* Decorative Background */}
                {isSpecial && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />}

                <div className="flex items-center gap-3 z-10">
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${isSpecial ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}
                    `}>
                        {dateContext.isRamadan || (dateContext.hijriDate.includes('Ramadan')) ? (
                            <Moon className="w-5 h-5" />
                        ) : (
                            <Calendar className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm sm:text-base">{dateContext.hijriDate}</h3>
                        <p className="text-xs text-muted-foreground">Islamic Date (Umm al-Qura)</p>
                    </div>
                </div>

                {/* Special Badges + Style Indicator */}
                <div className="flex flex-wrap justify-center sm:justify-end gap-2 z-10">
                    {dateContext.isJummah && (
                        <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Jumu'ah Mubarak
                        </span>
                    )}
                    {dateContext.specialDayName && (
                        <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 text-xs font-medium border border-purple-500/20">
                            {dateContext.specialDayName}
                        </span>
                    )}
                    {dateContext.isWhiteDay && (
                        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 text-xs font-medium border border-blue-500/20">
                            White Days (Ayyam al-Bid)
                        </span>
                    )}

                    {/* Theme & Style Indicator */}
                    <span className="px-2 py-1 rounded-md bg-secondary/60 text-foreground/70 text-[10px] uppercase tracking-widest font-medium border border-border/40">
                        {currentShapeLabel} <span className="opacity-40 mx-0.5">|</span> {currentThemeLabel}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
