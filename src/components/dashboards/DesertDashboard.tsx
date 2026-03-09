import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Flame, Undo2, RotateCcw, Trophy, Globe, Star, Minus, Shapes } from 'lucide-react';
import { CounterVisuals } from '@/components/CounterVisuals';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SessionTimer } from '@/components/SessionTimer';
import { GlobalChallenges } from '@/components/GlobalChallenges';
import { StyleCenter } from '@/components/StyleCenter';

// ─── Carved stone stat pill ─────────────────────────────────────
const StonePill = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg"
        style={{
            background: 'linear-gradient(135deg, #c9b899 0%, #b8a37d 100%)',
            boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.4)',
        }}
    >
        <span className="text-[9px] font-black uppercase tracking-widest text-[#4a3322]/60">{label}</span>
        <span className="text-[10px] font-black text-[#4a3322]">{value}</span>
    </div>
);

// ─── Neumorphic counter card ────────────────────────────────────
const StoneCard = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <motion.div
        onClick={onClick}
        whileTap={{ scale: 0.99 }}
        className="cursor-pointer"
        style={{
            background: 'linear-gradient(135deg, #c8b08a 0%, #b89a6a 100%)',
            borderRadius: '1rem',
            padding: '10px',
            boxShadow: '6px 6px 14px rgba(80,50,20,0.4), -4px -4px 10px rgba(255,230,180,0.6), inset 0 0 0 1px rgba(255,255,255,0.3)',
        }}
    >
        {children}
    </motion.div>
);

// ─── Carved button ─────────────────────────────────────────────
const CarvedBtn = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.93 }}
        className="flex items-center justify-center w-12 h-12 rounded-xl"
        style={{
            background: 'linear-gradient(145deg, #c9b899 0%, #a8906a 100%)',
            boxShadow: '3px 3px 8px rgba(80,50,20,0.5), -2px -2px 6px rgba(255,235,180,0.7), inset 0 1px 1px rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#5a3c22',
        }}
    >{children}</motion.button>
);

// ─── Main Component ─────────────────────────────────────────────
export const DesertDashboard: React.FC = () => {
    const {
        currentCount, targetCount, increment, undo, reset, currentDhikr,
        streakDays, dailyGoal, totalAllTime, unlockedAchievements, sessionMode,
        decrement, showTransliteration, counterShape, counterScale,
        counterVerticalOffset, theme, themeSettings, countFontSize, hadithSlideDuration,
    } = useTasbeehStore();

    const [isStyleCenterOpen, setIsStyleCenterOpen] = useState(false);

    const [hadithIndex, setHadithIndex] = useState(0);
    useEffect(() => { setHadithIndex(0); }, [currentDhikr.id]);
    useEffect(() => {
        if (!currentDhikr.hadiths || currentDhikr.hadiths.length <= 1) return;
        const t = setInterval(() => setHadithIndex(p => (p + 1) % currentDhikr.hadiths!.length), hadithSlideDuration * 1000);
        return () => clearInterval(t);
    }, [currentDhikr.hadiths, hadithSlideDuration]);

    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const dailyProgress = Math.min(((currentCount % dailyGoal) / dailyGoal) * 100, 100);
    const totalRank = totalAllTime >= 10000 ? 'MASTER' : totalAllTime >= 5000 ? 'DEVOTED' : totalAllTime >= 1000 ? 'APPRENTICE' : 'SEEKER';

    return (
        <div className="w-full h-screen flex font-outfit select-none overflow-hidden relative"
            style={{ background: 'linear-gradient(160deg, #c4a87a 0%, #b39468 30%, #a5855a 60%, #9c7a4e 100%)' }}
        >
            {/* Stone texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />
            {/* Textured background overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/papyros.png")' }} />

            <div className="absolute top-6 right-6 z-20 flex gap-3">
                <button
                    onClick={() => setIsStyleCenterOpen(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#5d4037]/40 hover:text-[#5d4037] transition-all"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                    <Shapes size={20} />
                </button>
            </div>

            <StyleCenter isOpen={isStyleCenterOpen} onClose={() => setIsStyleCenterOpen(false)} initialTab="shapes" />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(60,35,15,0.5) 100%)' }} />

            {/* ── LEFT PANEL ── */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                className="w-[270px] shrink-0 flex flex-col gap-3 p-4 h-full overflow-y-auto scrollbar-hide"
            >
                {/* MY PROGRESS card */}
                <div className="rounded-[1.25rem] p-5 flex flex-col gap-4 flex-1"
                    style={{
                        background: 'linear-gradient(145deg, #d4bb8a 0%, #c2a47a 100%)',
                        boxShadow: '8px 8px 20px rgba(60,35,15,0.5), -4px -4px 12px rgba(255,240,195,0.6), inset 0 1px 1px rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.35)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5a3c22]/70">My Progress</h2>
                    </div>

                    {/* Scarab badge + bars */}
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                background: 'linear-gradient(145deg, #b8924e 0%, #8a6832 100%)',
                                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,200,100,0.3)',
                                border: '1px solid rgba(255,200,100,0.3)',
                            }}
                        >
                            <Trophy className="w-7 h-7 text-[#f0d080]" />
                        </div>
                        <div className="flex-1 flex items-end gap-1 h-12">
                            {[40, 60, 45, 80, 70, 90, (progress || 10)].map((h, i) => (
                                <div key={i} className="flex-1 rounded-sm"
                                    style={{
                                        height: `${h}%`,
                                        background: i < 6 ? 'linear-gradient(180deg, rgba(90,60,34,0.4) 0%, rgba(90,60,34,0.2) 100%)' : 'linear-gradient(180deg, #8a6832 0%, #b8924e 100%)',
                                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Level progress */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black text-[#5a3c22]/60 uppercase tracking-widest">
                            <span>Level Progress</span><span>{Math.floor(progress)}%</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden p-[2px]"
                            style={{ background: 'inset 2px 2px 4px rgba(0,0,0,0.3)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)' }}
                        >
                            <div className="w-full h-full rounded-full overflow-hidden" style={{ background: 'rgba(90,60,34,0.2)' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #8a6832, #d4a040)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Streak & Daily goal */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Flame, iconColor: '#c0620a', label: 'STREAK', value: streakDays, sub: 'PROGRESS', prog: (streakDays / 30) * 100 },
                            { icon: Star, iconColor: '#8a6832', label: 'DAILY GOAL', value: `${currentCount % dailyGoal}/${dailyGoal}`, sub: 'DAILY GOAL', prog: dailyProgress },
                        ].map(({ icon: Icon, iconColor, label, value, sub, prog }) => (
                            <div key={label} className="rounded-xl p-3 flex flex-col items-center gap-2 text-center"
                                style={{
                                    background: 'linear-gradient(145deg, #cdb98a 0%, #b8a06a 100%)',
                                    boxShadow: '3px 3px 8px rgba(60,35,15,0.4), -2px -2px 6px rgba(255,235,180,0.5), inset 0 1px 1px rgba(255,255,255,0.35)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                }}
                            >
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#5a3c22]/60">{label}</span>
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ background: 'rgba(90,60,34,0.15)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.25)' }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: iconColor }} />
                                    </div>
                                </div>
                                <span className="text-base font-black text-[#4a3020]">{value}</span>
                                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(90,60,34,0.2)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${prog}%`, background: 'linear-gradient(90deg, #8a6832, #d4a040)' }} />
                                </div>
                                <span className="text-[7px] font-bold text-[#5a3c22]/50 uppercase">{sub}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 mt-auto">
                        <StonePill label="Total All-Time" value={totalAllTime.toLocaleString()} />
                        <StonePill label="Achievements" value={`${unlockedAchievements.length} Unlocked`} />
                    </div>
                </div>

                {/* CURRENT STATUS */}
                <div className="rounded-[1.25rem] p-4 space-y-3"
                    style={{
                        background: 'linear-gradient(145deg, #d4bb8a 0%, #c2a47a 100%)',
                        boxShadow: '6px 6px 16px rgba(60,35,15,0.4), -3px -3px 10px rgba(255,240,195,0.5), inset 0 1px 1px rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.35)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#5a3c22]/60">Current Status</span>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: 'rgba(90,60,34,0.15)', border: '1px solid rgba(90,60,34,0.25)' }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#b8924e' }} />
                            <span className="text-[7px] font-black text-[#5a3c22]/60 uppercase tracking-widest">Ramadan</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[7px] text-[#5a3c22]/50 uppercase tracking-widest block mb-0.5">Active Occasion</span>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-[#4a3020]">Ramadan Kareem</span>
                            <div className="flex gap-1.5">
                                {['←', '→', '★'].map(s => (
                                    <div key={s} className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                                        style={{ background: 'rgba(90,60,34,0.15)', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.3)' }}
                                    >{s}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <StonePill label="🔥 Taqwa Boost" value="+15% Focus" />
                </div>
            </motion.div>

            {/* ── CENTER ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-5 px-4 h-full overflow-y-auto scrollbar-hide"
            >
                {/* Dhikr title board */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="px-8 py-3 rounded-xl"
                        style={{ background: 'linear-gradient(145deg, #cdb98a, #b8a06a)', boxShadow: '4px 4px 10px rgba(60,35,15,0.4), -2px -2px 8px rgba(255,235,180,0.5), inset 0 1px 1px rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.3)' }}
                    >
                        <motion.p key={currentDhikr.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="font-amiri text-4xl text-[#4a3020]" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.4)' }}
                        >{currentDhikr.arabic}</motion.p>
                    </div>
                    {showTransliteration && (
                        <p className="font-black tracking-[0.3em] uppercase text-xl text-[#5a3c22]/80">{currentDhikr.transliteration}</p>
                    )}
                    <p className="text-[10px] text-[#5a3c22]/50 uppercase tracking-widest font-bold">
                        {sessionMode.type === 'tasbih100' ? `Phase ${sessionMode.currentPhase + 1} of 4` : `Phase 1 of 4`}
                    </p>
                    <SessionTimer />
                </div>

                {/* Undo/Reset buttons floating left of counter */}
                <div className="relative w-full max-w-md">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex flex-col gap-3 z-20">
                        <CarvedBtn onClick={undo}><Undo2 className="w-5 h-5" /></CarvedBtn>
                        <CarvedBtn onClick={decrement}><Minus className="w-5 h-5" /></CarvedBtn>
                        <CarvedBtn onClick={reset}><RotateCcw className="w-5 h-5" /></CarvedBtn>
                    </div>

                    {/* The iron-bordered ring counter */}
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center">
                        {/* outer wrought iron ring */}
                        <div className="absolute inset-0 rounded-full"
                            style={{
                                background: 'conic-gradient(from 0deg, #555, #777, #444, #888, #555)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.1)',
                                padding: '12px',
                            }}
                        >
                            <div className="w-full h-full rounded-full"
                                style={{ background: 'linear-gradient(145deg, #b89a6a 0%, #a08050 100%)', boxShadow: 'inset 4px 4px 10px rgba(60,35,15,0.4), inset -2px -2px 6px rgba(255,220,150,0.3)' }}
                            />
                        </div>
                        <CounterVisuals
                            layout="default" counterShape={counterShape} counterVerticalOffset={counterVerticalOffset}
                            counterScale={counterScale} progress={progress / 100} currentCount={currentCount}
                            currentSettings={themeSettings[theme] || themeSettings['light']}
                            countFontSize={countFontSize} handleTap={increment} showCompletion={false} disabled={false}
                        />
                    </div>
                </div>

                {/* Parchment Wisdom Card */}
                <div className="w-full max-w-lg hidden sm:block">
                    <div className="rounded-xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #e8d5a8 0%, #d4bc88 100%)',
                            boxShadow: '4px 6px 16px rgba(60,35,15,0.4), -2px -2px 8px rgba(255,235,180,0.5), inset 0 0 30px rgba(180,130,50,0.15)',
                            border: '2px solid rgba(120,80,30,0.4)',
                        }}
                    >
                        {/* top leather strip */}
                        <div className="h-2" style={{ background: 'linear-gradient(90deg, #8a6030, #7a5020, #8a6030)' }} />
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#5a3c22]/50">فضائل الذكر</span>
                                <span className="text-[8px] italic text-[#5a3c22]/40">Bukhari</span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <p className="arabic text-lg text-center text-[#4a3020] leading-loose">{currentDhikr.hadiths?.[hadithIndex]?.text?.slice(0, 120) || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ'}</p>
                                    <p className="text-[10px] text-center text-[#5a3c22]/60 mt-2 italic">A light word on the tongue, heavy on the scale.</p>
                                    <p className="text-[9px] italic text-[#5a3c22]/40 text-right mt-1">— {currentDhikr.hadiths?.[hadithIndex]?.source || 'Bukhari'}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="h-2" style={{ background: 'linear-gradient(90deg, #8a6030, #7a5020, #8a6030)' }} />
                    </div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL: GLOBAL COMMUNITY ── */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                className="w-[270px] shrink-0 flex flex-col gap-3 p-4 h-full overflow-y-auto scrollbar-hide"
            >
                <div className="rounded-[1.25rem] flex flex-col overflow-hidden h-full"
                    style={{
                        background: 'linear-gradient(145deg, #d4bb8a 0%, #c2a47a 100%)',
                        boxShadow: '8px 8px 20px rgba(60,35,15,0.5), -4px -4px 12px rgba(255,240,195,0.6), inset 0 1px 1px rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.35)',
                    }}
                >
                    <div className="p-4 flex items-center justify-between border-b border-[#5a3c22]/15">
                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#5a3c22]/60">Global Community</h2>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(90,60,34,0.15)', border: '1px solid rgba(90,60,34,0.25)' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse" />
                            <span className="text-[8px] font-black text-[#5a3c22]/60 uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {/* Carved world map placeholder */}
                    <div className="mx-4 mt-3 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(90,60,34,0.1)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)', height: '90px', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <Globe className="w-12 h-12 text-[#5a3c22]/20" />
                    </div>

                    <div className="p-4 flex flex-col gap-3 overflow-y-auto scrollbar-hide flex-1">
                        <div className="rounded-xl p-3 text-center"
                            style={{ background: 'rgba(90,60,34,0.1)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <VisitorCounter />
                            <span className="text-[8px] text-[#5a3c22]/50 uppercase tracking-widest font-bold block mt-1">Dhikrs Worldwide</span>
                        </div>
                        <GlobalChallenges />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
