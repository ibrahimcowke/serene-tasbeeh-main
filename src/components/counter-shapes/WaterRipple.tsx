import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WaterRippleProps {
    currentCount: number;
}

export function WaterRipple({ currentCount }: WaterRippleProps) {
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    useEffect(() => {
        // Add a new ripple on count change
        const newRipple = {
            id: Date.now(),
            x: 128, // Center
            y: 128  // Center
        };
        setRipples(prev => [...prev.slice(-4), newRipple]); // Keep last 5
    }, [currentCount]);

    return (
        <div className="relative w-64 h-64 rounded-full bg-cyan-900/20 flex items-center justify-center overflow-hidden border border-cyan-500/10 backdrop-blur-sm">
            {/* Base Water Texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-blue-600/10" />

            {/* Ripples */}
            <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                    {ripples.map((ripple) => (
                        <motion.div
                            key={ripple.id}
                            className="absolute rounded-full border border-cyan-400/50"
                            style={{
                                left: ripple.x,
                                top: ripple.y,
                                x: '-50%',
                                y: '-50%'
                            }}
                            initial={{ width: 0, height: 0, opacity: 0.8, borderWidth: 4 }}
                            animate={{ width: 200, height: 200, opacity: 0, borderWidth: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Central 'Stone' / Counter */}
            <motion.div
                className="relative z-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Inner wet look */}
                <div className="absolute inset-2 rounded-full border border-white/10" />
                <div className="absolute top-4 left-4 w-6 h-3 bg-white/30 rounded-full blur-[2px] -rotate-12" />
            </motion.div>
        </div>
    );
}
