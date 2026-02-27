import { motion } from 'framer-motion';

interface GalaxyProps {
    currentCount: number;
}

export function Galaxy({ currentCount }: GalaxyProps) {
    return (
        <div className="relative w-full h-full flex items-center justify-center -z-10 overflow-hidden rounded-full bg-[#050510] scale-[0.85]">
            {/* Swirling Nebula Background */}
            <motion.div
                className="absolute inset-[-50%] opacity-40"
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                    scale: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                    background: 'radial-gradient(circle at center, #2d1b4e 0%, #1a0b2e 40%, transparent 70%), radial-gradient(circle at 30% 30%, #4a1e5e 0%, transparent 50%), radial-gradient(circle at 70% 70%, #1e3a5e 0%, transparent 50%)',
                    filter: 'blur(30px)'
                }}
            />

            {/* Stars Layer */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Rotating Star Ring */}
            <motion.div
                className="absolute inset-4 rounded-full border border-white/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-300 rounded-full shadow-[0_0_8px_rgba(147,197,253,0.8)]"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 30}deg) translateY(-120px)`
                        }}
                    />
                ))}
            </motion.div>

            {/* Central Glow */}
            <motion.div
                className="absolute w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Cosmic Dust / Particles that react to count */}
            <motion.div
                key={currentCount}
                className="absolute inset-0 pointer-events-none"
            >
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.8, scale: 0, x: 0, y: 0 }}
                        animate={{
                            opacity: 0,
                            scale: 2,
                            x: (Math.random() - 0.5) * 200,
                            y: (Math.random() - 0.5) * 200
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full blur-[1px]"
                    />
                ))}
            </motion.div>
        </div>
    );
}
