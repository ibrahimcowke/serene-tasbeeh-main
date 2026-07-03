import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sparkles, X } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { isLazyDay, isEveningOrLater } from '@/lib/lazyDayRecovery';

const DISMISS_KEY = 'lazy_day_dismissed_date';

export function LazyDayBanner() {
    const startTasbih100 = useTasbeehStore((s) => s.startTasbih100);
    const dailyRecords = useTasbeehStore((s) => s.dailyRecords);
    const lazyDayRecoveryEnabled = useTasbeehStore((s) => s.lazyDayRecoveryEnabled);
    const zenMode = useTasbeehStore((s) => s.zenMode);

    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (!lazyDayRecoveryEnabled || zenMode) {
            setVisible(false);
            return;
        }

        // Check if already dismissed today
        const dismissedDate = localStorage.getItem(DISMISS_KEY);
        const today = new Date().toISOString().split('T')[0];
        if (dismissedDate === today) {
            setVisible(false);
            return;
        }

        const shouldShow = isLazyDay() && isEveningOrLater();
        setVisible(shouldShow);
    }, [dailyRecords, lazyDayRecoveryEnabled, zenMode, dismissed]);

    const handleDismiss = () => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(DISMISS_KEY, today);
        setDismissed(true);
        setVisible(false);
    };

    const handleStartNow = () => {
        handleDismiss();
        startTasbih100();
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="lazy-day-banner"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative z-40 mx-4 mt-2 overflow-hidden rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--accent) / 0.08) 100%)',
                        border: '1px solid hsl(var(--primary) / 0.25)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Subtle shimmer top line */}
                    <div
                        className="absolute inset-x-0 top-0 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)' }}
                    />

                    <div className="flex items-center gap-3 px-4 py-3">
                        {/* Icon */}
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                background: 'hsl(var(--primary) / 0.15)',
                                border: '1px solid hsl(var(--primary) / 0.3)',
                            }}
                        >
                            <Moon className="w-4.5 h-4.5 text-primary" size={18} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground/90 leading-tight">
                                No dhikr yet today 🌙
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                                Start a short session before the day ends
                            </p>
                        </div>

                        {/* CTA */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStartNow}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold shrink-0"
                            style={{
                                background: 'hsl(var(--primary))',
                                color: 'hsl(var(--primary-foreground))',
                            }}
                        >
                            <Sparkles size={11} />
                            Start Now
                        </motion.button>

                        {/* Dismiss */}
                        <button
                            onClick={handleDismiss}
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
