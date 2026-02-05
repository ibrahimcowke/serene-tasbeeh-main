import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { getDailyIndex } from '@/lib/timeUtils';
import { Sparkles, X } from 'lucide-react';

/**
 * Dhikr of the Day Component
 * Displays a daily recommended dhikr with quick action to use it
 * Only shows once per day per user request
 */
export function DhikrOfTheDay() {
    const { setDhikr, currentDhikr, lastSeenDailyDhikrDate, setLastSeenDailyDhikrDate, currentCount } = useTasbeehStore();

    const today = new Date().toISOString().split('T')[0];

    // Initialize state strictly based on load state to prevent auto-hiding while viewing
    const [isVisible, setIsVisible] = useState(() => lastSeenDailyDhikrDate !== today);

    // Auto-mark as seen on mount if it is being shown
    useEffect(() => {
        if (isVisible && lastSeenDailyDhikrDate !== today) {
            setLastSeenDailyDhikrDate(today);
        }
    }, [isVisible]);

    // Auto-hide after 15 seconds or if user starts counting
    useEffect(() => {
        if (!isVisible) return;

        // Hide if user starts counting (dashboard space priority)
        if (currentCount > 0) {
            setIsVisible(false);
            return;
        }

        // Auto-hide timer (15 seconds)
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 15000);

        return () => clearTimeout(timer);
    }, [isVisible, currentCount]);

    // Get dhikr of the day (deterministic based on date)
    const dhikrOfDay = useMemo(() => {
        const index = getDailyIndex(defaultDhikrs.length);
        return defaultDhikrs[index];
    }, []);

    const isCurrentDhikr = currentDhikr.id === dhikrOfDay.id;

    const handleDismiss = () => {
        setLastSeenDailyDhikrDate(today);
        setIsVisible(false);
    };

    const handleUseDhikr = () => {
        if (!isCurrentDhikr) {
            setDhikr(dhikrOfDay);
        }
        // Also dismiss after using
        handleDismiss();
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="w-full max-w-2xl mx-auto mb-4 px-4 overflow-hidden"
            >
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm rounded-2xl p-4 border border-primary/20 shadow-lg group">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-6">
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
        </AnimatePresence>
    );
}
