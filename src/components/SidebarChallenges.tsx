import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Swords, Send, Check, X, Zap, Trophy, Shield, Ghost, Target, HandHeart } from 'lucide-react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, push, serverTimestamp, query, limitToLast } from 'firebase/database';
import { publishActivityEvent } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { getMuslimAvatarUrl } from '@/lib/avatarUtils';
import { toast } from 'sonner';

interface OnlineUser {
    user_id: string;
    email?: string;
    avatar_url?: string;
    last_dhikr_id?: string;
}

interface ChallengeInvite {
    id: string;
    from_id: string;
    from_name: string;
    type: 'sprint' | 'endurance';
    target: number;
    timestamp: any;
    status: 'pending' | 'accepted' | 'declined';
}

export function SidebarChallenges() {
    const { currentDhikr, dhikrs, setDhikr, startTasbih100, startTasbih1000, deviceId } = useTasbeehStore();
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [invites, setInvites] = useState<ChallengeInvite[]>([]);
    const [sentDuas, setSentDuas] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Listen for online users
        const presenceRef = ref(database, 'presence/visitors');
        const unsubscribePresence = onValue(presenceRef, (snap) => {
            const val = snap.val();
            if (val) {
                const users = Object.values(val) as OnlineUser[];
                // Filter out self
                setOnlineUsers(users.filter(u => (u as any).visitor_id !== deviceId && u.user_id !== deviceId));
            } else {
                setOnlineUsers([]);
            }
        });

        // Listen for invites sent to me
        const invitesRef = query(ref(database, `events/invitations/${deviceId}`), limitToLast(5));
        const unsubscribeInvites = onValue(invitesRef, (snap) => {
            const val = snap.val();
            if (val) {
                const inviteList = Object.entries(val).map(([id, invite]: [string, any]) => ({
                    id,
                    ...invite
                })).filter(i => i.status === 'pending');
                setInvites(inviteList);
            } else {
                setInvites([]);
            }
        });

        // Listen for duas sent to me
        const duaRef = query(ref(database, `events/duas/${deviceId}`), limitToLast(3));
        const unsubscribeDua = onValue(duaRef, (snap) => {
            const val = snap.val();
            if (val) {
                const duaEvents = Object.values(val) as any[];
                const recentDua = duaEvents.find(d => {
                    const age = Date.now() - (d.timestamp || 0);
                    return age < 30000; // Show only duas from last 30 seconds
                });
                if (recentDua) {
                    /*
                    toast.success("Someone sent you a Dua! 🤲", {
                        description: "May Allah bless you both 💚",
                        duration: 5000,
                    });
                    */
                }
            }
        });

        return () => {
            unsubscribePresence();
            unsubscribeInvites();
            unsubscribeDua();
        };
    }, [deviceId]);

    const sendInvite = (targetUserId: string, type: 'sprint' | 'endurance') => {
        const inviteRef = ref(database, `events/invitations/${targetUserId}`);
        const newInviteRef = push(inviteRef);

        set(newInviteRef, {
            from_id: deviceId,
            from_name: "A Peer", // Simplified for now
            type,
            target: type === 'sprint' ? 100 : 1000,
            timestamp: serverTimestamp(),
            status: 'pending'
        });

        /*
        toast.success("Challenge invitation sent!", {
            icon: <Send className="w-4 h-4 text-primary" />
        });
        */
    };

    const sendDua = (targetUserId: string) => {
        const duaRef = ref(database, `events/duas/${targetUserId}`);
        const newDuaRef = push(duaRef);

        set(newDuaRef, {
            from_id: deviceId,
            timestamp: Date.now(),
            message: 'dua'
        });

        setSentDuas(prev => new Set([...prev, targetUserId]));

        /*
        toast.success("Dua sent! 🤲", {
            description: "May Allah accept your dua",
            icon: <HandHeart className="w-4 h-4 text-green-400" />
        });
        */

        // Reset the sent state after 5 seconds
        setTimeout(() => {
            setSentDuas(prev => {
                const next = new Set(prev);
                next.delete(targetUserId);
                return next;
            });
        }, 5000);
    };

    const handleInviteAction = (invite: ChallengeInvite, action: 'accept' | 'decline') => {
        const inviteRef = ref(database, `events/invitations/${deviceId}/${invite.id}`);

        if (action === 'accept') {
            set(inviteRef, { ...invite, status: 'accepted' });
            if (invite.type === 'sprint') {
                startTasbih100(undefined);
                /*
                toast.success("⚡ 100 Dhikr Sprint Started!", {
                    description: "Complete: SubhanAllah ×33, Alhamdulillah ×33, Allahu Akbar ×33, La ilaha illallah ×1",
                    duration: 5000,
                });
                */
            } else {
                startTasbih1000(undefined);
                /*
                toast.success("🎯 1000 Dhikr Endurance Started!", {
                    description: "Complete 125× of each dhikr. May Allah accept!",
                    duration: 5000,
                });
                */
            }
            publishActivityEvent('community_goal', 'A challenge was accepted! Two souls racing to Allah 🏁');
        } else {
            set(inviteRef, { ...invite, status: 'declined' });
            toast('Challenge declined', { duration: 2000 });
        }
    };

    return (
        <div className="flex flex-col gap-6 px-2 py-4">
            {/* Live Competition Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <Users className="w-3 h-3 text-primary/60" />
                        Online Now ({onlineUsers.length})
                    </span>
                    {onlineUsers.length > 0 && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    )}
                </div>

                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
                    <AnimatePresence mode="popLayout">
                        {onlineUsers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-6 text-center gap-2"
                            >
                                <Ghost className="w-6 h-6 text-muted-foreground/20" />
                                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
                                    No peers online.<br />Be the first light.
                                </span>
                            </motion.div>
                        ) : (
                            onlineUsers.map(user => {
                                const currentDhikrName = dhikrs.find(d => d.id === user.last_dhikr_id)?.transliteration || "Dhikr";
                                const duaSent = sentDuas.has(user.user_id);
                                return (
                                    <motion.div
                                        key={user.user_id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group relative flex items-center justify-between p-2 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="relative">
                                                <Avatar className="w-8 h-8 border border-white/10 shadow-lg">
                                                    <AvatarImage src={user.avatar_url || getMuslimAvatarUrl(user.user_id)} />
                                                    <AvatarFallback className="bg-primary/20 text-[10px] text-primary">?</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-black" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[10px] font-black text-foreground/70 truncate">Peer</span>
                                                <span className="text-[8px] font-bold text-primary/40 truncate uppercase tracking-tighter">
                                                    {currentDhikrName}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Send Dua Button */}
                                            <motion.button
                                                onClick={() => sendDua(user.user_id)}
                                                disabled={duaSent}
                                                className={`p-1.5 rounded-lg transition-colors ${duaSent
                                                    ? 'bg-green-500/20 text-green-400 cursor-default'
                                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-primary-foreground'
                                                    }`}
                                                title="Send Dua 🤲"
                                                whileTap={!duaSent ? { scale: 0.9 } : {}}
                                            >
                                                {duaSent ? (
                                                    <Check className="w-3 h-3" />
                                                ) : (
                                                    <HandHeart className="w-3 h-3" />
                                                )}
                                            </motion.button>

                                            {/* Challenge Button */}
                                            <button
                                                onClick={() => sendInvite(user.user_id, 'sprint')}
                                                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                                title="Challenge to Sprint (100)"
                                            >
                                                <Zap className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2 px-2">
                        <Swords className="w-3 h-3" />
                        New Challenges!
                    </span>
                    <div className="flex flex-col gap-2">
                        {invites.map(invite => (
                            <motion.div
                                key={invite.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-xl overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full blur-2xl -mr-8 -mt-8" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy className="w-3 h-3 text-orange-400" />
                                        <span className="text-[10px] font-black text-foreground/90">
                                            {invite.type === 'sprint' ? '100 Sprint' : '1000 Endurance'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleInviteAction(invite, 'accept')}
                                            className="flex-1 py-1.5 rounded-lg bg-orange-500 text-primary-foreground text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleInviteAction(invite, 'decline')}
                                            className="px-2 py-1.5 rounded-lg bg-secondary/30 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Modes Section */}
            <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2 px-2">
                    <Target className="w-3 h-3 text-blue-400" />
                    Quick Modes
                </span>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => startTasbih100()}
                        className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                                <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-black text-foreground/90 tracking-tight">Daily Sprint</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">100 Dhikr</span>
                            </div>
                        </div>
                        <Shield className="w-3 h-3 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                    </button>

                    <button
                        onClick={() => startTasbih1000()}
                        className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/50 hover:border-blue-400/40 group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                <Trophy className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-black text-foreground/90 tracking-tight">Endurance</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">1000 Dhikr</span>
                            </div>
                        </div>
                        <Shield className="w-3 h-3 text-muted-foreground/20 group-hover:text-blue-400 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}
