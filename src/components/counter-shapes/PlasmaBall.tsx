import React from 'react';
import { motion } from 'framer-motion';

interface PlasmaBallProps {
    progress: number;
    currentCount: number;
}

export const PlasmaBall: React.FC<PlasmaBallProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 scale-110">
            {/* Outer Glass Sphere */}
            <div className="w-64 h-64 rounded-full border-2 border-white/20 bg-gradient-to-tr from-purple-900/40 to-blue-900/40 relative overflow-hidden backdrop-blur-sm shadow-[inset_0_0_50px_rgba(168,85,247,0.3)]">
                {/* Center Core */}
                <motion.div
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white shadow-[0_0_30px_#fff,0_0_60px_#a855f7]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Electric Arcs */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-32 h-1 bg-gradient-to-r from-white via-purple-400 to-transparent origin-left blur-[1px]"
                        style={{ transform: `rotate(${i * 60}deg)` }}
                        animate={{
                            rotate: [i * 60, i * 60 + (Math.random() - 0.5) * 45, i * 60],
                            opacity: [0.2, 1, 0.4, 1, 0.2],
                            scaleX: [1, 1.2, 0.8, 1.1, 1],
                        }}
                        transition={{
                            duration: 0.1 + Math.random() * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                      {/* Little bolt tips */}
                      <motion.div 
                        className="absolute right-0 w-2 h-2 rounded-full bg-blue-300 blur-sm"
                        animate={{ x: [0, 5, -5, 0] }}
                        transition={{ duration: 0.05, repeat: Infinity }}
                      />
                    </motion.div>
                ))}

                {/* Reaction Spark on Tapping */}
                <motion.div
                   key={currentCount}
                   className="absolute inset-0 bg-white/10"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
};
