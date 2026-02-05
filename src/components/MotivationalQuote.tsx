import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { motivationalQuotes, getRandomQuote, type MotivationalQuote } from '@/data/quotes';
import { X, ChevronRight } from 'lucide-react';

/**
 * Motivational Quote Component
 * Displays inspirational Islamic quotes on app open
 */
export function MotivationalQuoteOverlay() {
    const { motivationalQuotesEnabled, lastShownQuoteId, setLastShownQuoteId } = useTasbeehStore();
    const [quote, setQuote] = useState<MotivationalQuote | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!motivationalQuotesEnabled) return;

        // Get a quote that wasn't shown last time
        const availableQuotes = motivationalQuotes.filter(q => q.id !== lastShownQuoteId);
        const selectedQuote = availableQuotes.length > 0
            ? availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
            : getRandomQuote();

        setQuote(selectedQuote);
        setLastShownQuoteId(selectedQuote.id);
        setIsVisible(true);
    }, []);

    const handleNext = () => {
        const availableQuotes = motivationalQuotes.filter(q => q.id !== quote?.id);
        const nextQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
        setQuote(nextQuote);
        setLastShownQuoteId(nextQuote.id);
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!quote || !motivationalQuotesEnabled) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-border/50 relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative gradient overlay */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>

                        {/* Category badge */}
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {quote.category === 'quran' ? '📖 Quran' : quote.category === 'hadith' ? '📿 Hadith' : '🌟 Scholar'}
                            </span>
                        </div>

                        {/* Arabic text */}
                        <p className="font-arabic text-2xl sm:text-3xl text-foreground leading-relaxed mb-4 text-center">
                            {quote.arabic}
                        </p>

                        {/* Transliteration */}
                        {quote.transliteration && (
                            <p className="text-sm text-muted-foreground mb-4 text-center italic">
                                {quote.transliteration}
                            </p>
                        )}

                        {/* Meaning */}
                        <p className="text-base text-foreground/90 mb-4 text-center leading-relaxed">
                            "{quote.meaning}"
                        </p>

                        {/* Source */}
                        <p className="text-xs text-muted-foreground text-center mb-6">
                            — {quote.source}
                        </p>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                Next Quote
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
