import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { database } from '@/lib/firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp, update } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTasbeehStore, defaultDhikrs } from '@/store/tasbeehStore';
import { Heart, Users, Activity, Globe, Flame, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { getMuslimAvatarUrl } from '@/lib/avatarUtils';

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
    const [expanded, setExpanded] = useState(false);
    const [salamSent, setSalamSent] = useState(false);

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
                const now = Date.now();
                const fiveMins = 5 * 60 * 1000;
                const allVisitors = (Object.values(val) as PresenceData[]).filter(v => {
                    return v.online_at && (now - (typeof v.online_at === 'number' ? v.online_at : 0) < fiveMins);
                });
                setVisitors(allVisitors);
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

    // Group visitors by dhikr
    const dhikrGroups = useMemo(() => {
        const groups: Record<string, { count: number; name: string; arabic: string }> = {};
        uniqueVisitors.forEach(v => {
            const dhikrId = v.last_dhikr_id || 'unknown';
            const dhikr = defaultDhikrs.find(d => d.id === dhikrId);
            if (!groups[dhikrId]) {
                groups[dhikrId] = {
                    count: 0,
                    name: dhikr?.transliteration || 'Dhikr',
                    arabic: dhikr?.arabic || '',
                };
            }
            groups[dhikrId].count += 1;
        });
        // Sort by count descending
        return Object.entries(groups)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 4);
    }, [uniqueVisitors]);

    // How many reciting same dhikr as me
    const sameDhikrCount = useMemo(() => {
        return uniqueVisitors.filter(u => u.last_dhikr_id === currentDhikr.id).length;
    }, [uniqueVisitors, currentDhikr]);

    const liveCount = uniqueVisitors.length;

    const sendSalam = () => {
        const pulseRef = ref(database, 'events/global/pulse');
        set(pulseRef, {
            type: 'salam',
            timestamp: serverTimestamp(),
            sender_id: localStorage.getItem('visitor_device_id')
        });
        setSalamSent(true);
        toast.success("Assalamu Alaikum! 🤲", {
            description: `Salam sent to ${liveCount} online users`,
            duration: 3000,
        });
        setTimeout(() => setSalamSent(false), 5000);
    };

    if (liveCount === 0 && totalUsers === 0) return null;

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Main Live Counter Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-2xl border border-foreground/[0.06] bg-foreground/[0.03] shadow-inner cursor-pointer group"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.04] to-primary/[0.03] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        {/* Pulse ring animation */}
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <Globe className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-background"></span>
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-black text-foreground tabular-nums">{liveCount}</span>
                                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Live</span>
                            </div>
                            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">
                                Reciting Now
                            </span>
                        </div>
                    </div>

                    {/* Avatar stack */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {uniqueVisitors.slice(0, 3).map((user) => (
                                <Avatar key={user.user_id} className="w-6 h-6 border-2 border-background shadow-md">
                                    <AvatarImage src={user.avatar_url || getMuslimAvatarUrl(user.user_id)} />
                                    <AvatarFallback className="text-[7px] bg-primary/20 text-primary font-bold">
                                        {user.email?.charAt(0).toUpperCase() || '?'}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {liveCount > 3 && (
                                <div className="w-6 h-6 rounded-full bg-secondary/80 border-2 border-background flex items-center justify-center text-[7px] font-bold text-muted-foreground z-10">
                                    +{liveCount - 3}
                                </div>
                            )}
                        </div>

                        <motion.div
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-muted-foreground/40"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </motion.div>
                    </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-3 pb-3 space-y-3">
                                {/* Divider */}
                                <div className="h-px bg-foreground/5" />

                                {/* Same dhikr insight */}
                                {sameDhikrCount > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                        <span className="text-[10px] font-bold text-primary/80">
                                            {sameDhikrCount} people reciting {currentDhikr.transliteration} with you!
                                        </span>
                                    </motion.div>
                                )}

                                {/* Live Dhikr Breakdown */}
                                <div className="space-y-1.5">
                                    <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] flex items-center gap-1.5 px-1">
                                        <Activity className="w-2.5 h-2.5" />
                                        Live Dhikr Activity
                                    </span>
                                    <div className="space-y-1">
                                        {dhikrGroups.map(([dhikrId, group]) => {
                                            const percentage = liveCount > 0 ? (group.count / liveCount) * 100 : 0;
                                            const isMyDhikr = dhikrId === currentDhikr.id;
                                            return (
                                                <motion.div
                                                    key={dhikrId}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`relative rounded-lg overflow-hidden p-2 ${isMyDhikr ? 'bg-primary/5 border border-primary/15' : 'bg-foreground/[0.02]'}`}
                                                >
                                                    {/* Progress bar background */}
                                                    <motion.div
                                                        className={`absolute inset-y-0 left-0 ${isMyDhikr ? 'bg-primary/10' : 'bg-foreground/[0.03]'}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                                    />
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="text-[10px] font-bold text-foreground/70 truncate">
                                                                {group.name}
                                                            </span>
                                                            {isMyDhikr && (
                                                                <span className="text-[7px] font-black bg-primary/15 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <Users className="w-2.5 h-2.5 text-muted-foreground/40" />
                                                            <span className="text-[10px] font-black text-foreground/60 tabular-nums">
                                                                {group.count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2">
                                    {totalUsers > 0 && (
                                        <div className="flex flex-col items-center py-2 px-1 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                            <Users className="w-3 h-3 text-blue-400 mb-1" />
                                            <span className="text-sm font-black text-foreground tabular-nums">
                                                {totalUsers > 999 ? `${(totalUsers / 1000).toFixed(1)}k` : totalUsers}
                                            </span>
                                            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Members</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col items-center py-2 px-1 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                        <Flame className="w-3 h-3 text-orange-400 mb-1" />
                                        <span className="text-sm font-black text-foreground tabular-nums">
                                            {dhikrGroups.length}
                                        </span>
                                        <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Adhkar</span>
                                    </div>

                                    <div className="flex flex-col items-center py-2 px-1 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                        <Globe className="w-3 h-3 text-green-400 mb-1" />
                                        <span className="text-sm font-black text-foreground tabular-nums">
                                            {liveCount}
                                        </span>
                                        <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Online</span>
                                    </div>
                                </div>

                                {/* Send Salam button */}
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); sendSalam(); }}
                                    disabled={salamSent}
                                    className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all ${salamSent
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-[0.98]'
                                        }`}
                                    whileTap={!salamSent ? { scale: 0.97 } : {}}
                                >
                                    {salamSent ? (
                                        <>
                                            <Heart className="w-3.5 h-3.5 fill-green-400" />
                                            Salam Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-3.5 h-3.5" />
                                            Send Salam to Everyone
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
