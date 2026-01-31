import { motion } from 'framer-motion';

interface KaabaCompassProps {
    currentCount: number;
}

export function KaabaCompass({ currentCount }: KaabaCompassProps) {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Rotating Geometric Background */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 border-[1px] border-amber-500/20 rounded-full scale-110" />
                <div className="absolute inset-0 border-[1px] border-amber-500/10 rounded-full scale-125 border-dashed" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent absolute" />
                </div>
            </motion.div>

            {/* Pulsing Kaaba Representation */}
            <motion.div
                className="relative w-32 h-32 bg-black rounded-lg shadow-2xl flex items-center justify-center z-10"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
                animate={{
                    scale: [1, 1.02, 1],
                    y: [0, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Gold Band */}
                <div className="absolute top-4 left-0 right-0 h-4 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 opacity-90 shadow-lg" />

                {/* Minimal door hint */}
                <div className="absolute bottom-0 right-6 w-8 h-14 bg-neutral-900 border-t border-l border-r border-amber-500/30 rounded-t-sm" />

                {/* Texture/Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arches.png')] opacity-10 mix-blend-overlay" />
            </motion.div>

            {/* Progress Ring around */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 120}
                    initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 120 - ((currentCount % 33) / 33) * (2 * Math.PI * 120) }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
