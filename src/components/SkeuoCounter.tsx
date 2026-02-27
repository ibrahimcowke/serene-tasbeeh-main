import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, Undo2, Layers } from 'lucide-react';

interface SkeuoCounterProps {
    count: number;
    total: number;
    dhikrName: string;
    onIncrement: () => void;
    onReset: () => void;
    onUndo: () => void;
}

export const SkeuoCounter = ({ count, total, dhikrName, onIncrement, onReset, onUndo }: SkeuoCounterProps) => {
    // Format count to 4 digits
    const formattedCount = count.toString().padStart(4, '0').split('');

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center mb-1">
                <span className="text-[10px] font-black tracking-[.3em] uppercase text-primary/60 mb-0.5">Current Session</span>
                <h2 className="text-sm font-bold text-white/50 tracking-widest">{dhikrName} ({total} RECITE)</h2>
            </div>

            <motion.div
                className="relative mechanical-metal p-1 rounded-xl group cursor-pointer"
                whileTap={{ y: 2 }}
                onClick={onIncrement}
            >
                {/* Metal Plate with Screws */}
                <div className="bg-[#1a1a1a] rounded-lg p-4 relative overflow-hidden flex flex-col items-center border-t border-white/10 border-b border-black shadow-2xl">
                    {/* Decorative Screws */}
                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner" />

                    {/* Digit Display */}
                    <div className="flex gap-1 bg-black/40 p-3 rounded-md border border-white/5 shadow-inner">
                        {formattedCount.map((digit, i) => (
                            <div key={i} className="w-10 h-16 bg-gradient-to-b from-[#222] to-[#000] rounded-sm flex items-center justify-center border-x border-white/5 relative overflow-hidden">
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={digit}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="text-4xl font-mono font-black text-white/90"
                                    >
                                        {digit}
                                    </motion.span>
                                </AnimatePresence>
                                {/* Gloss effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent pointer-events-none" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex flex-col items-center">
                        <div className="h-0.5 w-full bg-primary/20 rounded-full mb-1" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{count} of {total}</span>
                    </div>
                </div>
            </motion.div>

            {/* Small round buttons */}
            <div className="flex gap-4 bg-[#222] p-2 rounded-full border border-white/5 shadow-xl scale-90 z-20">
                <button
                    onClick={(e) => { e.stopPropagation(); onUndo(); }}
                    className="p-3 hover:bg-white/5 rounded-full text-white/40 transition-colors"
                >
                    <Undo2 className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onReset(); }}
                    className="p-3 hover:bg-white/5 rounded-full text-white/40 transition-colors relative"
                >
                    <RefreshCw className="w-5 h-5" />
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                </button>
                <button className="p-3 hover:bg-white/5 rounded-full text-white/40 transition-colors">
                    <Layers className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
