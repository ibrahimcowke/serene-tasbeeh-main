import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { database } from '@/lib/firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp, query, update } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Heart, Users, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface PresenceData {
    user_id: string;
    email?: string;
    avatar_url?: string;
    online_at: any;
    last_dhikr_id?: string;
}

export function VisitorCounter() {
    const { currentDhikr } = useTasbeehStore();
    const [visitors, setVisitors] = useState<PresenceData[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchTotalUsers = async () => {
            if (!isSupabaseConfigured) return;
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (!error && count !== null) {
                setTotalUsers(count);
            }
        };

        fetchTotalUsers();

        const connectedRef = ref(database, '.info/connected');

        const unsubscribeConnected = onValue(connectedRef, async (snap) => {
            if (snap.val() === true) {
                const { data: { user } } = await supabase.auth.getUser();

                let deviceId = localStorage.getItem('visitor_device_id');
                if (!deviceId) {
                    deviceId = 'anon_' + Math.random().toString(36).substring(2, 15);
                    localStorage.setItem('visitor_device_id', deviceId);
                }

                // Use deviceId as stable key for presence
                const myPresenceRef = ref(database, `presence/visitors/${deviceId}`);
                onDisconnect(myPresenceRef).remove();

                update(myPresenceRef, {
                    user_id: user?.id || deviceId,
                    email: user?.email || '',
                    avatar_url: user?.user_metadata?.avatar_url || '',
                    online_at: serverTimestamp(),
                    last_dhikr_id: currentDhikr.id
                });
            }
        });

        const presenceRef = ref(database, 'presence/visitors');
        const unsubscribePresence = onValue(presenceRef, (snap) => {
            const val = snap.val();
            if (val) {
                setVisitors(Object.values(val) as PresenceData[]);
            } else {
                setVisitors([]);
            }
        });

        return () => {
            unsubscribeConnected();
            unsubscribePresence();
        };
    }, []);

    // Sync current dhikr to presence node whenever it changes
    useEffect(() => {
        const deviceId = localStorage.getItem('visitor_device_id');
        if (deviceId) {
            const myPresenceRef = ref(database, `presence/visitors/${deviceId}`);
            update(myPresenceRef, {
                last_dhikr_id: currentDhikr.id
            }).catch(e => console.error("Presence update failed", e));
        }
    }, [currentDhikr.id]);

    const uniqueVisitors = useMemo(() => {
        return visitors.reduce((acc: PresenceData[], current) => {
            const x = acc.find(item => item.user_id === current.user_id);
            if (!x) return acc.concat([current]);
            return acc;
        }, []);
    }, [visitors]);

    const activityInsight = useMemo(() => {
        if (uniqueVisitors.length < 2) return null;
        const currentDhikrActive = uniqueVisitors.filter(u => u.last_dhikr_id === currentDhikr.id).length;
        if (currentDhikrActive > 1) {
            return `${currentDhikrActive} people are reciting ${currentDhikr.transliteration} right now`;
        }
        return null;
    }, [uniqueVisitors, currentDhikr]);

    const avatarUsers = uniqueVisitors.filter(u => u.user_id && !u.user_id.startsWith('anon_'));
    const liveCount = uniqueVisitors.length;

    const sendSalam = () => {
        const pulseRef = ref(database, 'events/global/pulse');
        set(pulseRef, {
            type: 'salam',
            timestamp: serverTimestamp(),
            sender_id: localStorage.getItem('visitor_device_id')
        });
        toast.success("Salam sent to the community!");
    };

    if (liveCount === 0 && totalUsers === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-2"
        >
            <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-card/30 backdrop-blur-2xl border border-white/10 shadow-xl group transition-all duration-500">
                <div className="flex -space-x-2.5">
                    <AnimatePresence mode="popLayout">
                        {avatarUsers.slice(0, 3).map((user, idx) => (
                            <motion.div
                                key={user.user_id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative"
                            >
                                <Avatar className="w-7 h-7 border-2 border-background shadow-md">
                                    {user.avatar_url ? (
                                        <AvatarImage src={user.avatar_url} />
                                    ) : (
                                        <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">
                                            {user.email?.charAt(0).toUpperCase() || '?'}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-background rounded-full"></span>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {liveCount > avatarUsers.length && (
                        <div className="w-7 h-7 rounded-full bg-secondary/80 backdrop-blur-md border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground z-10">
                            +{liveCount - Math.min(avatarUsers.length, 3)}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 h-5 divide-x divide-white/15">
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400/60 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <div className="flex flex-col -space-y-0.5">
                            <span className="text-[11px] font-bold text-foreground/90 leading-none">
                                {liveCount}
                            </span>
                            <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-semibold">
                                Live
                            </span>
                        </div>
                    </div>

                    {totalUsers > 0 && (
                        <div className="pl-4 flex items-center gap-2">
                            <Users className="w-3 h-3 text-primary/60" />
                            <div className="flex flex-col -space-y-0.5">
                                <span className="text-[11px] font-bold text-foreground/80 leading-none">
                                    {totalUsers > 999 ? `${(totalUsers / 1000).toFixed(1)}k` : totalUsers}
                                </span>
                                <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-semibold">
                                    Members
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-4 w-px bg-white/10 mx-1" />

                <button
                    onClick={sendSalam}
                    className="p-1.5 rounded-full hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors group/heart"
                    title="Send Salam to all online users"
                >
                    <Heart className="w-4 h-4 group-hover/heart:fill-primary" />
                </button>
            </div>

            {activityInsight && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 self-center"
                >
                    <Activity className="w-3 h-3 text-primary/60 animate-pulse" />
                    <span className="text-[9px] font-medium text-primary/80 uppercase tracking-wider">
                        {activityInsight}
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
}
