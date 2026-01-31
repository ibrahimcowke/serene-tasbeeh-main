import { motion } from 'framer-motion';

interface LanternFanousProps {
    currentCount: number;
}

export function LanternFanous({ currentCount }: LanternFanousProps) {
    // A simplified Fanous lantern SVG that glows based on modulo
    const brightness = ((currentCount % 33) / 33) + 0.2; // Min 0.2, Max 1.2

    return (
        <div className="relative w-48 h-64 flex flex-col items-center justify-center">
            {/* Hanging String */}
            <div className="absolute top-0 w-1 h-10 bg-amber-900/50" />

            {/* Lantern SVG */}
            <motion.svg
                viewBox="0 0 100 160"
                className="w-full h-full drop-shadow-2xl"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Top Cap */}
                <path d="M30,40 L70,40 L60,20 L40,20 Z" fill="#451a03" />

                {/* Main Glass Body */}
                <path d="M20,60 L80,60 L90,100 L80,140 L20,140 L10,100 Z" fill="rgba(80, 50, 0, 0.6)" stroke="#451a03" strokeWidth="2" />

                {/* Inner Glow Light */}
                <motion.circle
                    cx="50" cy="100" r="20"
                    fill="#fbbf24"
                    animate={{ opacity: brightness, scale: brightness }}
                    filter="url(#glowBlur)"
                />

                {/* Metal Bars */}
                <line x1="20" y1="60" x2="20" y2="140" stroke="#451a03" strokeWidth="2" />
                <line x1="80" y1="60" x2="80" y2="140" stroke="#451a03" strokeWidth="2" />
                <line x1="10" y1="100" x2="90" y2="100" stroke="#451a03" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="10" stroke="#451a03" strokeWidth="3" />
                {/* Ring */}
                <circle cx="50" cy="10" r="5" fill="none" stroke="#451a03" strokeWidth="2" />

                <defs>
                    <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </motion.svg>

            {/* Floor Reflection */}
            <motion.div
                className="absolute bottom-0 w-32 h-8 bg-amber-500/30 rounded-[100%] blur-xl"
                animate={{ opacity: brightness * 0.5, scale: brightness }}
            />
        </div>
    );
}
