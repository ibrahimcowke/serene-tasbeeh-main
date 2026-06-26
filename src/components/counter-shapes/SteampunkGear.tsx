import React from 'react';
import { motion } from 'framer-motion';

interface SteampunkGearProps {
    currentCount: number;
}

export const SteampunkGear: React.FC<SteampunkGearProps> = ({ currentCount }) => {
    // Rotation increments: 15 degrees per count
    const baseRotation = currentCount * 15;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none [perspective:1000px]">
            {/* Ambient shadow backplate */}
            <div className="absolute inset-4 rounded-full bg-orange-950/20 blur-xl" />

            {/* Steampunk Vintage Backplate (Metal plate with rivets) */}
            <div className="absolute w-56 h-56 rounded-full border-4 border-[#3e2723] bg-[#2d1b10] shadow-[inset_0_4px_12px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.4)] flex items-center justify-center">
                {/* Rivets around the edge */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#8d6e63] to-[#3e2723] shadow-md border border-[#2d1b10]"
                        style={{
                            transform: `rotate(${i * 45}deg) translateY(-98px)`
                        }}
                    />
                ))}
            </div>

            {/* Small Connected Copper Gear (Top-Right) */}
            <motion.div
                className="absolute top-8 right-8 w-20 h-20 z-10"
                animate={{ rotate: -baseRotation * 2 }} // Spin opposite direction and twice as fast
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#b55d2c] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {/* Outer teeth */}
                    {[...Array(8)].map((_, i) => (
                        <path
                            key={i}
                            d="M 45 5 L 55 5 L 52 20 L 48 20 Z"
                            transform={`rotate(${i * 45} 50 50)`}
                            fill="currentColor"
                        />
                    ))}
                    {/* Inner gear circle */}
                    <circle cx="50" cy="50" r="38" fill="currentColor" />
                    {/* Metallic Center cutout */}
                    <circle cx="50" cy="50" r="16" fill="#2d1b10" stroke="#7e3d16" strokeWidth="2" />
                    {/* Rivets */}
                    <circle cx="50" cy="50" r="28" fill="none" stroke="#7e3d16" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
            </motion.div>

            {/* Tiny Steel Gear (Bottom-Left) */}
            <motion.div
                className="absolute bottom-10 left-10 w-14 h-14 z-10"
                animate={{ rotate: -baseRotation * 3 }} // Spin opposite direction and 3 times as fast
                transition={{ type: "spring", stiffness: 220, damping: 12 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#78909c] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {[...Array(6)].map((_, i) => (
                        <path
                            key={i}
                            d="M 46 5 L 54 5 L 52 22 L 48 22 Z"
                            transform={`rotate(${i * 60} 50 50)`}
                            fill="currentColor"
                        />
                    ))}
                    <circle cx="50" cy="50" r="35" fill="currentColor" />
                    <circle cx="50" cy="50" r="12" fill="#2d1b10" stroke="#37474f" strokeWidth="1.5" />
                </svg>
            </motion.div>

            {/* Large Central Brass Gear */}
            <motion.div
                className="absolute w-44 h-44 z-20"
                animate={{ rotate: baseRotation }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#cca04b] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                    {/* 12 Gear Teeth */}
                    {[...Array(12)].map((_, i) => (
                        <path
                            key={i}
                            d="M 44 4 L 56 4 L 54 18 L 46 18 Z"
                            transform={`rotate(${i * 30} 50 50)`}
                            fill="currentColor"
                        />
                    ))}
                    {/* Main gear wheel */}
                    <circle cx="50" cy="50" r="38" fill="currentColor" />
                    {/* Inner cutout detailing */}
                    {[...Array(4)].map((_, i) => (
                        <path
                            key={i}
                            d="M 50 50 L 50 15 A 35 35 0 0 1 74.7 25.3 Z"
                            transform={`rotate(${i * 90} 50 50)`}
                            fill="#2d1b10"
                            className="opacity-70"
                        />
                    ))}
                    {/* Central ring hub */}
                    <circle cx="50" cy="50" r="24" fill="currentColor" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="#7b5d27" strokeWidth="1.5" />
                    {/* Center spindle cutout */}
                    <circle cx="50" cy="50" r="12" fill="#1b1008" />
                </svg>
            </motion.div>

            {/* Glass core cover */}
            <div className="absolute w-20 h-20 rounded-full border border-white/10 bg-gradient-to-tr from-white/0 to-white/15 pointer-events-none z-30 shadow-inner" />
        </div>
    );
};
