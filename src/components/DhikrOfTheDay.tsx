import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { getDailyIndex } from '@/lib/timeUtils';
import { Sparkles } from 'lucide-react';

/**
 * Dhikr of the Day Component
 * Displays a daily recommended dhikr with quick action to use it
 */
export function DhikrOfTheDay() {
    const { setDhikr, currentDhikr } = useTasbeehStore();

    // Get dhikr of the day (deterministic based on date)
    const dhikrOfDay = useMemo(() => {
        const index = getDailyIndex(defaultDhikrs.length);
        return defaultDhikrs[index];
    }, []);

    const isCurrentDhikr = currentDhikr.id === dhikrOfDay.id;

    const handleUseDhikr = () => {
        if (!isCurrentDhikr) {
            setDhikr(dhikrOfDay);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto mb-4 px-4"
        >
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm rounded-2xl p-4 border border-primary/20 shadow-lg">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-medium text-foreground">Dhikr of the Day</h3>
                            {isCurrentDhikr && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                                    Active
                                </span>
                            )}
                        </div>

                        <p className="font-arabic text-lg text-foreground mb-1">
                            {dhikrOfDay.arabic}
                        </p>

                        <p className="text-xs text-muted-foreground mb-2">
                            {dhikrOfDay.transliteration}
                        </p>

                        <p className="text-xs text-foreground/80 mb-3">
                            {dhikrOfDay.meaning}
                        </p>

                        {/* Action button */}
                        {!isCurrentDhikr && (
                            <button
                                onClick={handleUseDhikr}
                                className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                            >
                                Use this dhikr
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
