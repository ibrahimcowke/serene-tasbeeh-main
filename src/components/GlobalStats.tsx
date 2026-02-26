import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export function GlobalStats() {
    const [liveCount, setLiveCount] = useState(0);

    // Realtime subscription to Firebase
    useEffect(() => {
        const statsRef = ref(database, 'stats/global_count');
        const unsubscribe = onValue(statsRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                setLiveCount(Number(val));
            } else {
                setLiveCount(0);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!liveCount || liveCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-0"
        >
            <div className="inline-flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Community Pulse</span>
                </div>
                <span className="font-mono font-bold text-base text-foreground">{liveCount.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">dhikrs worldwide</span>
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
