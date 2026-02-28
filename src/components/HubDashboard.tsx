import { motion } from 'framer-motion';
import { Counter } from './Counter';
import { StatsWidget } from './StatsWidget';
import { GlobalStats } from './GlobalStats';
import { GlobalChallenges } from './GlobalChallenges';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Layout, Users, Trophy, TrendingUp } from 'lucide-react';

export const HubDashboard = () => {
    const { currentDhikr } = useTasbeehStore();

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-4 pt-20">
            {/* Left Sidebar: My Progress */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden xl:flex flex-col gap-6"
            >
                <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Growth</h2>
                    </div>
                    <StatsWidget />
                </div>
            </motion.div>

            {/* Center: Counter & Featured */}
            <div className="xl:col-span-2 flex flex-col gap-6 items-center">
                <div className="w-full bg-card/10 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 flex flex-col items-center">
                    <Counter />
                </div>

                <div className="w-full grid grid-cols-1 gap-6">
                    <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                        <Trophy className="w-8 h-8 text-primary mb-3" />
                        <h3 className="text-xl font-bold mb-1">New Milestone?</h3>
                        <p className="text-xs text-muted-foreground">Check your achievements to see your rank.</p>
                        <button className="mt-4 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                            View All
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Community */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
            >
                {/* Global Activity */}
                <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Live Hub</h2>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-medium uppercase">Live</span>
                        </div>
                    </div>
                    <GlobalStats />
                </div>

                {/* Global Challenges */}
                <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Community Challenges</h2>
                    <GlobalChallenges />
                </div>
            </motion.div>

            {/* Mobile Stats (visible only on small screens) */}
            <div className="xl:hidden grid grid-cols-1 gap-6 pt-4">
                <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Detailed Progress</h2>
                    <StatsWidget />
                </div>
            </div>
        </div>
    );
};
