import React from 'react';
import { motion } from 'framer-motion';

interface OrigamiCraneProps {
    progress: number;
    currentCount: number;
}

export const OrigamiCrane: React.FC<OrigamiCraneProps> = ({ progress, currentCount }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 scale-125">
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Minimalist Origami Wings */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotateY: currentCount * 10 }}
                    transition={{ type: 'spring', damping: 12 }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white/10 stroke-white/40" strokeWidth="1">
                        {/* Body */}
                        <path d="M50 20 L80 60 L50 80 L20 60 Z" />
                        
                        {/* Wing Left */}
                        <motion.path
                            d="M50 20 L10 40 L50 80"
                            animate={{ rotateY: [0, -30, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Wing Right */}
                        <motion.path
                            d="M50 20 L90 40 L50 80"
                            animate={{ rotateY: [0, 30, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Head */}
                        <path d="M50 20 L55 10 L65 15 L50 25" />
                    </svg>
                </motion.div>

                {/* Paper Texture Overlay */}
                <div className="absolute inset-4 rounded-lg bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none" />
                
                {/* Decorative Dots */}
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        style={{
                            top: i < 2 ? '0%' : '100%',
                            left: i % 2 === 0 ? '0%' : '100%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
