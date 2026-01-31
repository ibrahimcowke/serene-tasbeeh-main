import { motion } from 'framer-motion';

interface EmeraldLoopProps {
    currentCount: number;
}

export function EmeraldLoop({ currentCount }: EmeraldLoopProps) {
    const totalBeads = 33;
    const radius = 130;
    const centerX = 150;
    const centerY = 150;

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-emerald-950 rounded-full border border-emerald-800/50 shadow-2xl overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,120,87,0.3),transparent_70%)]" />

            {/* Islamic Geometric Pattern Overlay (Subtle) */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, #064e3b 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Main SVG Container */}
            <svg viewBox="0 0 300 300" className="w-full h-full relative z-10">
                {/* Connection String */}
                <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#065f46" strokeWidth="1.5" opacity="0.6" />

                {/* Beads */}
                {Array.from({ length: totalBeads }).map((_, i) => {
                    const angle = (i * 360) / totalBeads - 90; // Start from top
                    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
                    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

                    const isHighlighted = (currentCount % totalBeads) === i;
                    const isPast = i <= (currentCount % totalBeads);

                    return (
                        <motion.g key={i}>
                            {/* Glow for active bead */}
                            {isHighlighted && (
                                <motion.circle
                                    cx={x} cy={y} r="12"
                                    fill="#34d399"
                                    filter="url(#emerald-glow)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}

                            {/* Bead Body */}
                            <motion.circle
                                cx={x} cy={y}
                                r={isHighlighted ? 9 : 7}
                                fill={isHighlighted ? "#10b981" : (isPast ? "#059669" : "#064e3b")}
                                stroke={isHighlighted ? "#ecfccb" : "#047857"}
                                strokeWidth={isHighlighted ? 2 : 1}
                                animate={{ scale: isHighlighted ? 1.2 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />

                            {/* Bead Shine/Reflection */}
                            <circle cx={x - 2} cy={y - 2} r={isHighlighted ? 3 : 2} fill="white" opacity="0.2" />
                        </motion.g>
                    );
                })}

                <defs>
                    <filter id="emerald-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            {/* Central Display Background */}
            <div className="absolute w-32 h-32 rounded-full bg-emerald-900/80 border-2 border-emerald-500/30 flex items-center justify-center backdrop-blur-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-20">
                <div className="absolute inset-2 rounded-full border border-emerald-400/10" />
            </div>
        </div>
    );
}
