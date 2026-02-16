import { useTasbeehStore } from '@/store/tasbeehStore';
import { useEffect, useState } from 'react';
import { Globe, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export function GlobalStats() {
    const { globalCount, fetchGlobalCount } = useTasbeehStore();
    const [liveCount, setLiveCount] = useState(globalCount);

    // Initial fetch
    useEffect(() => {
        fetchGlobalCount();
    }, []);

    // Sync local state with store state (which gets optimistic updates)
    useEffect(() => {
        setLiveCount(globalCount);
    }, [globalCount]);

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel('global_stats')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'global_stats',
                    filter: 'id=eq.1'
                },
                (payload) => {
                    const newTotal = payload.new.total_count;
                    setLiveCount(Number(newTotal));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!liveCount || liveCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-2"
        >
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-500/20 p-1.5 rounded-full animate-pulse">
                        <Globe className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Community Pulse</span>
                        <div className="flex items-baseline gap-1">
                            <AnimatePresence mode="popLayout">
                                {liveCount.toString().split('').map((digit, index) => (
                                    <motion.span
                                        key={`${index}-${digit}`}
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -5, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="font-mono font-bold text-sm text-foreground"
                                    >
                                        {digit}
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            <span className="text-xs text-muted-foreground ml-1">dhikrs</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/50 border border-white/5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">Live</span>
                </div>
            </div>
        </motion.div>
    );
}
