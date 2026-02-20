import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Target, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatsWidget() {
    const { dailyRecords, dailyGoal, streakDays, zenMode } = useTasbeehStore();
    const [todayCount, setTodayCount] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const record = dailyRecords.find(r => r.date === today);
        setTodayCount(record?.totalCount || 0);
    }, [dailyRecords]);

    if (zenMode) return null;

    const progress = Math.min((todayCount / (dailyGoal || 100)) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-row lg:flex-col items-center justify-center gap-2 sm:gap-3 px-4 py-1"
        >
            {/* Streak Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-white/10 shadow-sm hover:bg-background/50 transition-colors cursor-help group relative">
                <Flame className={`w-3.5 h-3.5 ${streakDays > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">
                    {streakDays} <span className="text-[10px] opacity-70">Day Streak</span>
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-card/90 backdrop-blur-xl border border-border rounded-xl text-xs w-40 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    Keep your streak alive by completing your daily goal!
                </div>
            </div>

            {/* Daily Goal Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-white/10 shadow-sm hover:bg-background/50 transition-colors group relative">
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-blue-500 absolute" />
                    <svg className="w-5 h-5 absolute -rotate-90" viewBox="0 0 24 24">
                        <circle
                            className="text-blue-500/10"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="10"
                            cx="12"
                            cy="12"
                        />
                        <circle
                            className="text-blue-500"
                            strokeWidth="3"
                            strokeDasharray={63}
                            strokeDashoffset={63 - (progress / 100) * 63}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="10"
                            cx="12"
                            cy="12"
                        />
                    </svg>
                </div>
                <span className="text-xs font-medium text-foreground/90 whitespace-nowrap">
                    {todayCount} <span className="text-[10px] opacity-70">/ {dailyGoal} Today</span>
                </span>
            </div>
        </motion.div>
    );
}
