import { motion } from 'framer-motion';

interface TallyClickerProps {
    currentCount: number;
}

export function TallyClicker({ currentCount }: TallyClickerProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            {/* Main Metal Body */}
            <div className="relative w-64 h-64 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 rounded-[60px] shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_2px_5px_rgba(255,255,255,0.8)] flex flex-col items-center justify-center border-b-[8px] border-zinc-800">

                {/* Finger Loop (Top) */}
                <div className="absolute -top-10 w-24 h-16 bg-zinc-400 rounded-t-full border-t-4 border-zinc-200 shadow-lg -z-10">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-8 bg-zinc-800 rounded-full shadow-inner" />
                </div>

                {/* Counter Window */}
                <div className="w-[85%] h-32 bg-zinc-900 rounded-2xl border-4 border-zinc-500 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden mb-4">
                    {/* Glass Glare */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none" />

                    {/* Tally Numbers (reels) */}
                    <div className="flex gap-1 h-full py-4">
                        {[...Array(4)].map((_, i) => {
                            const val = Math.floor(currentCount / Math.pow(10, 3 - i)) % 10;
                            return (
                                <div key={i} className="w-12 h-full bg-white rounded-lg flex items-center justify-center relative overflow-hidden shadow-sm">
                                    <motion.div
                                        key={val}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-4xl font-mono font-bold text-zinc-900"
                                    >
                                        {val}
                                    </motion.div>
                                    {/* Reel lines */}
                                    <div className="absolute top-0 w-full h-1 bg-zinc-200" />
                                    <div className="absolute bottom-0 w-full h-1 bg-zinc-200" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reset Knob (Right Side) */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-20 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-r-xl border-y-2 border-r-4 border-zinc-800 shadow-md">
                    <div className="w-full h-full opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)' }} />
                </div>

                {/* Tally Brand Name */}
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600/50 mt-2">Tasbeeh Tally Pro</div>
            </div>

            {/* Click Mechanism Animation (Visual highlight on body) */}
            <motion.div
                key={currentCount}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 rounded-[60px] bg-white shadow-[0_0_40px_rgba(255,255,255,0.8)] pointer-events-none"
            />
        </div>
    );
}
