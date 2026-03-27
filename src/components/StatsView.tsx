import * as React from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Award, Flame, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

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
                <SheetDescription className="sr-only">
                    Detailed statistics about your dhikr frequency and trends.
                </SheetDescription>
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

    const totalAllTime = history.reduce((sum, record) => sum + record.totalCount, 0);
    const averageDaily = history.length > 0 ? Math.round(totalAllTime / history.length) : 0;
    const maxInDay = Math.max(...history.map(h => h.totalCount), 0);
    const weekTotal = last7Days.reduce((sum, day) => sum + day.count, 0);

    const currentStreakDays = streakDays;

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
                        <TabsTrigger value="week">Overview</TabsTrigger>
                        <TabsTrigger value="distribution">Focus</TabsTrigger>
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
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={last7Days}>
                                            <XAxis 
                                                dataKey="day" 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                            />
                                            <Tooltip
                                                contentStyle={{ 
                                                    backgroundColor: 'hsl(var(--card))', 
                                                    borderRadius: '12px', 
                                                    border: '1px solid hsl(var(--border))',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                                }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                                cursor={{ fill: 'hsl(var(--primary)/0.1)', radius: 8 }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                radius={[6, 6, 0, 0]}
                                                className="fill-primary"
                                            >
                                                {last7Days.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={entry.date === today ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.4)'} 
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="distribution" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Dhikr Distribution</CardTitle>
                                <CardDescription>
                                    Most frequent recitations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(todayRecord?.counts || {}).map(([id, count]) => ({
                                                    name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
                                                    value: count
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {(Object.entries(todayRecord?.counts || {})).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.2 + (index * 0.2)})`} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'hsl(var(--card))', 
                                                    borderRadius: '12px', 
                                                    border: '1px solid hsl(var(--border))' 
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
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
