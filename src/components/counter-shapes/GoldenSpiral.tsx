import { motion } from 'framer-motion';

interface GoldenSpiralProps {
    currentCount: number;
}

export function GoldenSpiral({ currentCount }: GoldenSpiralProps) {
    // Fibonacci spiral path that fills up
    // Just a conceptual SVG spiral path
    const progress = (currentCount % 33) / 33;
    const len = 1000; // approx path length

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                    <linearGradient id="spiralGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#fcd34d" />
                    </linearGradient>
                </defs>

                {/* Spiral Path - Simplified Archimedean or approximation */}
                <path
                    d="M100,100 m0,0 
                       a5,5 0 0,1 10,0 
                       a10,10 0 0,1 -20,0 
                       a20,20 0 0,1 40,0 
                       a35,35 0 0,1 -70,0 
                       a55,55 0 0,1 110,0 
                       a80,80 0 0,1 -160,0"
                    fill="none"
                    stroke="#fcd34d"
                    strokeWidth="1"
                    opacity="0.2"
                />

                <motion.path
                    d="M100,100 m0,0 
                       a5,5 0 0,1 10,0 
                       a10,10 0 0,1 -20,0 
                       a20,20 0 0,1 40,0 
                       a35,35 0 0,1 -70,0 
                       a55,55 0 0,1 110,0 
                       a80,80 0 0,1 -160,0"
                    fill="none"
                    stroke="url(#spiralGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    initial={{ strokeDashoffset: 1 }}
                    animate={{ strokeDashoffset: 1 - progress }}
                    transition={{ type: "spring", stiffness: 40, damping: 20 }}
                />
            </svg>
        </div>
    );
}
