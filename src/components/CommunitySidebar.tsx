import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Flame, Swords } from 'lucide-react';
import { GlobalStats } from './GlobalStats';
import { VisitorCounter } from './VisitorCounter';
import { ChallengesView } from './ChallengesView';
import { CommunityActivityFeed } from './CommunityActivityFeed';
import { CommunityLeaderboard } from './CommunityLeaderboard';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

function CommunityStreak() {
    const [streakDays, setStreakDays] = useState(0);

    useEffect(() => {
        const streakRef = ref(database, 'stats/community_streak');
        const unsubscribe = onValue(streakRef, (snap) => {
            const val = snap.val();
            if (val && typeof val === 'number') {
                setStreakDays(val);
            } else {
                // Fallback: show 1 (at least today is active)
                setStreakDays(1);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
        >
            <div className="relative">
                <Flame className="w-4 h-4 text-orange-400" />
                <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-400"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-orange-400">{streakDays}</span>
                <span className="text-[9px] font-bold text-orange-400/60 uppercase tracking-wider">
                    day{streakDays !== 1 ? 's' : ''} active
                </span>
            </div>
        </motion.div>
    );
}

export function CommunitySidebar() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-1 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 px-6 border-b border-border/50 flex justify-between items-center hover:bg-secondary/50 transition-colors cursor-pointer outline-none"
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Community</h2>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground/50" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                    )}
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
                        <div className="px-6 pb-6 space-y-4">
                            {/* Community Streak */}
                            <CommunityStreak />

                            <div className="h-px bg-border/50" />

                            {/* Leaderboard */}
                            <CommunityLeaderboard />

                            <div className="h-px bg-border/50" />

                            {/* Challenges CTA */}
                            <ChallengesView>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20 flex items-center justify-between group overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="p-2 rounded-xl bg-white/20">
                                            <Swords className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs font-black uppercase tracking-wider">Challenge a Peer</span>
                                            <span className="text-[8px] font-bold opacity-80 uppercase tracking-tighter">Race & Earn Hasanat</span>
                                        </div>
                                    </div>
                                    <ChevronUp className="w-4 h-4 rotate-90 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </motion.button>
                            </ChallengesView>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
