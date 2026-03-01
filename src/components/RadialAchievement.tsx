import React from 'react';
import { motion } from 'framer-motion';

interface RadialAchievementProps {
    progress: number; // 0 to 100
    title: string;
}

export const RadialAchievement = ({ progress, title }: RadialAchievementProps) => {
    const radius = 80;
    const circumference = Math.PI * radius; // Half-circle
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-24 overflow-hidden">
                <svg className="w-48 h-48 -rotate-180 transform translate-y-[-50%]">
                    {/* Track */}
                    <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset="0"
                    />
                    {/* Progress */}
                    <motion.circle
                        cx="96"
                        cy="96"
                        r={radius}
                        fill="transparent"
                        stroke="url(#arc-gradient)"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="radial-progress-arc"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                        <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Glow Handle */}
                    {(() => {
                        const safeProgress = isNaN(progress) ? 0 : progress;
                        const centerX = 96;
                        const centerY = 96;
                        const targetX = centerX + radius * Math.cos((1 - safeProgress / 100) * Math.PI);
                        const targetY = centerY - radius * Math.sin((1 - safeProgress / 100) * Math.PI);

                        return (
                            <motion.circle
                                cx={isNaN(targetX) ? centerX : targetX}
                                cy={isNaN(targetY) ? centerY : targetY}
                                r="6"
                                fill="#4ade80"
                                filter="url(#glow)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        );
                    })()}
                </svg>

                <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <span className="text-3xl font-black text-white">{progress}%</span>
                </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-2">
                {title}
            </p>
        </div>
    );
};
