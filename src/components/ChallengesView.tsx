import { useEffect, useState, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Zap, Target, Users, Send, Check, X, Flame, Star, Timer, Crown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { database } from '@/lib/firebase';
import { publishActivityEvent } from '@/lib/firebase';
import { ref, onValue, set, push, serverTimestamp, query, limitToLast } from 'firebase/database';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { getMuslimAvatarUrl } from '@/lib/avatarUtils';
import { toast } from 'sonner';

interface OnlineUser {
    user_id: string;
    visitor_id?: string;
    tab_id?: string;
    email?: string;
    avatar_url?: string;
    last_dhikr_id?: string;
    online_at?: any;
}

interface ChallengeInvite {
    id: string;
    from_id: string;
    from_name: string;
    type: 'sprint' | 'endurance' | 'daily';
    target: number;
    timestamp: any;
    status: 'pending' | 'accepted' | 'declined';
}

interface ActiveChallenge {
    id: string;
    type: 'sprint' | 'endurance' | 'daily';
    target: number;
    startedAt: number;
    myCount: number;
    opponentId: string;
    opponentCount: number;
    status: 'active' | 'completed' | 'expired';
}

const CHALLENGE_TYPES = [
    {
        type: 'sprint' as const,
        label: '100 Sprint',
        description: 'Race to 100 dhikr',
        target: 100,
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/20',
        duration: '10 min',
    },
    {
        type: 'endurance' as const,
        label: '1000 Endurance',
        description: 'Complete 1000 dhikr',
        target: 1000,
        icon: Trophy,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20',
        duration: '1 hour',
    },
    {
        type: 'daily' as const,
        label: 'Daily Goal',
        description: 'Reach your daily goal',
        target: 0,
        icon: Target,
        color: 'text-green-400',
        bg: 'bg-green-500/10 border-green-500/20',
        duration: '24 hours',
    },
];

export function ChallengesView({ children }: { children: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto bg-background border-r border-border/50">
                <SheetHeader className="pb-4 border-b border-border/30">
                    <SheetTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <Swords className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <span className="text-lg font-black">Challenges</span>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Compete & Earn Hasanat</p>
                        </div>
                    </SheetTitle>
                    <SheetDescription className="sr-only">Challenge other users to dhikr competitions</SheetDescription>
                </SheetHeader>

                <ChallengesViewContent />
            </SheetContent>
        </Sheet>
    );
}

export function ChallengesViewContent({ isPage = false }: { isPage?: boolean }) {
    const { startTasbih100, startTasbih1000, dhikrs, totalAllTime, dailyGoal, deviceId } = useTasbeehStore();
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [invites, setInvites] = useState<ChallengeInvite[]>([]);
    const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([]);
    const [selectedType, setSelectedType] = useState<'sprint' | 'endurance' | 'daily'>('sprint');
    const [tab, setTab] = useState<'challenges' | 'invite' | 'history'>('challenges');
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        const presenceRef = ref(database, 'presence/visitors');
        const unsubscribePresence = onValue(presenceRef, (snap) => {
            const val = snap.val();
            if (val) {
                const now = Date.now();
                const fiveMins = 5 * 60 * 1000;

                // Group by visitor_id to avoid multi-tab duplicates
                const uniquePeers = new Map<string, OnlineUser>();

                Object.values(val).forEach((u: any) => {
                    const vid = u.visitor_id || u.user_id;
                    const isOnline = u.online_at && (now - (typeof u.online_at === 'number' ? u.online_at : 0) < fiveMins);
                    
                    // A session is "self" if it has my deviceId
                    const isSelf = vid === deviceId;

                    if (isOnline && !isSelf) {
                        if (!uniquePeers.has(vid)) {
                            uniquePeers.set(vid, u);
                        }
                    }
                });

                setOnlineUsers(Array.from(uniquePeers.values()));
            } else {
                setOnlineUsers([]);
            }
        });

        const invitesRef = query(ref(database, `events/invitations/${deviceId}`), limitToLast(10));
        const unsubscribeInvites = onValue(invitesRef, (snap) => {
            const val = snap.val();
            if (val) {
                setInvites(Object.entries(val).map(([id, invite]: [string, any]) => ({ id, ...invite })).filter(i => i.status === 'pending'));
            } else {
                setInvites([]);
            }
        });

        const challengesRef = ref(database, `challenges/${deviceId}`);
        const unsubscribeChallenges = onValue(challengesRef, (snap) => {
            const val = snap.val();
            if (val) {
                const list = Object.entries(val).map(([id, c]: [string, any]) => ({ id, ...c })) as ActiveChallenge[];
                setActiveChallenges(list.filter(c => c.status === 'active'));
                setCompletedCount(list.filter(c => c.status === 'completed').length);
            } else {
                setActiveChallenges([]);
            }
        });

        return () => { unsubscribePresence(); unsubscribeInvites(); unsubscribeChallenges(); };
    }, [deviceId]);

    const sendInvite = (targetUserId: string, type: 'sprint' | 'endurance' | 'daily') => {
        const ct = CHALLENGE_TYPES.find(c => c.type === type)!;
        const target = type === 'daily' ? dailyGoal : ct.target;
        // Invitations should still go to the device ID or user ID for now, 
        // as challenges are often tied to the browser session.
        const inviteRef = ref(database, `events/invitations/${targetUserId}`);
        set(push(inviteRef), {
            from_id: deviceId, from_name: "A Peer", type, target,
            timestamp: serverTimestamp(), status: 'pending'
        });
        /*
        toast.success(`${ct.label} challenge sent!`, {
            icon: <Send className="w-4 h-4 text-primary" />,
            description: `Target: ${target} dhikr`,
        });
        */
    };

    const handleInviteAction = (invite: ChallengeInvite, action: 'accept' | 'decline') => {
        const inviteRef = ref(database, `events/invitations/${deviceId}/${invite.id}`);
        if (action === 'accept') {
            set(inviteRef, { ...invite, status: 'accepted' });
            const myChallenge = {
                type: invite.type, target: invite.target, startedAt: Date.now(),
                myCount: 0, opponentId: invite.from_id, opponentCount: 0, status: 'active',
            };
            const challengeId = push(ref(database, `challenges/${deviceId}`)).key;
            if (challengeId) {
                set(ref(database, `challenges/${deviceId}/${challengeId}`), myChallenge);
                set(ref(database, `challenges/${invite.from_id}/${challengeId}`), { ...myChallenge, opponentId: deviceId });
            }
            if (invite.type === 'sprint') startTasbih100(challengeId || undefined);
            else if (invite.type === 'endurance') startTasbih1000(challengeId || undefined);
            publishActivityEvent('community_goal', 'A challenge was accepted! Two souls racing to Allah 🏁');
            /*
            toast.success(`${invite.type === 'sprint' ? '⚡ Sprint' : invite.type === 'endurance' ? '🎯 Endurance' : '📊 Daily'} Challenge Started!`, {
                description: `Target: ${invite.target} dhikr`, duration: 5000,
            });
            */
        } else {
            set(inviteRef, { ...invite, status: 'declined' });
            /*
            toast('Challenge declined', { duration: 2000 });
            */
        }
    };

    const getTimeElapsed = (startedAt: number) => {
        const mins = Math.floor((Date.now() - startedAt) / 60000);
        return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    return (
        <>
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-foreground/[0.03] rounded-xl mt-4 border border-foreground/5">
                {(['challenges', 'invite', 'history'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all ${tab === t ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                            }`}>
                        {t === 'challenges' ? `Active (${activeChallenges.length})` : t === 'invite' ? 'Invite' : `Done (${completedCount})`}
                    </button>
                ))}
            </div>

            <div className="mt-4 space-y-4">
                {/* ── ACTIVE CHALLENGES TAB ── */}
                {tab === 'challenges' && (
                    <div className="space-y-4">
                        {invites.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    <Swords className="w-3 h-3" /> Incoming ({invites.length})
                                </span>
                                {invites.map(invite => (
                                    <motion.div key={invite.id} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                        className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Avatar className="w-8 h-8 border border-orange-500/30">
                                                    <AvatarImage src={getMuslimAvatarUrl(invite.from_id)} />
                                                    <AvatarFallback className="text-[8px] bg-orange-500/20 text-orange-400">?</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <span className="text-xs font-bold text-foreground">A Peer challenges you!</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider">
                                                            {invite.type === 'sprint' ? '⚡ Sprint' : invite.type === 'endurance' ? '🏋️ Endurance' : '📊 Daily'}
                                                        </span>
                                                        <span className="text-[8px] text-muted-foreground">• {invite.target} dhikr</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleInviteAction(invite, 'accept')}
                                                    className="flex-1 py-2 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5">
                                                    <Check className="w-3 h-3" /> Accept
                                                </button>
                                                <button onClick={() => handleInviteAction(invite, 'decline')}
                                                    className="px-4 py-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeChallenges.length > 0 ? (
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    <Flame className="w-3 h-3" /> In Progress
                                </span>
                                {activeChallenges.map(challenge => {
                                    const progress = Math.min((challenge.myCount / challenge.target) * 100, 100);
                                    const opponentProgress = Math.min((challenge.opponentCount / challenge.target) * 100, 100);
                                    const ct = CHALLENGE_TYPES.find(c => c.type === challenge.type);
                                    const Icon = ct?.icon || Target;
                                    return (
                                        <motion.div key={challenge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className={`rounded-2xl border p-4 ${ct?.bg || 'bg-secondary/30 border-border/50'}`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`w-4 h-4 ${ct?.color}`} />
                                                    <span className="text-xs font-black text-foreground">{ct?.label}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Timer className="w-3 h-3" />
                                                    <span className="text-[9px] font-bold">{getTimeElapsed(challenge.startedAt)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">You</span>
                                                    <span className="text-[10px] font-black text-foreground tabular-nums">{challenge.myCount}/{challenge.target}</span>
                                                </div>
                                                <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                                                    <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Opponent</span>
                                                    <span className="text-[10px] font-black text-foreground/60 tabular-nums">{challenge.opponentCount}/{challenge.target}</span>
                                                </div>
                                                <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                                                    <motion.div className="h-full bg-orange-500/60 rounded-full" initial={{ width: 0 }} animate={{ width: `${opponentProgress}%` }} transition={{ duration: 0.5 }} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : invites.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 mb-4">
                                    <Swords className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                                <span className="text-sm font-bold text-foreground/50 mb-1">No Active Challenges</span>
                                <span className="text-[10px] text-muted-foreground max-w-[200px]">Go to the Invite tab to challenge someone!</span>
                            </motion.div>
                        ) : null}
                    </div>
                )}

                {/* ── INVITE TAB ── */}
                {tab === 'invite' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-1">Select Challenge Type</span>
                            <div className="grid grid-cols-3 gap-2">
                                {CHALLENGE_TYPES.map(ct => {
                                    const Icon = ct.icon;
                                    const isSelected = selectedType === ct.type;
                                    return (
                                        <button key={ct.type} onClick={() => setSelectedType(ct.type)}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${isSelected ? `${ct.bg} ring-1 ring-offset-1 ring-offset-background` : 'bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05]'
                                                }`}>
                                            <Icon className={`w-5 h-5 ${isSelected ? ct.color : 'text-muted-foreground/40'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? ct.color : 'text-muted-foreground/60'}`}>{ct.label}</span>
                                            <span className="text-[7px] text-muted-foreground/40 font-bold">{ct.duration}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <Users className="w-3 h-3 text-green-400" /> Online Now ({onlineUsers.length})
                            </span>
                            {onlineUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Users className="w-6 h-6 text-muted-foreground/20 mb-3" />
                                    <span className="text-xs font-bold text-muted-foreground/40">No peers online</span>
                                    <span className="text-[9px] text-muted-foreground/30 mt-1">Share the app to invite friends!</span>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {onlineUsers.map(user => {
                                        const dhikrName = dhikrs.find(d => d.id === user.last_dhikr_id)?.transliteration || 'Dhikr';
                                        return (
                                            <motion.div key={user.user_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5 hover:bg-foreground/[0.04] transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Avatar className="w-9 h-9 border border-foreground/10">
                                                            <AvatarImage src={user.avatar_url || getMuslimAvatarUrl(user.user_id)} />
                                                            <AvatarFallback className="text-[9px] bg-primary/20 text-primary font-bold">?</AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground/80">Peer</span>
                                                        <span className="text-[8px] font-bold text-primary/40 uppercase tracking-wider">{dhikrName}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => sendInvite(user.user_id, selectedType)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all text-[9px] font-black uppercase tracking-wider">
                                                    <Swords className="w-3 h-3" /> Challenge
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── HISTORY TAB ── */}
                {tab === 'history' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                <Trophy className="w-4 h-4 text-yellow-400 mb-1" />
                                <span className="text-lg font-black text-foreground tabular-nums">{completedCount}</span>
                                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Won</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                <Flame className="w-4 h-4 text-orange-400 mb-1" />
                                <span className="text-lg font-black text-foreground tabular-nums">{activeChallenges.length}</span>
                                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Active</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                <Star className="w-4 h-4 text-primary mb-1" />
                                <span className="text-lg font-black text-foreground tabular-nums">{totalAllTime}</span>
                                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-1">Challenge Rewards</span>
                            {[
                                { title: 'First Challenge', desc: 'Complete your first challenge', icon: Crown, req: 1, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                                { title: 'Sprint Master', desc: 'Complete 5 challenges', icon: Zap, req: 5, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                                { title: 'Endurance King', desc: 'Complete 10 challenges', icon: Trophy, req: 10, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                            ].map(r => {
                                const unlocked = completedCount >= r.req;
                                const Icon = r.icon;
                                return (
                                    <div key={r.title} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${unlocked ? r.color : 'bg-foreground/[0.02] border-foreground/5 opacity-50'}`}>
                                        <div className={`p-2 rounded-lg ${unlocked ? '' : 'grayscale'}`}>
                                            <Icon className={`w-4 h-4 ${unlocked ? '' : 'text-muted-foreground/30'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-xs font-bold ${unlocked ? 'text-foreground' : 'text-muted-foreground/50'}`}>{r.title}</span>
                                            <p className="text-[9px] text-muted-foreground/50">{r.desc}</p>
                                        </div>
                                        {unlocked ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-[8px] font-bold text-muted-foreground/30">{completedCount}/{r.req}</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-1">Solo Practice</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => { startTasbih100(undefined); /* toast.success('⚡ 100 Sprint started!'); */ }}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15 hover:bg-yellow-500/10 transition-all group">
                                    <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black text-foreground">Sprint 100</span>
                                        <span className="text-[7px] text-muted-foreground font-bold">Solo mode</span>
                                    </div>
                                </button>
                                <button onClick={() => { startTasbih1000(undefined); /* toast.success('🎯 1000 Endurance started!'); */ }}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 hover:bg-blue-500/10 transition-all group">
                                    <Trophy className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black text-foreground">Endure 1000</span>
                                        <span className="text-[7px] text-muted-foreground font-bold">Solo mode</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
