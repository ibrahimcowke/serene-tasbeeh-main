import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GlobalStats } from './GlobalStats';
import { GlobalChallenges } from './GlobalChallenges';
import { VisitorCounter } from './VisitorCounter';

export function CommunitySidebar() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-1 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 border-b border-border/50 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer outline-none"
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Community</h2>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground/50" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Live</span>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 px-6 pb-6 space-y-6">
                            {/* Make it more real by adding the Live Visitor Counter here visually too */}
                            <div className="flex flex-col items-center gap-0">
                                <VisitorCounter />
                                <GlobalStats />
                            </div>

                            <div className="h-px bg-white/5" />

                            <GlobalChallenges />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
