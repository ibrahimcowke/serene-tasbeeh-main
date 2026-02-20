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

                // Filter out expired challenges just in case they are still marked active
                const now = new Date();
                const validChallenges = challengesList.filter(c => new Date(c.endDate) >= now);

                setChallenges(validChallenges);
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
                            className="relative overflow-hidden bg-card border border-border/50 rounded-2xl p-4 sm:p-5 shadow-sm group"
                        >
                            {/* Decorative background glow based on active state */}
                            {isParticipating && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            )}

                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div>
                                    <h3 className="font-semibold text-foreground text-base sm:text-lg tracking-tight">
                                        {challenge.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-medium">
                                        <Users className="w-3.5 h-3.5 text-primary/70" />
                                        <span>Community Goal</span>
                                    </div>
                                </div>

                                {isParticipating && (
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Active Mode
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground/80 leading-relaxed mb-4 relative z-10 pr-4">
                                {challenge.description}
                                {dhikr && <span className="block mt-1 font-arabic text-right text-lg text-foreground/70">{dhikr.arabic}</span>}
                            </p>

                            {/* Progress Bar Area */}
                            <div className="space-y-2 mb-5 relative z-10">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-foreground">{challenge.currentProgress.toLocaleString()}</span>
                                    <span className="text-muted-foreground">/ {challenge.target.toLocaleString()}</span>
                                </div>

                                <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    >
                                        {/* Shimmer effect on progress bar */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    </motion.div>
                                </div>

                                <div className="flex justify-end text-[10px] text-muted-foreground font-medium">
                                    {progressPercentage.toFixed(1)}% Completed
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleContribute(challenge)}
                                disabled={isParticipating}
                                className={`w-full relative z-10 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all
                  ${isParticipating
                                        ? 'bg-secondary/50 text-muted-foreground cursor-default border border-transparent'
                                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]'
                                    }
                `}
                            >
                                {isParticipating ? 'Currently Contributing' : 'Contribute Now'}
                                {!isParticipating && <ArrowRight className="w-4 h-4 ml-1" />}
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
