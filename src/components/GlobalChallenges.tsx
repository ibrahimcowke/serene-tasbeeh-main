import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, ArrowRight, Loader2, Sparkles, User } from 'lucide-react';
import { database } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { useTasbeehStore, Dhikr } from '@/store/tasbeehStore';

export type GlobalChallenge = {
    id: string;
    title: string;
    description: string;
    target: number;
    currentProgress: number;
    dhikrId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
};

// Milestone sparkle effect
function MilestoneSparkle({ progress }: { progress: number }) {
    const milestones = [25, 50, 75];
    const hitMilestone = milestones.find(m => progress >= m && progress < m + 1);

    if (!hitMilestone) return null;

    return (
        <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
        >
            {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * 360;
                const x = Math.cos((angle * Math.PI) / 180) * 25;
                const y = Math.sin((angle * Math.PI) / 180) * 12;
                return (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-primary"
                        style={{ left: `${progress}%`, top: '50%' }}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ x, y, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.03 }}
                    />
                );
            })}
        </motion.div>
    );
}

export function GlobalChallenges() {
    const [challenges, setChallenges] = useState<GlobalChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const { dhikrs, setDhikr, setTarget, currentDhikr, dailyRecords } = useTasbeehStore();

    // Calculate personal contribution from daily records
    const getMyContribution = (dhikrId: string) => {
        let total = 0;
        dailyRecords?.forEach(record => {
            if (record.counts && record.counts[dhikrId]) {
                total += record.counts[dhikrId];
            }
        });
        return total;
    };

    useEffect(() => {
        // Fetch active challenges from Realtime Database
        const challengesRef = query(ref(database, 'challenges'), orderByChild('isActive'), equalTo(true));

        const unsubscribe = onValue(challengesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const challengesList = Object.entries(data).map(([id, challenge]: [string, any]) => ({
                    id,
                    ...challenge
                })) as GlobalChallenge[];

                setChallenges(challengesList);
            } else {
                setChallenges([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching challenges:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleContribute = (challenge: GlobalChallenge) => {
        // Find the dhikr to set
        const dhikrToSet = dhikrs.find(d => d.id === challenge.dhikrId) || dhikrs[0];

        // Auto-set dhikr and a reasonable target session to contribute
        setDhikr(dhikrToSet);

        // Instead of forcing a small session, we can just close any drawers and let the user tap freely
        // The ActionBar drawer or modal holding this component will handle its own closing
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-3">
                <Target className="w-8 h-8 opacity-20" />
                <p className="text-sm">No active challenges right now.</p>
                <p className="text-xs opacity-60">Check back later for new community goals!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {challenges.map((challenge, index) => {
                    const progressPercentage = Math.min(100, Math.max(0, (challenge.currentProgress / challenge.target) * 100));
                    const isParticipating = currentDhikr.id === challenge.dhikrId;
                    const dhikr = dhikrs.find(d => d.id === challenge.dhikrId);
                    const myContribution = getMyContribution(challenge.dhikrId);

                    return (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="relative overflow-hidden bg-secondary/30 border border-border/50 rounded-[1.25rem] p-3 shadow-sm group transition-all hover:bg-secondary/50 hover:border-primary/20"
                        >
                            {/* Decorative background glow based on active state */}
                            {isParticipating && (
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] -mr-12 -mt-12 pointer-events-none" />
                            )}

                            <div className="flex justify-between items-start mb-1.5 relative z-10">
                                <div className="min-w-0">
                                    <h3 className="font-black text-foreground/90 text-xs sm:text-[13px] tracking-tight truncate">
                                        {challenge.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-0.5 text-[8px] text-muted-foreground font-black uppercase tracking-[0.15em]">
                                        <Users className="w-2.5 h-2.5 text-primary/50" />
                                        <span>Community Goal</span>
                                    </div>
                                </div>

                                {isParticipating && (
                                    <span className="shrink-0 bg-primary text-primary-foreground text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                        Active
                                    </span>
                                )}
                            </div>

                            <p className="text-[10px] text-muted-foreground leading-relaxed mb-2 relative z-10 pr-2 line-clamp-1 italic">
                                "{challenge.description}"
                            </p>

                            {/* Progress Bar Area */}
                            <div className="space-y-1.5 mb-2 relative z-10">
                                <div className="flex justify-between text-[8px] sm:text-[9px] font-black tracking-widest uppercase">
                                    <span className="text-primary/80">{challenge.currentProgress.toLocaleString()}</span>
                                    <span className="text-muted-foreground">/ {challenge.target.toLocaleString()}</span>
                                </div>

                                <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/30 relative">
                                    <MilestoneSparkle progress={progressPercentage} />
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary via-orange-400 to-primary rounded-full relative shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Your Contribution Counter */}
                            <motion.div
                                className="flex items-center justify-between p-2 rounded-xl bg-secondary/30 border border-border/50 mb-2 relative z-10"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-primary/15 flex items-center justify-center">
                                        <User className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Contribution</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <motion.span
                                        key={myContribution}
                                        initial={{ scale: 1.3, color: 'hsl(var(--primary))' }}
                                        animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                                        className="text-sm font-black font-mono"
                                    >
                                        {myContribution.toLocaleString()}
                                    </motion.span>
                                    {myContribution > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.5 }}
                                        >
                                            <Sparkles className="w-3 h-3 text-primary/60" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleContribute(challenge)}
                                disabled={isParticipating}
                                className={`w-full relative z-10 flex items-center justify-center gap-2 py-1.5 rounded-lg font-bold text-[10px] transition-all
                  ${isParticipating
                                        ? 'bg-secondary/30 text-muted-foreground cursor-default border border-transparent'
                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]'
                                    }
                `}
                            >
                                {isParticipating ? 'Active Contribution' : 'Contribute Now'}
                                {!isParticipating && <ArrowRight className="w-3 h-3 ml-1" />}
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
