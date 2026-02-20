import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PresenceUser {
    user_id: string;
    email?: string;
    avatar_url?: string;
    online_at: string;
}

export function VisitorCounter() {
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
    const [liveCount, setLiveCount] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        // Fetch total registered users
        const fetchTotalUsers = async () => {
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (!error && count !== null) {
                setTotalUsers(count);
            }
        };

        fetchTotalUsers();

        const channel = supabase.channel('online-visitors', {
            config: {
                presence: {
                    key: 'visitors',
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const visitors = Object.values(state).flat() as unknown as PresenceUser[];

                // Filter unique users or treat anonymous as separate? 
                // For now, let's just show unique user IDs + count anonymous separately if possible
                // But Presence usually keys by specific ID.
                setOnlineUsers(visitors.filter(u => u.user_id !== 'anonymous').slice(0, 5));
                setLiveCount(visitors.length);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const { data: { user } } = await supabase.auth.getUser();
                    await channel.track({
                        user_id: user?.id || 'anonymous',
                        email: user?.email,
                        avatar_url: user?.user_metadata?.avatar_url,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    if (liveCount === 0 && totalUsers === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-xl border border-white/10 shadow-lg group hover:bg-background/30 transition-all duration-500"
        >
            <div className="flex -space-x-2.5">
                <AnimatePresence mode="popLayout">
                    {onlineUsers.map((user, idx) => (
                        <motion.div
                            key={user.user_id}
                            initial={{ opacity: 0, scale: 0.5, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: 10 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: idx * 0.05
                            }}
                            className="relative"
                        >
                            <Avatar className="w-7 h-7 border-2 border-background shadow-md ring-1 ring-white/5 hover:scale-110 hover:z-20 transition-transform cursor-help">
                                {user.avatar_url ? (
                                    <AvatarImage src={user.avatar_url} />
                                ) : (
                                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                                        {user.email?.charAt(0).toUpperCase() || '?'}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-background rounded-full"></span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {liveCount > onlineUsers.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-7 h-7 rounded-full bg-secondary/80 backdrop-blur-md border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground z-10 shadow-sm"
                    >
                        +{liveCount - onlineUsers.length}
                    </motion.div>
                )}
            </div>

            <div className="flex items-center gap-4 h-5 divide-x divide-white/15">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400/60 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <span className="text-[11px] font-bold text-foreground/90 tracking-tight leading-none">
                            {liveCount}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-semibold">
                            Live Now
                        </span>
                    </div>
                </div>

                {totalUsers > 0 && (
                    <div className="pl-4 flex items-center gap-2 group/members">
                        <div className="p-1 px-1.5 rounded-md bg-primary/10 text-primary font-bold text-[9px]">
                            {totalUsers > 999 ? `${(totalUsers / 1000).toFixed(1)}k` : totalUsers}
                        </div>
                        <div className="flex flex-col -space-y-0.5">
                            <span className="text-[11px] font-bold text-foreground/80 tracking-tight leading-none">
                                Community
                            </span>
                            <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-semibold">
                                Members
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
