import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, ArrowRight, Loader2 } from 'lucide-react';
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

export function GlobalChallenges() {
    const [challenges, setChallenges] = useState<GlobalChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const { dhikrs, setDhikr, setTarget, currentDhikr } = useTasbeehStore();

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

                    return (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative overflow-hidden bg-card border border-border/50 rounded-2xl p-3 sm:p-4 shadow-sm group"
                        >
                            {/* Decorative background glow based on active state */}
                            {isParticipating && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            )}

                            <div className="flex justify-between items-start mb-1 relative z-10">
                                <div className="min-w-0">
                                    <h3 className="font-bold text-foreground text-sm sm:text-base tracking-tight truncate">
                                        {challenge.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                                        <Users className="w-2.5 h-2.5 text-primary/70" />
                                        <span>Community Goal</span>
                                    </div>
                                </div>

                                {isParticipating && (
                                    <span className="shrink-0 bg-primary/10 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                        Active
                                    </span>
                                )}
                            </div>

                            <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed mb-3 relative z-10 pr-2 line-clamp-2">
                                {challenge.description}
                            </p>

                            {/* Progress Bar Area */}
                            <div className="space-y-1 mb-3 relative z-10">
                                <div className="flex justify-between text-[9px] sm:text-[10px] font-medium">
                                    <span className="text-foreground">{challenge.currentProgress.toLocaleString()}</span>
                                    <span className="text-muted-foreground">/ {challenge.target.toLocaleString()}</span>
                                </div>

                                <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    </motion.div>
                                </div>

                                <div className="flex justify-end text-[8px] text-muted-foreground font-medium">
                                    {progressPercentage.toFixed(1)}%
                                </div>
                            </div>

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
