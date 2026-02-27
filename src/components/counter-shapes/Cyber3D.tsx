import { motion } from 'framer-motion';

interface Cyber3DProps {
    currentCount: number;
}

export function Cyber3D({ currentCount }: Cyber3DProps) {
    return (
        <div className="relative w-full h-full flex items-center justify-center -z-10 [perspective:1000px]">
            {/* Holographic Base Plate */}
            <motion.div
                className="relative w-64 h-64 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-[20px] shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center [transform-style:preserve-3d] scale-[0.85]"
                animate={{ rotateX: 15, rotateY: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Floating Circuitry / HUD Elements */}
                <div className="absolute inset-2 border border-cyan-500/20 rounded-[15px] dashed-border pointer-events-none" />

                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]" />

                {/* Animated Data Rings */}
                <motion.div
                    className="absolute w-48 h-48 border border-cyan-300/40 rounded-full border-dashed"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-40 h-40 border border-cyan-300/20 rounded-full border-dotted"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Central Display Panel */}
                <div className="relative w-[80%] h-32 bg-cyan-950/40 backdrop-blur-md rounded-xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_0_10px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center overflow-hidden">
                    {/* Scanning Line Effect */}
                    <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Glitch Grid Overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

                    <span className="text-[10px] text-cyan-400 font-mono tracking-[0.4em] mb-1 opacity-70">SYSTEM STATUS: ONLINE</span>

                    {/* Digital Numbers */}
                    <motion.div
                        key={currentCount}
                        initial={{ scale: 1.2, opacity: 0.5, filter: 'blur(5px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        className="text-5xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    >
                        {currentCount.toString().padStart(4, '0')}
                    </motion.div>
                </div>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-4 left-6 right-6 flex justify-between">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-1.5 bg-cyan-500"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                    <span className="text-[8px] text-cyan-500 font-mono">CORE_TASB_V1.3</span>
                </div>
            </motion.div>

            {/* Floating Debris Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                        style={{
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
