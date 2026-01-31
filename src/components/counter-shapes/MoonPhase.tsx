import { motion } from 'framer-motion';

interface MoonPhaseProps {
    currentCount: number;
}

export function MoonPhase({ currentCount }: MoonPhaseProps) {
    // 33 counts mapping to moon phases implies filling up the moon
    // Simple clipping approach:
    // A full circle background (shadow)
    // A circle filling up from left to right or a mask that simulates phase change

    // Simplified visual representation: Clipping rect moving across
    const progress = (currentCount % 33) / 33;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Starfield Background */}
            <div className="absolute inset-0 rounded-full bg-slate-950 overflow-hidden shadow-2xl border border-slate-800">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 1,
                            height: Math.random() * 2 + 1,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random()
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* The Moon */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                {/* Dark side (base) */}
                <div className="absolute inset-0 bg-slate-900" />

                {/* Lit side (progress) */}
                {/* Using a clip-path or width/translate would be simpler than true phase math for this stylized counter */}
                <motion.div
                    className="absolute inset-0 bg-slate-200"
                    initial={{ x: '-100%' }}
                    animate={{ x: `${(progress * 100) - 100}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                    {/* Craters Texture */}
                    <div className="absolute top-8 left-10 w-6 h-6 rounded-full bg-slate-300 opacity-50" />
                    <div className="absolute bottom-10 right-12 w-10 h-10 rounded-full bg-slate-300 opacity-50" />
                    <div className="absolute top-16 right-8 w-4 h-4 rounded-full bg-slate-300 opacity-50" />
                </motion.div>

                {/* Pseudo-3D shading overlay */}
                <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_5px_5px_20px_rgba(255,255,255,0.2)] pointer-events-none" />
            </div>

            {/* Glow halo */}
            <motion.div
                className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl -z-10"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </div>
    );
}
