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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-2"
        >
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Community Pulse</span>
                    <span className="font-mono font-bold text-xs text-foreground">{liveCount.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground">dhikrs</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">Live</span>
                </div>
            </div>
        </motion.div>
    );
}
