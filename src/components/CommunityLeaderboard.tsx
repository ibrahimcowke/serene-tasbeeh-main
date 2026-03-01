import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal, Award, TrendingUp, User } from 'lucide-react';
import { database } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMuslimAvatarUrl } from '@/lib/avatarUtils';

interface LeaderboardEntry {
    id: string;
    user_id: string;
    avatar_url?: string;
    display_name: string;
    count: number;
    rank: number;
}

const rankIcons = [Crown, Medal, Award];
const rankColors = [
    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    'text-slate-300 bg-slate-400/10 border-slate-400/20',
    'text-amber-600 bg-amber-600/10 border-amber-600/20',
];

export function CommunityLeaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [myCount, setMyCount] = useState(0);

    const myDeviceId = localStorage.getItem('visitor_device_id') || 'anon';

    useEffect(() => {
        const leaderboardRef = query(
            ref(database, 'leaderboard/weekly'),
            orderByChild('count'),
            limitToLast(5)
        );

        const unsubscribe = onValue(leaderboardRef, (snap) => {
            const val = snap.val();
            if (val) {
                const entryList = Object.entries(val)
                    .map(([id, entry]: [string, any]) => ({
                        id,
                        ...entry,
                    }))
                    .sort((a, b) => (b.count || 0) - (a.count || 0))
                    .map((entry, idx) => ({
                        ...entry,
                        rank: idx + 1,
                        display_name: entry.display_name || `Peer ${idx + 1}`,
                    })) as LeaderboardEntry[];

                setEntries(entryList);

                // Find my rank
                const myEntry = entryList.find(e => e.user_id === myDeviceId);
                if (myEntry) {
                    setMyRank(myEntry.rank);
                    setMyCount(myEntry.count);
                }
            }
        });

        return () => unsubscribe();
    }, [myDeviceId]);

    if (entries.length === 0) {
        return (
            <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 flex items-center gap-1.5 px-1">
                    <TrendingUp className="w-3 h-3 text-yellow-400/60" />
                    Weekly Leaderboard
                </span>
                <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
                    <Crown className="w-6 h-6 text-muted-foreground/20" />
                    <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                        Start counting to<br />appear on the board
                    </span>
                </div>
            </div>
        );
    }

    const maxCount = entries[0]?.count || 1;

    return (
        <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 flex items-center gap-1.5 px-1">
                <TrendingUp className="w-3 h-3 text-yellow-400/60" />
                Weekly Leaderboard
            </span>

            <div className="space-y-1.5">
                <AnimatePresence>
                    {entries.slice(0, 5).map((entry, idx) => {
                        const RankIcon = rankIcons[idx] || User;
                        const colorClass = rankColors[idx] || 'text-muted-foreground bg-secondary/20 border-border/30';
                        const isMe = entry.user_id === myDeviceId;
                        const barWidth = Math.max(10, (entry.count / maxCount) * 100);

                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${isMe
                                        ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
                                        : `bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]`
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${colorClass}`}>
                                    {idx < 3 ? (
                                        <RankIcon className="w-3 h-3" />
                                    ) : (
                                        <span className="text-[9px] font-black">{entry.rank}</span>
                                    )}
                                </div>

                                {/* Avatar */}
                                <Avatar className="w-6 h-6 border border-white/10">
                                    <AvatarImage src={entry.avatar_url || getMuslimAvatarUrl(entry.user_id)} />
                                    <AvatarFallback className="bg-primary/20 text-[8px] text-primary font-bold">
                                        {entry.display_name?.charAt(0) || '?'}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Name + Bar */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className={`text-[10px] font-bold truncate ${isMe ? 'text-primary' : 'text-foreground/80'}`}>
                                            {isMe ? 'You' : entry.display_name}
                                        </span>
                                        <span className="text-[9px] font-mono font-bold text-muted-foreground">
                                            {entry.count?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-secondary/30 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${idx === 0
                                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                                                    : idx === 1
                                                        ? 'bg-gradient-to-r from-slate-400 to-slate-300'
                                                        : idx === 2
                                                            ? 'bg-gradient-to-r from-amber-700 to-amber-500'
                                                            : 'bg-primary/40'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${barWidth}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Your Rank card if not in top 5 */}
                {myRank && myRank > 5 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-primary/5 border border-primary/20 mt-1"
                    >
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20">
                            <span className="text-[9px] font-black text-primary">{myRank}</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary flex-1">Your Rank</span>
                        <span className="text-[9px] font-mono font-bold text-muted-foreground">
                            {myCount.toLocaleString()}
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
