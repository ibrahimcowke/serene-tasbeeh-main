import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, Sliders, LayoutGrid, RotateCcw, Clock, Sparkles, Cloud, Bell, Moon } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { APP_VERSION } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const WhatsNew = () => {
    const { lastSeenVersion, setLastSeenVersion } = useTasbeehStore();
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Show if version has changed or never seen
        if (lastSeenVersion !== APP_VERSION) {
            // Mark as seen immediately so it doesn't show again on refresh/crash
            setLastSeenVersion(APP_VERSION);

            // Small delay to let app load first
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [lastSeenVersion]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            setLastSeenVersion(APP_VERSION);
        }, 500);
    };

    // Close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const features = [
        {
            title: "Cloud Sync & Backup",
            description: "Sync your sessions, daily records, achievements, streaks, and settings securely to the cloud with automatic max-value merging.",
            icon: <Cloud className="w-8 h-8 text-sky-400" />,
            color: "from-sky-500/20 to-sky-500/5"
        },
        {
            title: "Reminders Redesign",
            description: "Enjoy alarm-clock style rows, inline editing, repeat shortcuts, next-fire countdowns, and linked dhikr quick shortcuts.",
            icon: <Bell className="w-8 h-8 text-indigo-400" />,
            color: "from-indigo-500/20 to-indigo-500/5"
        },
        {
            title: "Smart Suggestions",
            description: "Personalized suggestions at the top of your reminders feed based on your last 30 days of dhikr tapper activity.",
            icon: <Sparkles className="w-8 h-8 text-purple-400" />,
            color: "from-purple-500/20 to-purple-500/5"
        },
        {
            title: "Lazy Day Recovery",
            description: "Receive an evening recovery nudge at 8:30 PM if you haven't started your dhikr yet, with a handy quick-start banner.",
            icon: <Moon className="w-8 h-8 text-amber-500" />,
            color: "from-amber-500/20 to-amber-500/5"
        }
    ];


    const nextSlide = () => {
        if (currentIndex < features.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 custom-overlay-open">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="mb-6">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary uppercase tracking-wider">
                                    What's New
                                </span>
                            </div>

                            <div className="h-64 w-full relative">
                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center"
                                    >
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${features[currentIndex].color} flex items-center justify-center mb-6 border border-white/5`}>
                                            {features[currentIndex].icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{features[currentIndex].title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed px-4">
                                            {features[currentIndex].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Pagination Dots */}
                            <div className="flex gap-1.5 mb-6">
                                {features.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-primary/20'}`}
                                    />
                                ))}
                            </div>

                            {/* Actions */}
                            <Button
                                onClick={nextSlide}
                                className="w-full rounded-xl h-12 text-sm font-medium group"
                            >
                                {currentIndex === features.length - 1 ? (
                                    "Start Exploring"
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Next Feature <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
