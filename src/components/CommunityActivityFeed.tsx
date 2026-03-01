import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, UserPlus, Star, Zap } from 'lucide-react';
import { database } from '@/lib/firebase';
import { ref, onValue, query, limitToLast, orderByChild } from 'firebase/database';

interface FeedEvent {
    id: string;
    type: 'milestone' | 'sprint_complete' | 'new_user' | 'community_goal' | 'streak';
    message: string;
    timestamp: number;
    icon?: string;
}

const eventIcons: Record<string, any> = {
    milestone: Star,
    sprint_complete: Trophy,
    new_user: UserPlus,
    community_goal: Sparkles,
    streak: Zap,
};

const eventColors: Record<string, string> = {
    milestone: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    sprint_complete: 'text-green-400 bg-green-500/10 border-green-500/20',
    new_user: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    community_goal: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    streak: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

// Fallback events shown when no Firebase data exists
const fallbackEvents: FeedEvent[] = [
    {
        id: 'fb1',
        type: 'community_goal',
        message: 'Community has been remembering Allah together 🌙',
        timestamp: Date.now() - 60000,
    },
    {
        id: 'fb2',
        type: 'milestone',
        message: 'Every dhikr brings us closer to Allah ✨',
        timestamp: Date.now() - 120000,
    },
];

export function CommunityActivityFeed() {
    const [events, setEvents] = useState<FeedEvent[]>(fallbackEvents);

    useEffect(() => {
        const feedRef = query(
            ref(database, 'events/global/feed'),
            limitToLast(5)
        );

        const unsubscribe = onValue(feedRef, (snap) => {
            const val = snap.val();
            if (val) {
                const eventList = Object.entries(val)
                    .map(([id, event]: [string, any]) => ({
                        id,
                        ...event,
                    }))
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                    .slice(0, 5) as FeedEvent[];

                if (eventList.length > 0) {
                    setEvents(eventList);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const getTimeAgo = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 flex items-center gap-1.5 px-1">
                <Sparkles className="w-3 h-3 text-purple-400/60" />
                Live Feed
            </span>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {events.map((event, idx) => {
                        const IconComponent = eventIcons[event.type] || Star;
                        const colorClass = eventColors[event.type] || eventColors.milestone;

                        return (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`flex items-center gap-2.5 p-2 rounded-xl border ${colorClass} transition-all`}
                            >
                                <div className="shrink-0">
                                    <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-[10px] font-medium leading-snug flex-1 min-w-0 truncate">
                                    {event.message}
                                </p>
                                <span className="text-[8px] text-muted-foreground/50 shrink-0 font-medium">
                                    {getTimeAgo(event.timestamp)}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
