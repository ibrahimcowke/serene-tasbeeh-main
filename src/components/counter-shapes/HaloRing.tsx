import { motion } from 'framer-motion';

interface HaloRingProps {
    progress: number;
    currentCount: number;
}

export function HaloRing({ progress, currentCount }: HaloRingProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[300px] h-[300px] relative flex items-center justify-center">
                {/* Outer Glow Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-[2px] border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Main Rotating Ring 1 */}
                <motion.div
                    className="absolute inset-[20px] rounded-full border-[10px] border-teal-500/30 border-t-teal-400 border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Counter Rotating Ring 2 */}
                <motion.div
                    className="absolute inset-[40px] rounded-full border-[8px] border-emerald-500/20 border-b-emerald-400 border-r-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Progress Ring */}
                <svg className="absolute inset-[60px] w-[180px] h-[180px] -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-emerald-900/30"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        strokeDasharray="289"
                        initial={{ strokeDashoffset: 289 }}
                        animate={{ strokeDashoffset: 289 - (289 * progress) }}
                        strokeLinecap="round"
                        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    />
                </svg>

                {/* Center Particle Field */}
                <div className="absolute inset-[80px] rounded-full bg-emerald-900/10 backdrop-blur-sm overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                            initial={{ x: "50%", y: "50%", opacity: 0 }}
                            animate={{
                                x: `${Math.random() * 100}%`,
                                y: `${Math.random() * 100}%`,
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
