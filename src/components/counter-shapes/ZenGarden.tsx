import React from 'react';
import { motion } from 'framer-motion';

interface ZenGardenProps {
    progress: number;
    currentCount: number;
}

export const ZenGarden: React.FC<ZenGardenProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[#e0d7c6] rounded-full border-4 border-[#b5a68a] overflow-hidden shadow-inner scale-[0.9]">
            {/* Raked Sand Patterns (SVG Background) */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                <pattern id="sand-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                   <circle cx="5" cy="5" r="4" fill="none" stroke="#8b7e66" strokeWidth="0.5" />
                </pattern>
                <rect width="100" height="100" fill="url(#sand-pattern)" />
            </svg>

            {/* Stones that appear as progress increases */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg"
                    style={{
                        width: 20 + i * 5,
                        height: 15 + i * 4,
                        borderRadius: '45% 55% 50% 50% / 60% 40% 60% 40%',
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 3) * 20}%`,
                        rotate: i * 45
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: progress > (i / 5) ? 1 : 0.2, 
                        scale: progress > (i / 5) ? 1 : 0.8,
                        y: progress > (i / 5) ? 0 : 5
                    }}
                    transition={{ type: 'spring', damping: 12 }}
                >
                    {/* Stone texture/highlight */}
                    <div className="absolute top-1 left-2 w-1/2 h-1/4 bg-white/10 rounded-full blur-[1px]" />
                </motion.div>
            ))}

            {/* Central Bamboo Stalk that grows */}
            <motion.div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-t-full origin-bottom"
                animate={{ height: 40 + (progress * 80) }}
                transition={{ type: 'spring', damping: 15 }}
            >
                {/* Bamboo Segments */}
                <div className="absolute top-1/4 w-full h-0.5 bg-emerald-900/30" />
                <div className="absolute top-2/4 w-full h-0.5 bg-emerald-900/30" />
                <div className="absolute top-3/4 w-full h-0.5 bg-emerald-900/30" />

                {/* Leaves */}
                <motion.div 
                    className="absolute -left-6 top-4 w-6 h-2 bg-emerald-600 rounded-full origin-right -rotate-12"
                    animate={{ scale: progress > 0.3 ? 1 : 0 }}
                />
                <motion.div 
                    className="absolute -right-6 top-10 w-6 h-2 bg-emerald-600 rounded-full origin-left rotate-12"
                    animate={{ scale: progress > 0.6 ? 1 : 0 }}
                />
            </motion.div>
            
            {/* Soft Ambient Light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
        </div>
    );
};
