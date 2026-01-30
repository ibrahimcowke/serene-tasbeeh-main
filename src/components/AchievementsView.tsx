import * as React from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Target, Calendar, Award, Lock, Check, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    requirement: number;
    category: 'count' | 'streak' | 'session' | 'consistency';
    color: string;
    unlocked: boolean;
    progress: number;
}

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface AchievementsViewProps {
    children: React.ReactNode;
}

export function AchievementsView({ children }: AchievementsViewProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Achievements</SheetTitle>
                </SheetHeader>
                <AchievementsContent />
            </SheetContent>
        </Sheet>
    );
}

export function AchievementsContent() {
    const { dailyRecords: history, currentCount } = useTasbeehStore();

    // Calculate stats
    const totalAllTime = history.reduce((sum, record) => sum + record.totalCount, 0);

    const calculateStreak = () => {
        let streak = 0;
        const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));

        for (let i = 0; i < sortedHistory.length; i++) {
            const date = new Date(sortedHistory[i].date);
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];

            if (sortedHistory[i].date === expectedDateStr && sortedHistory[i].totalCount > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak();
    const daysActive = history.length;
    const maxInDay = Math.max(...history.map(h => h.totalCount), 0);

    // Define achievements
    const achievements: Achievement[] = [
        // Count-based achievements
        {
            id: 'first_100',
            title: 'First Steps',
            description: 'Complete 100 dhikr',
            icon: <Star className="w-6 h-6" />,
            requirement: 100,
            category: 'count',
            color: 'from-blue-500 to-cyan-500',
            unlocked: totalAllTime >= 100,
            progress: Math.min((totalAllTime / 100) * 100, 100),
        },
        {
            id: 'first_1000',
            title: 'Dedicated Worshipper',
            description: 'Complete 1,000 dhikr',
            icon: <Award className="w-6 h-6" />,
            requirement: 1000,
            category: 'count',
            color: 'from-purple-500 to-pink-500',
            unlocked: totalAllTime >= 1000,
            progress: Math.min((totalAllTime / 1000) * 100, 100),
        },
        {
            id: 'first_10000',
            title: 'Spiritual Warrior',
            description: 'Complete 10,000 dhikr',
            icon: <Trophy className="w-6 h-6" />,
            requirement: 10000,
            category: 'count',
            color: 'from-yellow-500 to-orange-500',
            unlocked: totalAllTime >= 10000,
            progress: Math.min((totalAllTime / 10000) * 100, 100),
        },
        {
            id: 'first_50000',
            title: 'Devoted Heart',
            description: 'Complete 50,000 dhikr',
            icon: <Trophy className="w-6 h-6" />,
            requirement: 50000,
            category: 'count',
            color: 'from-orange-500 to-amber-500',
            unlocked: totalAllTime >= 50000,
            progress: Math.min((totalAllTime / 50000) * 100, 100),
        },
        {
            id: 'first_100000',
            title: 'Master of Remembrance',
            description: 'Complete 100,000 dhikr',
            icon: <Trophy className="w-6 h-6" />,
            requirement: 100000,
            category: 'count',
            color: 'from-amber-500 to-yellow-500',
            unlocked: totalAllTime >= 100000,
            progress: Math.min((totalAllTime / 100000) * 100, 100),
        },
        {
            id: 'first_250000',
            title: 'Quarter Million',
            description: 'Complete 250,000 dhikr',
            icon: <Trophy className="w-6 h-6" />,
            requirement: 250000,
            category: 'count',
            color: 'from-yellow-500 to-lime-500',
            unlocked: totalAllTime >= 250000,
            progress: Math.min((totalAllTime / 250000) * 100, 100),
        },
        {
            id: 'first_500000',
            title: 'Half Million Master',
            description: 'Complete 500,000 dhikr',
            icon: <Crown className="w-6 h-6" />,
            requirement: 500000,
            category: 'count',
            color: 'from-lime-500 to-green-500',
            unlocked: totalAllTime >= 500000,
            progress: Math.min((totalAllTime / 500000) * 100, 100),
        },
        {
            id: 'first_1000000',
            title: 'The Millionaire',
            description: 'Complete 1,000,000 dhikr',
            icon: <Crown className="w-6 h-6" />,
            requirement: 1000000,
            category: 'count',
            color: 'from-green-500 to-emerald-500',
            unlocked: totalAllTime >= 1000000,
            progress: Math.min((totalAllTime / 1000000) * 100, 100),
        },

        // Streak-based achievements
        {
            id: 'streak_3',
            title: 'Consistent Beginner',
            description: 'Maintain a 3-day streak',
            icon: <Flame className="w-6 h-6" />,
            requirement: 3,
            category: 'streak',
            color: 'from-orange-500 to-red-500',
            unlocked: currentStreak >= 3,
            progress: Math.min((currentStreak / 3) * 100, 100),
        },
        {
            id: 'streak_7',
            title: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: <Flame className="w-6 h-6" />,
            requirement: 7,
            category: 'streak',
            color: 'from-orange-600 to-red-600',
            unlocked: currentStreak >= 7,
            progress: Math.min((currentStreak / 7) * 100, 100),
        },
        {
            id: 'streak_14',
            title: 'Fortnight Focus',
            description: 'Maintain a 14-day streak',
            icon: <Flame className="w-6 h-6" />,
            requirement: 14,
            category: 'streak',
            color: 'from-red-400 to-rose-400',
            unlocked: currentStreak >= 14,
            progress: Math.min((currentStreak / 14) * 100, 100),
        },
        {
            id: 'streak_30',
            title: 'Monthly Champion',
            description: 'Maintain a 30-day streak',
            icon: <Flame className="w-6 h-6" />,
            requirement: 30,
            category: 'streak',
            color: 'from-red-500 to-rose-500',
            unlocked: currentStreak >= 30,
            progress: Math.min((currentStreak / 30) * 100, 100),
        },
        {
            id: 'streak_60',
            title: 'Two Month Titan',
            description: 'Maintain a 60-day streak',
            icon: <Flame className="w-6 h-6" />,
            requirement: 60,
            category: 'streak',
            color: 'from-rose-500 to-pink-500',
            unlocked: currentStreak >= 60,
            progress: Math.min((currentStreak / 60) * 100, 100),
        },
        {
            id: 'streak_100',
            title: 'Unstoppable Force',
            description: 'Maintain a 100-day streak',
            icon: <Flame className="w-6 h-6" />,
            requirement: 100,
            category: 'streak',
            color: 'from-red-600 to-pink-600',
            unlocked: currentStreak >= 100,
            progress: Math.min((currentStreak / 100) * 100, 100),
        },

        // Daily target achievements
        {
            id: 'daily_500',
            title: 'Daily Devotion',
            description: 'Complete 500 dhikr in one day',
            icon: <Target className="w-6 h-6" />,
            requirement: 500,
            category: 'session',
            color: 'from-green-500 to-emerald-500',
            unlocked: maxInDay >= 500,
            progress: Math.min((maxInDay / 500) * 100, 100),
        },
        {
            id: 'daily_1000',
            title: 'Thousand in a Day',
            description: 'Complete 1,000 dhikr in one day',
            icon: <Target className="w-6 h-6" />,
            requirement: 1000,
            category: 'session',
            color: 'from-green-600 to-teal-600',
            unlocked: maxInDay >= 1000,
            progress: Math.min((maxInDay / 1000) * 100, 100),
        },
        {
            id: 'daily_2500',
            title: 'Deep Focus',
            description: 'Complete 2,500 dhikr in one day',
            icon: <Target className="w-6 h-6" />,
            requirement: 2500,
            category: 'session',
            color: 'from-teal-600 to-cyan-600',
            unlocked: maxInDay >= 2500,
            progress: Math.min((maxInDay / 2500) * 100, 100),
        },
        {
            id: 'daily_5000',
            title: 'Extreme Dedication',
            description: 'Complete 5,000 dhikr in one day',
            icon: <Trophy className="w-6 h-6" />,
            requirement: 5000,
            category: 'session',
            color: 'from-teal-500 to-cyan-500',
            unlocked: maxInDay >= 5000,
            progress: Math.min((maxInDay / 5000) * 100, 100),
        },
        {
            id: 'daily_10000',
            title: 'Marathon Session',
            description: 'Complete 10,000 dhikr in one day',
            icon: <Zap className="w-6 h-6" />,
            requirement: 10000,
            category: 'session',
            color: 'from-cyan-500 to-blue-500',
            unlocked: maxInDay >= 10000,
            progress: Math.min((maxInDay / 10000) * 100, 100),
        },

        // Consistency achievements
        {
            id: 'active_7',
            title: 'Week Explorer',
            description: 'Be active for 7 days',
            icon: <Calendar className="w-6 h-6" />,
            requirement: 7,
            category: 'consistency',
            color: 'from-indigo-500 to-purple-500',
            unlocked: daysActive >= 7,
            progress: Math.min((daysActive / 7) * 100, 100),
        },
        {
            id: 'active_14',
            title: 'Two Weeks Active',
            description: 'Be active for 14 days',
            icon: <Calendar className="w-6 h-6" />,
            requirement: 14,
            category: 'consistency',
            color: 'from-indigo-400 to-violet-400',
            unlocked: daysActive >= 14,
            progress: Math.min((daysActive / 14) * 100, 100),
        },
        {
            id: 'active_30',
            title: 'Monthly Regular',
            description: 'Be active for 30 days',
            icon: <Calendar className="w-6 h-6" />,
            requirement: 30,
            category: 'consistency',
            color: 'from-indigo-600 to-violet-600',
            unlocked: daysActive >= 30,
            progress: Math.min((daysActive / 30) * 100, 100),
        },
        {
            id: 'active_100',
            title: 'Hundred Days Journey',
            description: 'Be active for 100 days',
            icon: <Calendar className="w-6 h-6" />,
            requirement: 100,
            category: 'consistency',
            color: 'from-violet-500 to-purple-500',
            unlocked: daysActive >= 100,
            progress: Math.min((daysActive / 100) * 100, 100),
        },
        {
            id: 'active_180',
            title: 'Half Year Dedication',
            description: 'Be active for 180 days',
            icon: <Calendar className="w-6 h-6" />,
            requirement: 180,
            category: 'consistency',
            color: 'from-purple-500 to-fuchsia-500',
            unlocked: daysActive >= 180,
            progress: Math.min((daysActive / 180) * 100, 100),
        },
        {
            id: 'active_365',
            title: 'Year of Remembrance',
            description: 'Be active for 365 days',
            icon: <Trophy className="w-6 h-6" />,
            requirement: 365,
            category: 'consistency',
            color: 'from-purple-600 to-fuchsia-600',
            unlocked: daysActive >= 365,
            progress: Math.min((daysActive / 365) * 100, 100),
        },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

    const categories = [
        { id: 'all', label: 'All', icon: Trophy },
        { id: 'count', label: 'Count', icon: Star },
        { id: 'streak', label: 'Streak', icon: Flame },
        { id: 'session', label: 'Daily', icon: Target },
        { id: 'consistency', label: 'Active Days', icon: Calendar },
    ];

    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    return (
        <div className="overflow-y-auto space-y-6 pb-24 h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div>
                    <p className="text-muted-foreground">Unlock badges as you progress</p>
                </div>

                {/* Overall Progress */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            Overall Progress
                        </CardTitle>
                        <CardDescription>
                            {unlockedCount} of {totalCount} achievements unlocked
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={completionPercentage} className="h-3 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            {completionPercentage}% complete
                        </p>
                    </CardContent>
                </Card>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${selectedCategory === category.id
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card border-border hover:border-primary/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{category.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAchievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className={`relative overflow-hidden ${achievement.unlocked
                                ? 'border-primary/30 bg-gradient-to-br from-primary/10 to-transparent'
                                : 'border-muted opacity-60'
                                }`}>
                                {/* Background gradient */}
                                {achievement.unlocked && (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-5`} />
                                )}

                                <CardHeader className="relative">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl ${achievement.unlocked
                                            ? `bg-gradient-to-br ${achievement.color}`
                                            : 'bg-muted'
                                            } text-white`}>
                                            {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                                        </div>
                                        {achievement.unlocked && (
                                            <Badge variant="default" className="bg-primary">
                                                <Check className="w-3 h-3 mr-1" />
                                                Unlocked
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg mt-3">{achievement.title}</CardTitle>
                                    <CardDescription>{achievement.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="relative">
                                    {!achievement.unlocked && (
                                        <div className="space-y-2">
                                            <Progress value={achievement.progress} className="h-2" />
                                            <p className="text-xs text-muted-foreground">
                                                {Math.round(achievement.progress)}% complete
                                            </p>
                                        </div>
                                    )}
                                    {achievement.unlocked && (
                                        <p className="text-sm text-primary font-medium">
                                            ✨ Achievement unlocked!
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Motivational Message */}
                {unlockedCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-xl p-6 text-center"
                    >
                        <p className="text-2xl mb-2">🏆</p>
                        <p className="text-foreground font-medium">
                            You've unlocked {unlockedCount} achievement{unlockedCount !== 1 ? 's' : ''}!
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Keep going to unlock {totalCount - unlockedCount} more.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
