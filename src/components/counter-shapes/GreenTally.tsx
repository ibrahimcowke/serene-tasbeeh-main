import React from 'react';
import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';

interface GreenTallyProps {
    currentCount: number;
}

export const GreenTally: React.FC<GreenTallyProps> = ({ currentCount }) => {
    const reset = useTasbeehStore((state) => state.reset);

    return (
        <div className="relative w-[280px] h-[310px] flex items-center justify-center pointer-events-none">
            {/* Skeuomorphic green handheld counter body */}
            <div className="absolute inset-0 bg-[#0fa464] border-4 border-[#0a7e4c] rounded-[100px] rounded-t-[110px] shadow-[inset_0_8px_16px_rgba(255,255,255,0.4),0_12px_24px_rgba(0,0,0,0.4)] flex flex-col items-center p-4">
                
                {/* Highlight/Reflection overlay for premium plastic look */}
                <div className="absolute top-2 left-6 right-6 h-12 bg-gradient-to-b from-white/25 to-transparent rounded-t-[100px] pointer-events-none" />

                {/* Black Bezel around LCD */}
                <div className="w-[200px] h-[95px] bg-[#0c0d0d] rounded-[36px] border-4 border-[#070808] shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center mt-3 relative overflow-hidden">
                    
                    {/* LCD screen inside */}
                    <div className="w-[176px] h-[72px] bg-[#cbd2c9] border-2 border-[#a3ada0] rounded-xl flex flex-col items-center justify-between p-1 shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]">
                        {/* Screen Header text */}
                        <span className="text-[10px] font-black font-sans text-neutral-800 uppercase tracking-widest mt-0.5 opacity-90 select-none">
                            Digital Counter
                        </span>

                        {/* LCD Digits */}
                        <div className="flex-1 flex items-center justify-end w-full px-3 relative">
                            {/* Inactive background segments for authentic look */}
                            <span className="absolute right-3 text-[42px] font-black text-black/5 font-mono select-none tracking-normal">
                                8888
                            </span>
                            
                            {/* Active segments */}
                            <motion.span
                                key={currentCount}
                                className="text-[44px] leading-none font-bold text-neutral-800 font-mono tracking-normal"
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1 }}
                            >
                                {currentCount.toString().padStart(4, '0')}
                            </motion.span>
                        </div>
                    </div>
                    
                    {/* Bezel glass glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />
                </div>

                {/* Interactive Area holding buttons */}
                <div className="relative w-full flex-1 flex items-center justify-center mt-2">
                    
                    {/* Small Reset Button on upper right of main button */}
                    <motion.div
                        className="absolute right-8 top-3 w-8 h-8 rounded-full bg-[#d0d3d4] border-2 border-[#979a9a] shadow-[0_3px_6px_rgba(0,0,0,0.3),inset_0_2px_2px_rgba(255,255,255,0.8)] cursor-pointer pointer-events-auto flex items-center justify-center"
                        whileTap={{ scale: 0.85, translateY: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            reset();
                        }}
                    >
                        <div className="w-4 h-4 rounded-full bg-[#bdc3c7]" />
                    </motion.div>

                    {/* Large Main Click Button (Counts on tap) */}
                    {/* We make this pointer-events-none because the parent CounterVisuals button handles the main click.
                        However, we can mirror the active state or just have it respond to count change animations. */}
                    <motion.div
                        key={currentCount}
                        className="w-28 h-28 rounded-full bg-[#d0d3d4] border-4 border-[#b2b5b6] shadow-[0_8px_16px_rgba(0,0,0,0.35),inset_0_4px_6px_rgba(255,255,255,0.8)] flex items-center justify-center relative"
                        animate={{
                            scale: [1, 0.94, 1],
                            y: [0, 2, 0]
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#eaeded] to-[#bdc3c7] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
