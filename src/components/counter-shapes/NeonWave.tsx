import React from 'react';
import { motion } from 'framer-motion';

interface NeonWaveProps {
    currentCount: number;
}

export const NeonWave: React.FC<NeonWaveProps> = ({ currentCount }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-pink-500/5 blur-3xl rounded-full" />

            {/* Outer Liquid Ring (Slow counter-clockwise) */}
            <motion.div
                className="absolute w-56 h-56 border-2 border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15),inset_0_0_15px_rgba(236,72,153,0.1)]"
                style={{
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'
                }}
                animate={{
                    rotate: -360,
                    borderRadius: [
                        '40% 60% 70% 30% / 40% 50% 60% 50%',
                        '60% 40% 30% 70% / 50% 60% 40% 60%',
                        '40% 60% 70% 30% / 40% 50% 60% 50%'
                    ]
                }}
                transition={{
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    borderRadius: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }}
            />

            {/* Middle Liquid Ring (Clockwise) */}
            <motion.div
                className="absolute w-44 h-44 border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2),inset_0_0_20px_rgba(168,85,247,0.15)]"
                style={{
                    borderRadius: '50% 50% 30% 70% / 50% 30% 70% 50%'
                }}
                animate={{
                    rotate: 360,
                    borderRadius: [
                        '50% 50% 30% 70% / 50% 30% 70% 50%',
                        '30% 70% 70% 30% / 60% 40% 60% 40%',
                        '50% 50% 30% 70% / 50% 30% 70% 50%'
                    ]
                }}
                transition={{
                    rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                    borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
            />

            {/* Inner Neon Core Wave */}
            <motion.div
                key={currentCount}
                className="absolute w-32 h-32 border-2 border-cyan-400 shadow-[0_0_25px_#22d3ee,inset_0_0_15px_#22d3ee] flex items-center justify-center bg-black/5"
                style={{
                    borderRadius: '60% 40% 50% 50% / 50% 50% 40% 60%'
                }}
                animate={{
                    scale: [0.92, 1.05, 1],
                    borderRadius: [
                        '60% 40% 50% 50% / 50% 50% 40% 60%',
                        '50% 50% 60% 40% / 40% 60% 50% 50%',
                        '60% 40% 50% 50% / 50% 50% 40% 60%'
                    ]
                }}
                transition={{
                    scale: { type: "spring", stiffness: 350, damping: 12 },
                    borderRadius: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                {/* Internal pulsing glow */}
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 blur-xs" />
            </motion.div>

            {/* Expanding Neon Shockwave Circle on Tap */}
            <motion.div
                key={`ripple-${currentCount}`}
                className="absolute w-24 h-24 rounded-full border-4 border-cyan-400"
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            />
        </div>
    );
};
