import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WISDOMS = [
    {
        arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ ، عَدَدَ خَلْقِهِ ، وَرِضَا نَفْسِهِ ، وَزِنَةَ عَرْشِهِ ، وَمِدَادَ كَلِمَاتِهِ",
        source: "Sahih Muslim"
    },
    {
        arabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        source: "Sahih Bukhari"
    },
    {
        arabic: "أَحَبُّ الْكَلَامِ إِلَى اللَّهِ أَرْبَعٌ: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
        source: "Sahih Muslim"
    },
    {
        arabic: "مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
        source: "Sahih Bukhari"
    },
    {
        arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلآنِ مَا بَيْنَ السَّمَوَاتِ وَالأَرْضِ",
        source: "Sahih Muslim"
    }
];

export const FramedWisdom = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % WISDOMS.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const currentWisdom = WISDOMS[currentIndex];

    return (
        <div className="wood-frame rounded-sm p-5 flex flex-col items-center justify-center text-center group relative overflow-hidden w-full max-w-lg mx-auto min-h-[160px]">
            {/* Decorative inner border */}
            <div className="absolute inset-2 border border-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col w-full max-w-[90%] justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-4 items-center w-full"
                    >
                        <p className="text-2xl lg:text-3xl font-arabic text-primary/90 leading-relaxed min-h-[80px] flex items-center justify-center">
                            {currentWisdom.arabic}
                        </p>

                        <div className="flex justify-between items-center mt-2 w-full">
                            <span className="text-[9px] uppercase tracking-widest text-[#2d1b0d] font-bold bg-primary/20 px-2 py-0.5 rounded">Wisdom</span>
                            <span className="text-[9px] text-muted-foreground font-serif">— {currentWisdom.source}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-3 flex gap-2">
                {WISDOMS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${i === currentIndex ? 'bg-primary' : 'bg-white/10 hover:bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
};
