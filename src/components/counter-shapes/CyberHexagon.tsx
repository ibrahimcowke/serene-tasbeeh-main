import React from 'react';
import { motion } from 'framer-motion';

export const CyberHexagon: React.FC<{ currentCount: number }> = ({ currentCount }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <motion.div
                className="absolute inset-0 rounded-full border border-primary/20 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Hexagon Shape */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                    {/* Hexagon Path */}
                    <motion.path
                        d="M50 5 L93.3 30 L93.3 70 L50 95 L6.7 70 L6.7 30 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Inner Hexagon - fills on pulse */}
                    <motion.path
                        d="M50 15 L85 35 L85 65 L50 85 L15 65 L15 35 Z"
                        fill="rgba(var(--primary), 0.1)"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-primary"
                        animate={{
                            fillOpacity: [0.1, 0.3, 0.1],
                            strokeWidth: [1, 2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>

            </div>

            {/* Glitch overlays on tap */}
            <motion.div
                key={currentCount}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0.8, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-40 h-40 border border-primary/50 rounded-full opacity-50" />
            </motion.div>
        </div>
    );
};
