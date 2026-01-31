import { motion } from 'framer-motion';

interface GlassPillProps {
    currentCount: number;
}

export function GlassPill({ currentCount }: GlassPillProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden rounded-3xl">
            {/* Ambient Sunset Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />

            {/* Animated Gradient Orbs */}
            <motion.div
                className="absolute top-0 left-0 w-64 h-64 bg-orange-400/30 rounded-full blur-[80px] mix-blend-screen"
                animate={{
                    x: [-20, 20, -20],
                    y: [-20, 20, -20],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/30 rounded-full blur-[80px] mix-blend-screen"
                animate={{
                    x: [20, -20, 20],
                    y: [20, -20, 20],
                    scale: [1.2, 1, 1.2]
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-500/20 rounded-full blur-[60px] mix-blend-screen"
                animate={{
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Glass Card Container */}
            <div className="relative w-72 h-[420px] rounded-[40px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col items-center justify-between p-8 overflow-hidden">

                {/* Top header / Status bar area decoration */}
                <div className="w-full flex justify-between items-center opacity-70">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <span className="text-white/60 text-xs">●</span>
                    </div>
                    <div className="h-1 w-16 bg-white/20 rounded-full" />
                </div>

                {/* Counter Display Area */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">Count</span>
                    {/* The number is rendered in CounterVisuals, this is just the visual container */}
                    <div className="w-40 h-40 rounded-full border border-white/10 bg-gradient-to-tr from-white/5 to-transparent flex items-center justify-center shadow-inner relative">
                        <div className="absolute inset-0 rounded-full bg-white/5 blur-sm" />
                    </div>
                </div>

                {/* Pill Button Visual Indication */}
                <div className="w-full h-20 rounded-full bg-gradient-to-r from-white/20 to-white/10 border border-white/20 shadow-lg flex items-center justify-center backdrop-blur-md relative overflow-hidden group">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                    <span className="text-white font-medium tracking-wide z-10">TAP</span>
                </div>
            </div>
        </div>
    );
}
