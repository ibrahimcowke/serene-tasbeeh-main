import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Target, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getNextLevel } from '@/data/achievements';

interface StatsWidgetProps {
    mini?: boolean;
}

export function StatsWidget({ mini }: StatsWidgetProps) {
    const { dailyRecords, dailyGoal, streakDays, zenMode, totalAllTime } = useTasbeehStore();
    const [todayCount, setTodayCount] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const record = dailyRecords.find(r => r.date === today);
        setTodayCount(record?.totalCount || 0);
    }, [dailyRecords]);

    if (zenMode) return null;

    const currentTotal = totalAllTime || 0;
    const currentLevel = getNextLevel(currentTotal);
    const progress = Math.min((todayCount / (dailyGoal || 100)) * 100, 100);

    if (mini) {
        return (
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                    <Flame className={`w-3 h-3 ${streakDays > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
                    <span className="text-[11px] font-bold text-foreground">{streakDays}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span className="text-[11px] font-bold text-foreground">{todayCount}</span>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 w-full"
        >
            {/* Rank Card */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-xl">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Your Rank</p>
                        <h4 className="text-base font-bold text-foreground flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                            {currentLevel.name}
                        </h4>
                    </div>
                </div>

                <div className="mt-3 relative z-10">
                    <div className="flex justify-between text-[10px] font-medium mb-1.5">
                        <span className="text-muted-foreground">Level Progress</span>
                        <span className="text-foreground">{Math.floor(currentLevel.progress * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentLevel.progress * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Trophy className="w-24 h-24" />
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                {/* Streak Badge */}
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all cursor-help group relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${streakDays > 0 ? 'bg-orange-500/10' : 'bg-muted/10'}`}>
                        <Flame className={`w-5 h-5 ${streakDays > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground">{streakDays} Days</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Best Streak</span>
                    </div>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl text-[10px] w-40 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 text-center shadow-2xl">
                        Keep counter active daily!
                    </div>
                </div>

                {/* Daily Goal Badge */}
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all group relative">
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground">{todayCount}/{dailyGoal}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Daily Goal</span>
                    </div>

                    {/* Progress overlay mini-bar */}
                    <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 opacity-50">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-medium uppercase tracking-widest">Global Activity Live</span>
            </div>
        </motion.div>
    );
}
