import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useMemo } from 'react';
import { BarChart, Activity, Calendar } from 'lucide-react';

export function StatisticsView() {
    const { dailyRecords, totalAllTime, streakDays } = useTasbeehStore();

    const weeklyData = useMemo(() => {
        const today = new Date();
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const record = dailyRecords.find(r => r.date === dateStr);
            last7Days.push({
                date: dateStr,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                count: record ? record.totalCount : 0
            });
        }
        return last7Days;
    }, [dailyRecords]);

    const maxCount = Math.max(...weeklyData.map(d => d.count), 10); // Minimum scale of 10

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/50 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Activity className="w-5 h-5 text-primary mb-2 opacity-80" />
                    <span className="text-2xl font-bold">{totalAllTime}</span>
                    <span className="text-xs text-muted-foreground">Total Dhikr</span>
                </div>
                <div className="bg-card/50 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Calendar className="w-5 h-5 text-orange-400 mb-2 opacity-80" />
                    <span className="text-2xl font-bold">{streakDays}</span>
                    <span className="text-xs text-muted-foreground">Day Streak</span>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-card/30 p-5 rounded-3xl border border-border/50">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Last 7 Days</h3>
                </div>

                <div className="flex items-end justify-between h-40 gap-2">
                    {weeklyData.map((day, index) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full relative flex items-end justify-center h-full rounded-t-lg bg-muted/20 overflow-hidden">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.count / maxCount) * 100}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
                                    className={`w-full mx-1 rounded-t-lg bg-primary/80 group-hover:bg-primary transition-colors min-h-[4px] ${day.count === 0 ? 'opacity-20' : ''}`}
                                />
                                {/* Tooltip-ish number */}
                                {day.count > 0 && (
                                    <span className="absolute -top-6 text-[10px] font-medium bg-background/80 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {day.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase">{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
