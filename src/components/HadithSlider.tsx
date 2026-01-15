import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dhikr } from '@/store/tasbeehStore';

export function HadithSlider({ dhikr }: { dhikr: Dhikr }) {
    const [index, setIndex] = useState(0);
    const DURATION = 15000; // 15 seconds

    useEffect(() => {
        // Reset index when dhikr changes
        setIndex(0);
    }, [dhikr.id]);

    useEffect(() => {
        if (!dhikr.hadiths || dhikr.hadiths.length <= 1) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % dhikr.hadiths!.length);
        }, DURATION);

        return () => clearInterval(timer);
    }, [dhikr.hadiths]);

    // Fallback content if no specific hadiths are available
    // Arabic fallback: "Keep your tongue wet with the remembrance of Allah" -> "لا يزال لسانك رطباً من ذكر الله"
    const content = (dhikr.hadiths && dhikr.hadiths.length > 0)
        ? dhikr.hadiths[index]
        : {
            text: "لَا يَزَالُ لِسَانُكَ رَطْبًا مِنْ ذِكْرِ اللَّهِ",
            source: "حديث شريف"
        };

    const hadith = content;
    const isArabic = /[\u0600-\u06FF]/.test(hadith.text);

    return (
        <div className="w-full max-w-sm mx-auto md:mx-0 min-h-[160px] bg-card/40 hover:bg-card/60 backdrop-blur-md rounded-2xl border border-border/40 p-5 flex flex-col justify-center relative overflow-hidden transition-colors duration-300 group">

            {/* Background Decoration */}
            <div className={`absolute top-0 ${isArabic ? 'left-0' : 'right-0'} p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 17.5228 12 22Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${dhikr.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-3 relative z-10"
                    dir={isArabic ? 'rtl' : 'ltr'}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                            {isArabic ? 'فضائل الذكر' : 'Guidance'}
                        </span>
                    </div>

                    <p className={`text-base font-medium text-foreground/90 leading-loose ${isArabic ? 'font-arabic' : ''}`}>
                        "{hadith.text}"
                    </p>

                    <p className={`text-xs text-muted-foreground mt-1 font-medium ${isArabic ? 'font-arabic' : ''}`}>
                        — {hadith.source}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Timer Progress Bar */}
            {dhikr.hadiths && dhikr.hadiths.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20">
                    <motion.div
                        key={index}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: DURATION / 1000, ease: "linear" }}
                        className="h-full bg-primary/50"
                    />
                </div>
            )}

            {/* Paginator Dots (Optional, keeping for existing preference) */}
            {dhikr.hadiths && dhikr.hadiths.length > 1 && (
                <div className={`flex gap-1.5 mt-4 ${isArabic ? 'justify-end' : 'justify-start'}`}>
                    {dhikr.hadiths.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted/60'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
