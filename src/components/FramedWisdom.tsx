import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FramedWisdomProps {
    arabic: string;
    english: string;
    source: string;
}

export const FramedWisdom = ({ arabic, english, source }: FramedWisdomProps) => {
    return (
        <div className="wood-frame rounded-sm p-8 flex flex-col items-center justify-center text-center group relative overflow-hidden max-w-lg mx-auto">
            {/* Decorative inner border */}
            <div className="absolute inset-2 border border-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-5 max-w-[90%]">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-arabic text-primary/90 leading-relaxed"
                    key={arabic}
                >
                    {arabic}
                </motion.p>

                <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent self-center" />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[11px] italic text-muted-foreground/80 font-serif leading-relaxed"
                    key={english}
                >
                    "{english}"
                </motion.p>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-[9px] uppercase tracking-widest text-[#2d1b0d] font-bold bg-primary/20 px-2 py-0.5 rounded">Wisdom</span>
                    <span className="text-[9px] text-muted-foreground font-serif">— {source}</span>
                </div>
            </div>

            {/* Navigation dots simulator */}
            <div className="absolute bottom-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-primary' : 'bg-white/10'}`} />
                ))}
            </div>
        </div>
    );
};
