import React from 'react';
import { motion } from 'framer-motion';

interface FireEmbersProps {
    progress: number;
    currentCount: number;
}

export const FireEmbers: React.FC<FireEmbersProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-black rounded-full border-4 border-orange-900/50 overflow-hidden shadow-[inset_0_0_50px_rgba(120,53,15,0.6)]">
            {/* Core Fire Glow */}
            <motion.div
                className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-orange-600/40 via-red-600/20 to-transparent blur-3xl"
                animate={{ 
                    height: ['40%', '60%', '40%'],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Rising Embers */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-400 rounded-full shadow-[0_0_5px_#fb923c]"
                    initial={{ bottom: -20, left: `${Math.random() * 100}%` }}
                    animate={{ 
                        bottom: '120%', 
                        left: `${(Math.random() - 0.5) * 20 + (i * 8)}%`,
                        opacity: [1, 1, 0],
                        scale: [1, 1.5, 0.5]
                    }}
                    transition={{ 
                        duration: 2 + Math.random() * 2, 
                        repeat: Infinity, 
                        delay: Math.random() * 2,
                        ease: "easeOut"
                    }}
                />
            ))}

            {/* Flickering Flames Base */}
            <div className="absolute bottom-2 flex justify-center gap-2 w-full px-8">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-12 h-24 bg-gradient-to-t from-orange-500/30 to-transparent rounded-full blur-xl origin-bottom"
                        animate={{ 
                            scaleY: [1, 1.3, 0.9, 1.2, 1],
                            rotate: [(i-1)*5, (i-1)*-5, (i-1)*5]
                        }}
                        transition={{ 
                            duration: 0.5 + Math.random(), 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Reactive Pulse on tap */}
            <motion.div
                key={currentCount}
                className="absolute inset-0 bg-orange-500/5 blur-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.4 }}
            />
        </div>
    );
};
