import { useEffect, useState, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Zap, Target, Users, Send, Check, X, Flame, Star, Timer, Crown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { getMuslimAvatarUrl } from '@/lib/avatarUtils';
import { toast } from 'sonner';

interface ActiveChallenge {
    id: string;
    type: 'sprint' | 'endurance' | 'daily';
    target: number;
    startedAt: number;
    myCount: number;
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
                            <span className="text-lg font-black">Practice</span>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Master focus & Earn Hasanat</p>
                        </div>
                    </SheetTitle>
                    <SheetDescription className="sr-only">Start solo dhikr challenges</SheetDescription>
                </SheetHeader>

                <ChallengesViewContent />
            </SheetContent>
        </Sheet>
    );
}

export function ChallengesViewContent({ isPage = false }: { isPage?: boolean }) {
    const { startTasbih100, startTasbih1000, totalAllTime } = useTasbeehStore();
    const [tab, setTab] = useState<'challenges' | 'history'>('challenges');
    const [completedCount, setCompletedCount] = useState(0);

    const activeChallenges: any[] = [];
    const invites: any[] = [];

    const getTimeElapsed = (startedAt: number) => {
        const mins = Math.floor((Date.now() - startedAt) / 60000);
        return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    return (
        <>
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-foreground/[0.03] rounded-xl mt-4 border border-foreground/5">
                {(['challenges', 'history'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all ${tab === t ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                            }`}>
                        {t === 'challenges' ? `Practice` : `Done (${completedCount})`}
                    </button>
                ))}
            </div>

            <div className="mt-4 space-y-4">
                    <div className="space-y-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 mb-4">
                                <Zap className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                            <span className="text-sm font-bold text-foreground/50 mb-1">Practice Center</span>
                            <span className="text-[10px] text-muted-foreground max-w-[200px]">Start a solo sprint or endurance session to sharpen your focus.</span>
                        </motion.div>
                    </div>



                {/* ── HISTORY TAB ── */}
                {tab === 'history' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col items-center p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                <Trophy className="w-4 h-4 text-yellow-400 mb-1" />
                                <span className="text-lg font-black text-foreground tabular-nums">{completedCount}</span>
                                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Won</span>
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
