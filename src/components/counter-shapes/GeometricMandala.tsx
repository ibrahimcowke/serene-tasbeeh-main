import React from 'react';
import { motion } from 'framer-motion';

interface GeometricMandalaProps {
    progress: number;
    currentCount: number;
}

export const GeometricMandala: React.FC<GeometricMandalaProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 scale-[1.1]">
            <div className="w-[320px] h-[320px] relative flex items-center justify-center">
                {/* Outer Rotating Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-primary/40" strokeWidth="0.5">
                        <circle cx="100" cy="100" r="95" />
                        {[...Array(12)].map((_, i) => (
                            <motion.path
                                key={i}
                                d="M100,5 L120,40 L160,40 L135,70 L160,100 L135,130 L160,160 L120,160 L100,195 L80,160 L40,160 L65,130 L40,100 L65,70 L40,40 L80,40 Z"
                                transform={`rotate(${i * 30} 100 100)`}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: i * 0.1 }}
                            />
                        ))}
                    </svg>
                </motion.div>

                {/* Reactive Middle Layer */}
                <motion.div
                    className="absolute inset-[15%] opacity-40"
                    animate={{ rotate: -currentCount * 5 }}
                    transition={{ type: 'spring', damping: 20 }}
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-primary" strokeWidth="1">
                        {[...Array(8)].map((_, i) => (
                            <path
                                key={i}
                                d="M100,20 L130,100 L100,180 L70,100 Z"
                                transform={`rotate(${i * 45} 100 100)`}
                                className="drop-shadow-[0_0_8px_hsl(var(--primary))]"
                            />
                        ))}
                    </svg>
                </motion.div>

                {/* Inner Glow and Progress Ring */}
                <div className="absolute inset-[30%]">
                    <svg viewBox="0 0 100 100" className="-rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/10" />
                        <motion.circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-primary"
                            strokeDasharray="283"
                            animate={{ strokeDashoffset: 283 - (283 * progress) }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                </div>

                {/* Center Pulse */}
                <motion.div
                    className="absolute w-24 h-24 bg-primary/5 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>
        </div>
    );
};
