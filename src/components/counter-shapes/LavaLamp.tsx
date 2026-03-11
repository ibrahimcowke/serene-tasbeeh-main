import React from 'react';
import { motion } from 'framer-motion';

interface LavaLampProps {
    progress: number;
    currentCount: number;
}

export const LavaLamp: React.FC<LavaLampProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden rounded-full bg-black/40 border border-white/10">
            {/* Soft Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-50" />
            
            {/* Floating Blobs */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary/40 rounded-full blur-2xl"
                    style={{
                        width: Math.random() * 100 + 50,
                        height: Math.random() * 100 + 50,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        x: [0, (Math.random() - 0.5) * 100, 0],
                        y: [0, (Math.random() - 0.5) * 150, 0],
                        scale: [1, 1.2, 0.8, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
            
            {/* The Main "Lava" Blob in the center that grows with progress */}
            <motion.div
                className="absolute w-40 h-40 bg-primary/30 rounded-full blur-3xl"
                animate={{
                    scale: 1 + progress * 0.5,
                    opacity: 0.4 + progress * 0.4,
                }}
                transition={{ type: 'spring', damping: 15 }}
            />
            
            {/* Glass Container Highlight */}
            <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none" />
            <div className="absolute top-4 left-1/4 w-1/2 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-full transform -rotate-12 blur-sm" />
        </div>
    );
};
