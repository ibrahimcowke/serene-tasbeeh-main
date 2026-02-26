import { motion } from 'framer-motion';

interface CrystalISOProps {
    currentCount: number;
}

export function CrystalISO({ currentCount }: CrystalISOProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            {/* Isometric Crystal Cube Container */}
            <div className="relative w-64 h-64 [perspective:1000px] flex items-center justify-center">

                {/* 3D Isometric Crystal Cube */}
                <motion.div
                    className="relative w-48 h-56 flex items-center justify-center"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Top Face (Diamond Shape) */}
                    <div className="absolute top-0 w-32 h-32 bg-emerald-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] [transform:rotateX(60deg)_rotateZ(45deg)] z-30 opacity-80 border-2 border-emerald-100/50" />

                    {/* Front Right Face */}
                    <div className="absolute right-[calc(50%-64px)] top-16 w-32 h-40 bg-emerald-600 [transform:skewY(30deg)] z-20 opacity-90 border-r-2 border-emerald-400/30 overflow-hidden">
                        {/* Light Refraction Polish */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    </div>

                    {/* Front Left Face */}
                    <div className="absolute left-[calc(50%-64px)] top-16 w-32 h-40 bg-emerald-800 [transform:skewY(-30deg)] z-10 opacity-90 border-l-2 border-emerald-900/40 overflow-hidden">
                        {/* Deep Internal Glow */}
                        <motion.div
                            className="absolute inset-0 bg-emerald-400/20 blur-xl"
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </div>

                    {/* Display Screen Embedded in front Faces */}
                    <div className="absolute top-28 z-40 flex flex-col items-center">
                        <div className="w-24 h-24 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center border-2 border-emerald-400/30 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                            <motion.span
                                key={currentCount}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-serif font-bold text-emerald-100 drop-shadow-[0_0_10px_rgba(167,243,208,0.8)]"
                            >
                                {currentCount}
                            </motion.span>
                        </div>
                        <span className="text-[10px] text-emerald-200 uppercase tracking-widest mt-2 font-medium opacity-60">P R I S M - X</span>
                    </div>

                    {/* Ground Shadow */}
                    <div className="absolute -bottom-16 w-48 h-12 bg-black/20 rounded-full blur-xl scale-[1.5]" />
                </motion.div>

                {/* Floating Orbiting Shards */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-6 bg-emerald-400/30 border border-emerald-200/20 rounded-sm"
                        animate={{
                            rotate: 360,
                            translateY: [0, 20, 0]
                        }}
                        style={{
                            transformOrigin: '0 110px',
                            rotate: i * 60
                        }}
                        transition={{
                            rotate: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                            translateY: { duration: 4, repeat: Infinity, delay: i * 0.5 }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
