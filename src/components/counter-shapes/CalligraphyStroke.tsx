import { motion } from 'framer-motion';

interface CalligraphyStrokeProps {
    currentCount: number;
}

export function CalligraphyStroke({ currentCount }: CalligraphyStrokeProps) {
    // Abstract brush stroke circle that completes
    // Using a rough SVG path

    const circumference = 300 * Math.PI; // approx
    const progress = (currentCount % 33) / 33;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] rotate-[-90deg]">
                <defs>
                    <filter id="brush-paper" x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                    </filter>
                    <linearGradient id="inkGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                {/* Background faint stroke */}
                <path
                    d="M 200, 200 m -160, 0 a 160,160 0 1,0 320,0 a 160,160 0 1,0 -320,0"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="20"
                    strokeLinecap="round"
                    filter="url(#brush-paper)"
                    opacity="0.3"
                />

                {/* Active Ink Stroke */}
                <motion.path
                    d="M 200, 200 m -160, 0 a 160,160 0 1,0 320,0 a 160,160 0 1,0 -320,0"
                    fill="none"
                    stroke="url(#inkGradient)" // Dark ink color
                    strokeWidth="25"
                    strokeLinecap="round"
                    strokeDasharray={1005} // Approx circumference of r=160
                    filter="url(#brush-paper)"
                    initial={{ strokeDashoffset: 1005 }}
                    animate={{ strokeDashoffset: 1005 - (progress * 1005) }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </svg>

            {/* Center ink blot */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center -z-10"
                key={currentCount}
            >
                <div className="w-48 h-48 bg-gray-100 rounded-full blur-3xl opacity-50" />
            </motion.div>
        </div>
    );
}
