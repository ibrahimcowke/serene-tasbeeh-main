import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Award, Flame, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface StatsViewProps {
    children: React.ReactNode;
}

export function StatsView({ children }: StatsViewProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Statistics</SheetTitle>
                </SheetHeader>
                <StatsViewContent />
            </SheetContent>
        </Sheet>
    );
}

export function StatsViewContent() {
    const { dailyRecords: history, dailyGoal = 100, streakDays } = useTasbeehStore();

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = history.find(h => h.date === today);
    const todayCount = todayRecord?.totalCount || 0;
    const todayProgress = dailyGoal > 0 ? Math.min((todayCount / dailyGoal) * 100, 100) : 0;

    // Last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const record = history.find(h => h.date === dateStr);
        return {
            date: dateStr,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count: record?.totalCount || 0,
        };
    }).reverse();

    // Last 30 days data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const record = history.find(h => h.date === dateStr);
        return {
            date: dateStr,
            count: record?.totalCount || 0,
        };
    }).reverse();

    const totalAllTime = history.reduce((sum, record) => sum + record.totalCount, 0);
    const averageDaily = history.length > 0 ? Math.round(totalAllTime / history.length) : 0;
    const maxInDay = Math.max(...history.map(h => h.totalCount), 0);
    const weekTotal = last7Days.reduce((sum, day) => sum + day.count, 0);
    const monthTotal = last30Days.reduce((sum, day) => sum + day.count, 0);

    const currentStreakDays = streakDays;

    const maxValue = Math.max(...last7Days.map(d => d.count), 1);

    return (
        <div className="overflow-y-auto space-y-6 pb-24 h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div>
                    <p className="text-muted-foreground">Track your spiritual journey</p>
                </div>

                {/* Today's Progress */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Today's Progress
                        </CardTitle>
                        <CardDescription>
                            {todayCount} / {dailyGoal} dhikr
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={todayProgress} className="h-3 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            {todayProgress >= 100 ? '🎉 Goal achieved!' : `${Math.round(todayProgress)}% complete`}
                        </p>
                    </CardContent>
                </Card>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-500" />
                                Current Streak
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-orange-500">{currentStreakDays}</p>
                            <p className="text-xs text-muted-foreground mt-1">days</p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Daily Average
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-500">{averageDaily}</p>
                            <p className="text-xs text-muted-foreground mt-1">dhikr/day</p>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Award className="w-4 h-4 text-purple-500" />
                                Best Day
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-purple-500">{maxInDay}</p>
                            <p className="text-xs text-muted-foreground mt-1">dhikr</p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-green-500" />
                                Total Count
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-500">{totalAllTime.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">all time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <Tabs defaultValue="week" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                        <TabsTrigger value="month">Last 30 Days</TabsTrigger>
                    </TabsList>

                    <TabsContent value="week" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Weekly Overview</CardTitle>
                                <CardDescription>
                                    Total this week: {weekTotal} dhikr
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between gap-2 h-48">
                                    {last7Days.map((day, index) => (
                                        <motion.div
                                            key={day.date}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(day.count / maxValue) * 100}%` }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            className="flex-1 flex flex-col items-center gap-2"
                                        >
                                            <div className="w-full bg-primary/20 rounded-t-lg relative group cursor-pointer hover:bg-primary/30 transition-colors">
                                                <div
                                                    className="w-full bg-primary rounded-t-lg transition-all"
                                                    style={{ height: `${(day.count / maxValue) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                                                />
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                                    {day.count} dhikr
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{day.day}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="month" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Monthly Overview</CardTitle>
                                <CardDescription>
                                    Total this month: {monthTotal} dhikr
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-10 gap-1">
                                    {last30Days.map((day, index) => {
                                        const intensity = day.count > 0 ? Math.min((day.count / dailyGoal) * 100, 100) : 0;
                                        return (
                                            <motion.div
                                                key={day.date}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.02 }}
                                                className="aspect-square rounded-sm group relative cursor-pointer"
                                                style={{
                                                    backgroundColor: intensity === 0
                                                        ? 'hsl(var(--muted))'
                                                        : `hsl(var(--primary) / ${intensity / 100})`,
                                                }}
                                            >
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<br />
                                                    {day.count} dhikr
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                                    <span>Less</span>
                                    <div className="flex gap-1">
                                        {[0, 25, 50, 75, 100].map((intensity) => (
                                            <div
                                                key={intensity}
                                                className="w-3 h-3 rounded-sm"
                                                style={{
                                                    backgroundColor: intensity === 0
                                                        ? 'hsl(var(--muted))'
                                                        : `hsl(var(--primary) / ${intensity / 100})`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span>More</span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Motivational Message */}
                {currentStreakDays >= 7 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-orange-500/10 via-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6 text-center"
                    >
                        <p className="text-2xl mb-2">🔥 Amazing!</p>
                        <p className="text-foreground font-medium">
                            You've maintained a {currentStreakDays}-day streak!
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Keep up the excellent work. May Allah accept your dhikr.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
