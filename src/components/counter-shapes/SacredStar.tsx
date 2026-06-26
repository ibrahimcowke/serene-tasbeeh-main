import React from 'react';
import { motion } from 'framer-motion';

interface SacredStarProps {
    currentCount: number;
}

export const SacredStar: React.FC<SacredStarProps> = ({ currentCount }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none">
            {/* Outer Soft Ambient Glow */}
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />

            {/* Rotating Outer Geometric Dotted Circle */}
            <motion.div
                className="absolute w-56 h-56 rounded-full border border-primary/25 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Slow Rotating Rub el Hizb Star (Overlapping Squares) */}
            <motion.div
                className="absolute w-44 h-44 flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
                {/* Square 1 */}
                <motion.div
                    className="absolute w-full h-full border-2 border-primary/40 rounded-lg bg-primary/5"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Square 2 (Rotated 45 deg) */}
                <motion.div
                    className="absolute w-full h-full border-2 border-primary/40 rounded-lg bg-primary/5 origin-center rotate-45"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />

                {/* Outer Ring inside Star */}
                <div className="absolute w-32 h-32 rounded-full border border-primary/30" />
            </motion.div>

            {/* Inner Sacred Star SVG with active scale-pop and draw effect */}
            <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                    {/* Inner 8-pointed star */}
                    <motion.path
                        key={`star-${currentCount}`}
                        d="M 50 12 L 61 39 L 88 50 L 61 61 L 50 88 L 39 61 L 12 50 L 39 39 Z"
                        fill="url(#sacred-gradient)"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                        initial={{ scale: 0.8, opacity: 0.5, pathLength: 0 }}
                        animate={{ scale: 1, opacity: 1, pathLength: 1 }}
                        transition={{
                            scale: { type: "spring", stiffness: 300, damping: 15 },
                            pathLength: { duration: 0.6, ease: "easeOut" }
                        }}
                    />

                    {/* Concentric inner circles */}
                    <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/70" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" className="text-primary" />

                    {/* Gradient Definition */}
                    <defs>
                        <radialGradient id="sacred-gradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                            <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Radiant Sparkles / Aura Burst on Count Increment */}
            <motion.div
                key={`spark-${currentCount}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* 4 Diagonal rays */}
                <div className="absolute w-48 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rotate-45" />
                <div className="absolute w-48 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -rotate-45" />
                <div className="absolute w-48 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute w-48 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rotate-90" />
            </motion.div>
        </div>
    );
};
