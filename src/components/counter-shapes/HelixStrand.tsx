import React from 'react';
import { motion } from 'framer-motion';

export const HelixStrand: React.FC<{ currentCount: number }> = ({ currentCount }) => {
    const points = 15;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center bg-transparent">
            {/* Container */}
            <div className="relative w-32 h-56 flex flex-col justify-between items-center">
                {[...Array(points)].map((_, i) => {
                    // Normalized Y position 0 to 1
                    const progress = i / (points - 1);
                    // Phase shift based on position + count
                    // We want rotation. Rotation means phase shift.
                    // Phase = (progress * Frequency) + (currentCount * ShiftAmount)
                    const phase = (progress * Math.PI * 2) + (currentCount * 0.5);

                    const x1 = Math.sin(phase) * 40;
                    const x2 = Math.sin(phase + Math.PI) * 40; // Opposite

                    // Z-index simulation based on cosine (depth)
                    const z1 = Math.cos(phase);
                    const z2 = Math.cos(phase + Math.PI);

                    const scale1 = 0.8 + (z1 + 1) * 0.2; // 0.8 to 1.2
                    const opacity1 = 0.5 + (z1 + 1) * 0.25;

                    const scale2 = 0.8 + (z2 + 1) * 0.2;
                    const opacity2 = 0.5 + (z2 + 1) * 0.25;

                    return (
                        <div key={i} className="absolute w-full flex justify-center items-center" style={{ top: `${progress * 100}%` }}>
                            {/* Connector Line */}
                            <motion.div
                                className="absolute h-[2px] bg-primary/30"
                                style={{
                                    width: Math.abs(x1 - x2),
                                    left: `calc(50% + ${Math.min(x1, x2)}px)`,
                                    opacity: Math.min(opacity1, opacity2) * 0.5
                                }}
                            />

                            {/* Bead 1 */}
                            <motion.div
                                className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                                style={{ x: x1, zIndex: z1 > 0 ? 10 : 0, scale: scale1, opacity: opacity1 }}
                                animate={{ x: x1, scale: scale1, opacity: opacity1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />

                            {/* Bead 2 */}
                            <motion.div
                                className="absolute w-4 h-4 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.5)]"
                                style={{ x: x2, zIndex: z2 > 0 ? 10 : 0, scale: scale2, opacity: opacity2 }}
                                animate={{ x: x2, scale: scale2, opacity: opacity2 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
