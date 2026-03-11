import React from 'react';
import { motion } from 'framer-motion';

interface SunsetHorizonProps {
    progress: number;
    currentCount: number;
}

export const SunsetHorizon: React.FC<SunsetHorizonProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 rounded-full overflow-hidden bg-gradient-to-b from-blue-900 via-purple-900 to-orange-900 border-2 border-white/20">
            {/* Sky / Space */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_30%,_rgba(0,0,0,0.5)_100%)]" />
            
            {/* Sun */}
            <motion.div
                className="absolute w-32 h-32 rounded-full bg-gradient-to-b from-orange-400 to-red-600 shadow-[0_0_50px_rgba(251,146,60,0.8)]"
                animate={{
                    y: [100 - (progress * 150)], // Rises with progress
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    y: { type: 'spring', damping: 20 },
                    scale: { duration: 3, repeat: Infinity }
                }}
            />

            {/* Reflections on Water */}
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-blue-950/40 backdrop-blur-sm border-t border-white/10">
                <motion.div 
                    className="w-full h-full bg-gradient-to-t from-orange-500/20 to-transparent"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>

            {/* Distant Stars */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        top: `${Math.random() * 50}%`,
                        left: `${Math.random() * 100}%`
                    }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                />
            ))}
        </div>
    );
};
