import { LucideIcon, Trophy, Flame, Target, Zap, Medal, Crown, Sparkles, Sunrise, Sunset, Moon, Heart } from 'lucide-react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: any; // LucideIcon type
    color: string;
    type: 'count' | 'streak' | 'time';
    target: number; // The threshold needed to unlock
    condition: (state: any) => boolean;
    getProgress: (state: any) => number; // Returns current progress value
}

export const achievements: Achievement[] = [
    {
        id: 'first_step',
        title: 'Bismillah',
        description: 'Completed your first Dhikr session.',
        icon: Sparkles,
        color: 'text-yellow-500',
        type: 'count',
        target: 33,
        condition: (state) => state.totalCount >= 33,
        getProgress: (state) => Math.min(state.totalCount || 0, 33)
    },
    {
        id: 'centurion',
        title: 'Centurion',
        description: 'Reached 100 total Dhikr.',
        icon: Medal,
        color: 'text-blue-500',
        type: 'count',
        target: 100,
        condition: (state) => state.totalCount >= 100,
        getProgress: (state) => Math.min(state.totalCount || 0, 100)
    },
    {
        id: 'kilo',
        title: 'Seeker',
        description: 'Reached 1,000 total Dhikr.',
        icon: Target,
        color: 'text-indigo-500',
        type: 'count',
        target: 1000,
        condition: (state) => state.totalCount >= 1000,
        getProgress: (state) => Math.min(state.totalCount || 0, 1000)
    },
    {
        id: 'ten_kilo',
        title: 'Devoted',
        description: 'Reached 10,000 total Dhikr.',
        icon: Trophy,
        color: 'text-purple-500',
        type: 'count',
        target: 10000,
        condition: (state) => state.totalCount >= 10000,
        getProgress: (state) => Math.min(state.totalCount || 0, 10000)
    },
    {
        id: 'streak_3',
        title: 'Consistency',
        description: 'Maintained a 3-day streak.',
        icon: Flame,
        color: 'text-orange-500',
        type: 'streak',
        target: 3,
        condition: (state) => state.streakDays >= 3,
        getProgress: (state) => Math.min(state.streakDays || 0, 3)
    },
    {
        id: 'streak_7',
        title: 'Unbreakable',
        description: 'Maintained a 7-day streak.',
        icon: Zap,
        color: 'text-red-500',
        type: 'streak',
        target: 7,
        condition: (state) => state.streakDays >= 7,
        getProgress: (state) => Math.min(state.streakDays || 0, 7)
    },
    {
        id: 'streak_30',
        title: 'Habit Master',
        description: 'Maintained a 30-day streak.',
        icon: Crown,
        color: 'text-amber-500',
        type: 'streak',
        target: 30,
        condition: (state) => state.streakDays >= 30,
        getProgress: (state) => Math.min(state.streakDays || 0, 30)
    },
    {
        id: 'early_bird',
        title: 'Fajr Warrior',
        description: 'Completed a session during Fajr time (4am-6am).',
        icon: Sunrise,
        color: 'text-sky-400',
        type: 'time',
        target: 1,
        condition: (state) => {
            const now = new Date();
            const hour = now.getHours();
            return hour >= 4 && hour < 6 && state.currentCount > 0;
        },
        getProgress: (state) => {
            const now = new Date();
            const hour = now.getHours();
            return (hour >= 4 && hour < 6 && state.currentCount > 0) ? 1 : 0;
        }
    },
     { // This requires logic in store to check specifically on completion
        id: 'night_owl',
        title: 'Tahajjud Time',
        description: 'Completed a session late at night (1am-3am).',
        icon: Moon,
        color: 'text-slate-400',
        type: 'time',
        target: 1,
        condition: (state) => {
             const now = new Date();
             const hour = now.getHours();
             return hour >= 1 && hour < 3 && state.currentCount > 0;
        },
        getProgress: (state) => {
            const now = new Date();
            const hour = now.getHours();
            return (hour >= 1 && hour < 3 && state.currentCount > 0) ? 1 : 0;
        }
    }
];

export const getNextLevel = (totalCount: number) => {
    if (totalCount < 1000) return { name: 'Initiate', next: 1000, progress: totalCount / 1000 };
    if (totalCount < 5000) return { name: 'Seeker', next: 5000, progress: (totalCount - 1000) / 4000 };
    if (totalCount < 10000) return { name: 'Devoted', next: 10000, progress: (totalCount - 5000) / 5000 };
    if (totalCount < 50000) return { name: 'Guardian', next: 50000, progress: (totalCount - 10000) / 40000 };
    return { name: 'Awakened', next: totalCount * 1.5, progress: 1 };
};
