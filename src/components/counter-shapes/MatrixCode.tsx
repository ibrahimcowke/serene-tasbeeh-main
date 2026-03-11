import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MatrixCodeProps {
    progress: number;
    currentCount: number;
}

export const MatrixCode: React.FC<MatrixCodeProps> = ({ progress, currentCount }) => {
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const [columns, setColumns] = useState<string[]>(Array(10).fill(''));

    useEffect(() => {
        const interval = setInterval(() => {
            setColumns(prev => prev.map(() => 
                characters[Math.floor(Math.random() * characters.length)]
            ));
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-black rounded-full border-2 border-emerald-900/50 overflow-hidden font-mono shadow-[inset_0_0_30px_rgba(0,0,0,1)]">
            {/* Rain Effect */}
            <div className="flex justify-around w-full h-full p-4 opacity-40">
                {columns.map((char, i) => (
                    <motion.div
                        key={i}
                        className="flex flex-col text-[10px] text-emerald-500 font-bold"
                        animate={{ y: [-100, 200] }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 2
                        }}
                    >
                        <span>{char}</span>
                        <span>{characters[Math.floor(Math.random() * characters.length)]}</span>
                        <span>{characters[Math.floor(Math.random() * characters.length)]}</span>
                        <span className="text-white text-glow shadow-[0_0_8px_#10b981]">{char}</span>
                    </motion.div>
                ))}
            </div>

            {/* Scanning Line */}
            <motion.div 
                className="absolute inset-x-0 h-[10%] bg-emerald-500/10 blur-xl"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Target Display */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-sm" />
            </div>

            <style>{`
                .text-glow {
                    text-shadow: 0 0 8px #10b981, 0 0 12px #10b981;
                }
            `}</style>
        </div>
    );
};
