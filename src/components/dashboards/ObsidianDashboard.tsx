import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Flame, Star, Globe, ChevronLeft, ChevronRight, RotateCcw, BadgeCheck, Trophy } from 'lucide-react';
import { VisitorCounter } from '@/components/VisitorCounter';
import { GlobalChallenges } from '@/components/GlobalChallenges';
import { CounterVisuals } from '@/components/CounterVisuals';

// ─── Flip Digit ────────────────────────────────────────────────
const FlipDigit = ({ digit }: { digit: string }) => (
    <div className="relative w-[52px] h-[72px] flex items-center justify-center overflow-hidden"
        style={{
            background: 'linear-gradient(180deg, #1c1c1f 0%, #111113 50%, #0a0a0c 100%)',
            borderRadius: '6px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
        }}
    >
        {/* center crease */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/80 z-10" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/5 z-10 translate-y-px" />
        <AnimatePresence mode="popLayout">
            <motion.span
                key={digit}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="text-5xl font-mono font-black select-none"
                style={{ color: '#e8e8e8', textShadow: '0 2px 8px rgba(0,0,0,0.8)', lineHeight: 1 }}
            >
                {digit}
            </motion.span>
        </AnimatePresence>
        {/* gloss overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)' }} />
    </div>
);

// ─── Gold Pill Button ───────────────────────────────────────────
const GoldPillBtn = ({ onClick, children, wide }: { onClick?: () => void; children: React.ReactNode; wide?: boolean }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.93 }}
        whileHover={{ brightness: 1.1 } as any}
        className={`flex items-center justify-center gap-2 h-11 font-bold text-[11px] tracking-widest uppercase cursor-pointer ${wide ? 'px-8' : 'w-11'}`}
        style={{
            background: 'linear-gradient(135deg, #c5a055 0%, #e8c87a 40%, #b8912c 100%)',
            borderRadius: '100px',
            boxShadow: '0 4px 12px rgba(197,160,85,0.35), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)',
            color: '#3a2a00',
        }}
    >
        {children}
    </motion.button>
);

// ─── Rank progress bar (linear) ────────────────────────────────
const RankBar = ({ total }: { total: number }) => {
    const milestones = [
        { label: 'SEEKER', max: 1000 },
        { label: 'APPRENTICE', max: 5000 },
        { label: 'DEVOTED', max: 10000 },
        { label: 'MASTER', max: 25000 },
    ];
    const current = milestones.find(m => total < m.max) || milestones[milestones.length - 1];
    const prevMax = milestones[milestones.findIndex(m => m.label === current.label) - 1]?.max || 0;
    const prog = Math.min(((total - prevMax) / (current.max - prevMax)) * 100, 100);

    return (
        <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Your Rank:</span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">Level Progress</span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(197,160,85,0.5)' }}>{current.label}</h3>
            <div className="relative h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prog}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #c5a055, #e8c87a)' }}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Star className="w-3 h-3 text-yellow-400" />
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────
export const ObsidianDashboard: React.FC = () => {
    const {
        currentCount, targetCount, increment, undo, reset, currentDhikr,
        streakDays, dailyGoal, totalAllTime, unlockedAchievements, sessionMode,
        showTransliteration, hadithSlideDuration, dateContext,
        counterShape, counterScale, counterVerticalOffset,
        theme, themeSettings, countFontSize
    } = useTasbeehStore();

    const [hadithIndex, setHadithIndex] = useState(0);
    useEffect(() => { setHadithIndex(0); }, [currentDhikr.id]);
    useEffect(() => {
        if (!currentDhikr.hadiths || currentDhikr.hadiths.length <= 1) return;
        const t = setInterval(() => setHadithIndex(p => (p + 1) % currentDhikr.hadiths!.length), hadithSlideDuration * 1000);
        return () => clearInterval(t);
    }, [currentDhikr.hadiths, hadithSlideDuration]);

    const digits = currentCount.toString().padStart(4, '0').split('');
    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyCount = (useTasbeehStore.getState().dailyRecords.find(r => r.date === todayStr)?.totalCount || 0) + currentCount;

    const sessionLabel = sessionMode.type === 'tasbih100'
        ? `Step ${sessionMode.currentPhase + 1} of 5 · ${currentDhikr.transliteration?.toUpperCase()} ×33`
        : sessionMode.type === 'tasbih1000'
            ? `Set ${sessionMode.currentPhase + 1} of 8 · ${currentDhikr.transliteration?.toUpperCase()} ×125`
            : `${currentCount} / ${targetCount > 0 ? targetCount : '∞'}`;

    return (
        <div className="w-full h-screen flex font-outfit select-none overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0b0b0e 0%, #111115 100%)' }}
        >
            {/* ambient glows */}
            <div className="absolute top-20 left-1/3 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(197,160,85,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(100,80,200,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            {/* ── LEFT PANEL ── */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                className="w-[300px] shrink-0 flex flex-col gap-4 p-5 h-full overflow-y-auto scrollbar-hide"
            >
                {/* Achievement Hub */}
                <div className="rounded-[1.5rem] p-5 flex flex-col gap-5 flex-1"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)' }}
                >
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25">Achievement Hub</h2>

                    <RankBar total={totalAllTime} />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl p-4 flex flex-col items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.15)' }}>
                                <Flame className="w-4 h-4 text-orange-400" />
                            </div>
                            <span className="text-xl font-black text-white">{streakDays}</span>
                            <span className="text-[8px] text-white/25 uppercase tracking-widest font-bold">Day</span>
                        </div>
                        <div className="rounded-2xl p-4 flex flex-col items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(197,160,85,0.15)' }}>
                                <Trophy className="w-4 h-4 text-yellow-400" />
                            </div>
                            <span className="text-xl font-black text-white">{dailyCount}/{dailyGoal}</span>
                            <span className="text-[8px] text-white/25 uppercase tracking-widest font-bold">Daily Goal</span>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5 mt-auto">
                        {[
                            { icon: BadgeCheck, color: 'text-blue-400', label: 'Global Activity', val: `${(totalAllTime || 0).toLocaleString()} Leads (3%)` },
                            { icon: Globe, color: 'text-green-400', label: 'Global Activity', val: 'LIVE' },
                        ].map(({ icon: Icon, color, label, val }) => (
                            <div key={label + val} className="rounded-full px-4 py-2 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="flex items-center gap-2">
                                    <Icon className={`w-3 h-3 ${color}`} />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">{label}</span>
                                </div>
                                <span className={`text-[8px] font-black ${color}`}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wisdom Card */}
                <div className="rounded-[1.5rem] p-5 shrink-0"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">فضائل الذكر</span>
                        <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider" style={{ background: 'rgba(197,160,85,0.15)', color: '#c5a055', border: '1px solid rgba(197,160,85,0.2)' }}>Wisdom</span>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p className="arabic text-base text-white/60 text-center leading-loose">
                                {currentDhikr.hadiths?.[hadithIndex]?.text?.slice(0, 100) || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ'}
                            </p>
                            <p className="text-[10px] text-white/25 text-center mt-2 italic">
                                — {currentDhikr.hadiths?.[hadithIndex]?.source || 'Sahih Muslim'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex gap-1 justify-center mt-3">
                        {currentDhikr.hadiths?.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all ${i === hadithIndex ? 'w-4 bg-yellow-500' : 'w-1 bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── CENTER ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-6 px-4 h-full"
            >
                {/* Arabic + transliteration */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <motion.p key={currentDhikr.id} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="font-amiri text-5xl lg:text-6xl leading-[1.3]"
                        style={{ color: '#c5a055', textShadow: '0 0 30px rgba(197,160,85,0.4)' }}
                    >{currentDhikr.arabic}</motion.p>
                    {showTransliteration && (
                        <p className="text-2xl font-black tracking-[0.35em] uppercase text-white/60">{currentDhikr.transliteration}</p>
                    )}
                    <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest">{sessionLabel}</p>
                </div>

                {/* Mechanical Counter Frame */}
                <div className="flex flex-col items-center gap-4">
                    {(counterShape === 'plain' || counterShape === 'minimal' || counterShape === 'classic') ? (
                        <div className="relative p-4 rounded-2xl"
                            style={{
                                background: 'linear-gradient(180deg, #888 0%, #444 50%, #222 50%, #555 100%)',
                                border: '2px solid #111',
                                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.8)',
                            }}
                        >
                            {/* inner plate */}
                            <motion.div
                                className="cursor-pointer rounded-xl p-4 relative"
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9), 0 2px 4px rgba(255,255,255,0.03)',
                                }}
                                whileTap={{ y: 2, scale: 0.99 }}
                                onClick={increment}
                            >
                                {/* corner screws */}
                                {[[2, 2], [2, 'auto'], [2, 'auto'], [2, 2]].map((_, i) => (
                                    <div key={i} className={`absolute w-2.5 h-2.5 rounded-full ${i === 0 ? 'top-2 left-2' : i === 1 ? 'top-2 right-2' : i === 2 ? 'bottom-2 left-2' : 'bottom-2 right-2'}`}
                                        style={{ background: 'radial-gradient(circle at 35% 35%, #777, #333)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)' }}
                                    />
                                ))}
                                <div className="flex gap-2 px-2">
                                    {digits.map((d, i) => <FlipDigit key={i} digit={d} />)}
                                </div>
                                <div className="text-center mt-3 border-t border-white/5 pt-2">
                                    <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">{currentCount} of {targetCount}</span>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="relative flex items-center justify-center w-full max-w-[280px] lg:max-w-md aspect-square my-2">
                            <CounterVisuals
                                layout="default" counterShape={counterShape} counterVerticalOffset={counterVerticalOffset}
                                counterScale={counterScale} progress={progress / 100} currentCount={currentCount}
                                currentSettings={themeSettings[theme] || themeSettings['light']}
                                countFontSize={countFontSize} handleTap={increment} showCompletion={false} disabled={false}
                            />
                        </div>
                    )}

                    {/* Gold pill buttons */}
                    <div className="flex items-center gap-3">
                        <GoldPillBtn onClick={undo}><ChevronLeft className="w-5 h-5" /></GoldPillBtn>
                        <GoldPillBtn onClick={increment} wide><span className="text-sm">TAP</span></GoldPillBtn>
                        <GoldPillBtn onClick={reset}><RotateCcw className="w-4 h-4" /></GoldPillBtn>
                    </div>

                    <div className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25">Current Session</span>
                        <p className="text-sm font-bold text-white/50 mt-0.5">{currentDhikr.transliteration} ({targetCount} RECITE)</p>
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL: COMMUNITY ── */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                className="w-[300px] shrink-0 flex flex-col gap-4 p-5 h-full overflow-y-auto scrollbar-hide"
            >
                <div className="rounded-[1.5rem] flex flex-col overflow-hidden h-full"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)' }}
                >
                    <div className="p-4 flex items-center justify-between border-b border-white/5">
                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/25">Community</h2>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto scrollbar-hide space-y-4">
                        <div className="rounded-2xl p-4 flex flex-col items-center text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <VisitorCounter />
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">Dhikrs Worldwide</span>
                        </div>
                        <GlobalChallenges />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
