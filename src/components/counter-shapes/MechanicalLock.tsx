import React from 'react';
import { motion } from 'framer-motion';

interface MechanicalLockProps {
    progress: number;
    currentCount: number;
}

export const MechanicalLock: React.FC<MechanicalLockProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 scale-[0.85]">
            {/* Vault Body */}
            <div className="w-[300px] h-[300px] rounded-[3rem] bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-[8px] border-gray-500 shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Brushed Metal Texture */}
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_10px)]" />

                {/* Rotating Dial */}
                <motion.div
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-100 to-gray-400 border-[6px] border-gray-500 shadow-[2px_10px_20px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.8)] flex items-center justify-center relative z-10"
                    animate={{ rotate: currentCount * (360 / 33) }}
                    transition={{ type: 'spring', damping: 15, stiffness: 150 }}
                >
                    {/* Dial Numbers/Ticks */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-4 bg-gray-600 rounded-full"
                            style={{ transform: `rotate(${i * 30}deg) translateY(-80px)` }}
                        />
                    ))}
                    
                    {/* The Knob */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-500 border-2 border-gray-400 shadow-lg flex items-center justify-center">
                        <div className="w-1 h-8 bg-red-600 rounded-full -translate-y-4" />
                    </div>
                </motion.div>

                {/* Status Light */}
                <div className="absolute top-8 right-8 flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-full border border-black/20 ${progress >= 1 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-700">{progress >= 1 ? 'UNLOCKED' : 'SECURED'}</span>
                </div>

                {/* Rivets */}
                {[0, 90, 180, 270].map((deg) => (
                    <div
                        key={deg}
                        className="absolute w-4 h-4 rounded-full bg-gray-600 shadow-inner"
                        style={{ transform: `rotate(${deg}deg) translate(120px, 120px)` }}
                    />
                ))}
            </div>
        </div>
    );
};
