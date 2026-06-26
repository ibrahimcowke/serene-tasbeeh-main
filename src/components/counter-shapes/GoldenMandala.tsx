import React from 'react';
import { motion } from 'framer-motion';

interface GoldenMandalaProps {
    currentCount: number;
}

export const GoldenMandala: React.FC<GoldenMandalaProps> = ({ currentCount }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none">
            {/* Soft background gold glow */}
            <div className="absolute inset-4 rounded-full bg-amber-500/5 blur-2xl" />

            {/* Rotating Layer 1 (Outer Mandala - Clockwise) */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                    {/* 12 Outer Petals / Stars */}
                    {[...Array(12)].map((_, i) => (
                        <path
                            key={i}
                            d="M 50 10 C 53 25, 47 25, 50 40 C 47 25, 53 25, 50 10"
                            transform={`rotate(${i * 30} 50 50)`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    ))}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
            </motion.div>

            {/* Rotating Layer 2 (Middle Mandala - Counter-Clockwise) */}
            <motion.div
                className="absolute w-48 h-48"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/40 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                    {/* Star network (Overlapping squares rotated by 30 deg) */}
                    {[...Array(6)].map((_, i) => (
                        <rect
                            key={i}
                            x="25" y="25" width="50" height="50"
                            transform={`rotate(${i * 15} 50 50)`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.8"
                            className="rounded-sm"
                        />
                    ))}
                </svg>
            </motion.div>

            {/* Rotating Layer 3 (Inner Sacred Core - Clockwise) */}
            <motion.div
                className="absolute w-32 h-32"
                animate={{ rotate: 180 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-300 drop-shadow-[0_0_15px_rgba(253,230,138,0.7)]">
                    {/* Inner 8-pointed star */}
                    <path
                        d="M 50 20 L 58 42 L 80 50 L 58 58 L 50 80 L 42 58 L 20 50 L 42 42 Z"
                        fill="url(#mandala-gradient)"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    
                    <defs>
                        <radialGradient id="mandala-gradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                        </radialGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Pulse core and count ring */}
            <motion.div
                key={currentCount}
                className="absolute w-20 h-20 rounded-full border-2 border-amber-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-black/10 backdrop-blur-xs"
                initial={{ scale: 0.85, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                {/* Tiny breathing orbit bead */}
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#f59e0b]"
                    animate={{ rotate: 360 }}
                    style={{ transformOrigin: '40px 40px' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
};
