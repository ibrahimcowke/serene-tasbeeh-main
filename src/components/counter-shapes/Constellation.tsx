import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const Constellation: React.FC<{ currentCount: number }> = ({ currentCount }) => {
    // Generate star positions deterministically
    const stars = useMemo(() => {
        return [...Array(12)].map((_, i) => ({
            x: ((i * 37) % 80) + 10, // 10-90%
            y: ((i * 59) % 80) + 10, // 10-90%
            size: ((i * 13) % 3) + 2 // 2-4px
        }));
    }, []);

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connections */}
                {stars.map((star, i) => {
                    const nextStar = stars[(i + 1) % stars.length];
                    return (
                        <motion.line
                            key={i}
                            x1={`${star.x}%`}
                            y1={`${star.y}%`}
                            x2={`${nextStar.x}%`}
                            y2={`${nextStar.y}%`}
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-primary/30"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: [0, 1, 1, 0] }}
                            transition={{ duration: 5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                        />
                    );
                })}
            </svg>

            {/* Stars */}
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full shadow-[0_0_5px_white]"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size
                    }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                    transition={{ duration: 2 + (i % 3), repeat: Infinity }}
                />
            ))}

            {/* Interaction Pulse */}
            <motion.div
                key={currentCount}
                className="absolute w-full h-full pointer-events-none"
            >
                <motion.div
                    className="absolute bg-primary/50 blur-xl rounded-full"
                    style={{
                        left: `${stars[currentCount % stars.length].x}%`,
                        top: `${stars[currentCount % stars.length].y}%`,
                        width: '20px',
                        height: '20px',
                        x: '-50%',
                        y: '-50%'
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </motion.div>
        </div>
    )
}
