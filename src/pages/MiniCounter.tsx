import { useEffect } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, RefreshCw, X } from 'lucide-react';

export default function MiniCounter() {
    const {
        currentCount,
        increment,
        decrement,
        reset,
        currentDhikr,
        theme
    } = useTasbeehStore();

    // Apply theme to body
    useEffect(() => {
        document.documentElement.className = theme;
        // Force overflow hidden on body for mini mode
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [theme]);

    return (
        <div className="h-screen h-dvh min-h-svh w-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="pattern-mini" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" className="text-foreground" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern-mini)" />
                </svg>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center bg-background/50 backdrop-blur-sm z-20 drag-handle">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Mini Mode</span>
                <div className="flex gap-2">
                    <button onClick={reset} className="p-1.5 hover:bg-muted rounded-full transition-colors">
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {/* Close button not strictly needed as window close works, but good UX */}
                    <button onClick={() => window.close()} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Dhikr Text */}
            <div className="relative z-10 text-center mb-6 mt-8">
                <h2 className="text-xl font-bold text-foreground mb-1 leading-relaxed" dir="auto">
                    {currentDhikr.arabic}
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-1 opacity-80">
                    {currentDhikr.transliteration}
                </p>
            </div>

            {/* Counter */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-[200px]">
                <button
                    onClick={increment}
                    className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center relative active:scale-95 transition-all duration-100 group shadow-lg shadow-primary/5 hover:border-primary/30 hover:bg-primary/15"
                >
                    <span className="text-4xl font-mono font-bold text-primary tabular-nums">
                        {currentCount}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                </button>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={decrement}
                        disabled={currentCount === 0}
                        className="p-3 rounded-full bg-muted/50 hover:bg-muted border border-border transition-colors disabled:opacity-30"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={increment}
                        className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground/50 absolute bottom-2 font-mono">
                Serene Tasbeeh
            </p>
        </div>
    );
}
