import React from 'react';
import { motion } from 'framer-motion';

interface RetroLCDProps {
    progress: number;
    currentCount: number;
}

export const RetroLCD: React.FC<RetroLCDProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-200 rounded-3xl border-8 border-slate-400 shadow-[inset_0_5px_15px_rgba(0,0,0,0.2),0_10px_25px_rgba(0,0,0,0.3)] p-4 max-w-[320px] max-h-[220px] m-auto">
            {/* LCD Screen Coating */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-2xl z-20" />
            
            <div className="w-full h-full bg-[#9dae93] rounded-xl shadow-inner flex flex-col items-center justify-center relative overflow-hidden font-mono text-[#2c3328] border-2 border-[#8b9b82]">
                {/* Gray Segment Shadows (Off pixels) */}
                <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center text-[120px] select-none pointer-events-none tracking-tighter">
                    8888
                </div>

                {/* Active Segments Area */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Digital Tasbeeh</span>
                    
                    <motion.div 
                        className="text-[110px] leading-none tracking-tighter mix-blend-multiply opacity-90 drop-shadow-[1px_1px_rgba(44,51,40,0.2)]"
                        key={currentCount}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.9 }}
                    >
                        {currentCount.toString().padStart(4, '0')}
                    </motion.div>
                </div>

                {/* Lower Status Info */}
                <div className="flex justify-between w-full px-4 text-[8px] font-bold opacity-60 uppercase mt-2">
                    <span>MODE: DHIKR</span>
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        REC •
                    </motion.span>
                </div>

                {/* Scanlines Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
            </div>
        </div>
    );
};
