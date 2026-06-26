import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RetroFlipProps {
    currentCount: number;
}

export const RetroFlip: React.FC<RetroFlipProps> = ({ currentCount }) => {
    // Format count to 4 digits
    const digits = currentCount.toString().padStart(4, '0').split('');

    return (
        <div className="relative flex items-center justify-center p-6 bg-neutral-950 border-4 border-neutral-800 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.05)] w-[300px] h-[160px] pointer-events-none overflow-hidden select-none">
            {/* Metallic screws in corners for skeuomorphic feel */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-neutral-700 shadow-inner" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neutral-700 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-neutral-700 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-neutral-700 shadow-inner" />

            {/* Glass Glare Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-20" />

            {/* Digits row */}
            <div className="flex gap-2.5 z-10 [perspective:800px]">
                {digits.map((digit, index) => (
                    <div 
                        key={index}
                        className="relative w-12 h-20 bg-neutral-900 rounded-lg flex flex-col justify-between overflow-hidden shadow-md border border-neutral-950"
                    >
                        {/* Upper half card */}
                        <div className="w-full h-[39px] bg-gradient-to-b from-[#222] to-[#151515] rounded-t-lg border-b border-neutral-950 flex items-end justify-center overflow-hidden">
                            <span className="text-[52px] font-black text-neutral-100 leading-[0] translate-y-[20px] font-mono tracking-tighter">
                                {digit}
                            </span>
                        </div>

                        {/* Split line */}
                        <div className="w-full h-[2px] bg-neutral-950 shadow-inner" />

                        {/* Lower half card */}
                        <div className="w-full h-[39px] bg-gradient-to-b from-[#181818] to-[#0f0f0f] rounded-b-lg flex items-start justify-center overflow-hidden">
                            <span className="text-[52px] font-black text-neutral-200 leading-[0] -translate-y-[20px] font-mono tracking-tighter">
                                {digit}
                            </span>
                        </div>

                        {/* Flip Card animation on digit update */}
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`${index}-${digit}`}
                                className="absolute inset-0 flex flex-col origin-center"
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                exit={{ rotateX: 90, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 160,
                                    damping: 14
                                }}
                                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                            >
                                {/* Upper card of flip */}
                                <div className="w-full h-[39px] bg-gradient-to-b from-[#252525] to-[#1a1a1a] rounded-t-lg border-b border-neutral-950 flex items-end justify-center overflow-hidden">
                                    <span className="text-[52px] font-black text-white leading-[0] translate-y-[20px] font-mono tracking-tighter">
                                        {digit}
                                    </span>
                                </div>
                                <div className="w-full h-[2px] bg-neutral-950" />
                                {/* Lower card of flip */}
                                <div className="w-full h-[39px] bg-gradient-to-b from-[#1c1c1c] to-[#121212] rounded-b-lg flex items-start justify-center overflow-hidden">
                                    <span className="text-[52px] font-black text-neutral-100 leading-[0] -translate-y-[20px] font-mono tracking-tighter">
                                        {digit}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Side hinge notches */}
                        <div className="absolute top-[38px] -left-1 w-2 h-1 bg-neutral-950 rounded-r-sm" />
                        <div className="absolute top-[38px] -right-1 w-2 h-1 bg-neutral-950 rounded-l-sm" />
                    </div>
                ))}
            </div>
        </div>
    );
};
