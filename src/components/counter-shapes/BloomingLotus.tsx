import React from 'react';
import { motion } from 'framer-motion';

export const BloomingLotus: React.FC<{ currentCount: number }> = ({ currentCount }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Central glow */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />

            {/* Rotating container */}
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                {/* Petals */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-12 h-24 bg-gradient-to-t from-primary/80 to-primary/10 rounded-[100%] origin-bottom"
                        style={{
                            rotate: i * 45,
                            bottom: '50%',
                            transformOrigin: 'bottom center'
                        }}
                        // Breathe animation
                        animate={{
                            scaleY: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    />
                ))}
            </motion.div>

            {/* Bloom Pulse on tap */}
            <motion.div
                key={currentCount}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                {/* Inner petals popping up */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-8 h-16 bg-white/40 rounded-[100%] origin-bottom"
                        style={{ rotate: i * 60 + 30 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                ))}
            </motion.div>
        </div>
    )
}
