import { motion } from 'framer-motion';

interface GeometricMandalaProps {
    currentCount: number;
}

export function GeometricMandala({ currentCount }: GeometricMandalaProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[300px] h-[300px] relative flex items-center justify-center">
                {/* Background Rotating Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 100 100">
                        {/* 12-pointed star simplified */}
                        <path d="M50 0 L60 30 L90 20 L70 50 L90 80 L60 70 L50 100 L40 70 L10 80 L30 50 L10 20 L40 30 Z" fill="currentColor" className="text-primary" />
                    </svg>
                </motion.div>

                {/* Pulse on Tap Pattern */}
                <motion.div
                    key={currentCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-[50px] border-2 border-primary/50 rounded-full"
                />

                {/* Main Geometric Structure */}
                <div className="absolute inset-[20px] border border-primary/30 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full p-4 animate-spin-slow">
                        <polygon points="50,5 95,90 5,90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
                        <polygon points="50,95 95,10 5,10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
                    </svg>
                </div>

                {/* Center Emblem */}
                <div className="absolute w-[80px] h-[80px] bg-background/80 backdrop-blur-md rounded-full border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                    <div className="text-2xl font-bold text-primary">{currentCount}</div>
                </div>
            </div>
        </div>
    );
}
