import React from 'react';
import { motion } from 'framer-motion';

interface CyberOrbitProps {
    currentCount: number;
}

export const CyberOrbit: React.FC<CyberOrbitProps> = ({ currentCount }) => {
    // 3 orbits with different tilt and animation durations
    const orbits = [
        { rotateX: 65, rotateY: 15, duration: 8, beadColor: 'bg-primary', beadSize: 'w-3 h-3', count: 2 },
        { rotateX: 30, rotateY: -45, duration: 12, beadColor: 'bg-primary/80', beadSize: 'w-2 h-2', count: 1 },
        { rotateX: -45, rotateY: 30, duration: 16, beadColor: 'bg-accent', beadSize: 'w-2.5 h-2.5', count: 1 }
    ];

    return (
        <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none [perspective:1000px]">
            {/* Ambient Background Grid Glow */}
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />

            {/* Central Pulse Core */}
            <motion.div
                key={`core-${currentCount}`}
                className="absolute w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center"
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: [0.9, 1.1, 1], opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                }}
            >
                {/* Luminous Inner Core */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/50 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                    <div className="w-8 h-8 rounded-full bg-primary/40 blur-xs" />
                </div>
            </motion.div>

            {/* Orbit Paths and Revolving Electrons */}
            {orbits.map((orbit, index) => (
                <div
                    key={index}
                    className="absolute w-48 h-48 flex items-center justify-center"
                    style={{
                        transform: `rotateX(${orbit.rotateX}deg) rotateY(${orbit.rotateY}deg)`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Ring Path */}
                    <div className="absolute w-full h-full rounded-full border border-primary/20 pointer-events-none" />

                    {/* Spinning Container holding the beads */}
                    <motion.div
                        className="absolute w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: orbit.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {Array.from({ length: orbit.count }).map((_, beadIndex) => {
                            const angle = (beadIndex * 360) / orbit.count;
                            const radian = (angle * Math.PI) / 180;
                            const radius = 96; // 48px is half-width
                            const x = Math.cos(radian) * radius;
                            const y = Math.sin(radian) * radius;

                            return (
                                <motion.div
                                    key={beadIndex}
                                    className={`absolute rounded-full shadow-[0_0_10px_currentColor] text-primary ${orbit.beadColor} ${orbit.beadSize}`}
                                    style={{
                                        left: `calc(50% + ${x}px - ${parseInt(orbit.beadSize) * 2}px)`,
                                        top: `calc(50% + ${y}px - ${parseInt(orbit.beadSize) * 2}px)`,
                                        transform: 'translateZ(0px)',
                                    }}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        boxShadow: [
                                            '0 0 8px currentColor',
                                            '0 0 20px currentColor',
                                            '0 0 8px/80%'
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: beadIndex * 0.5
                                    }}
                                />
                            );
                        })}
                    </motion.div>
                </div>
            ))}

            {/* shockwave expander on Tap */}
            <motion.div
                key={`shockwave-${currentCount}`}
                className="absolute w-32 h-32 rounded-full border-2 border-accent/60"
                style={{
                    transform: 'rotateX(60deg) rotateY(0deg)',
                }}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            />
        </div>
    );
};
