import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Trophy, Flame, Target, ChevronLeft, ChevronRight, Undo2, RotateCcw, Palette, Globe, CheckCircle2, Star, Minus } from 'lucide-react';
import { CounterVisuals } from '@/components/CounterVisuals';

import { SessionTimer } from '@/components/SessionTimer';

import { themes } from '@/lib/constants';
import { StyleCenter } from '@/components/StyleCenter';
import { Shapes } from 'lucide-react';

// ─── Circular Gauge (Clay style) ────────────────────────────────
const ClayGauge = ({ value, color }: { value: number; color: string }) => {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r={r} fill="transparent" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                <circle cx="24" cy="24" r={r} fill="transparent" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-black text-white/40">{Math.round(value)}%</span>
            </div>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────
export const ChocoDashboard: React.FC = () => {
    const {
        currentCount, targetCount, increment, undo, reset, currentDhikr,
        streakDays, dailyGoal, totalAllTime, unlockedAchievements, sessionMode,
        decrement, setTheme, showTransliteration, counterShape, counterScale,
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
    const dailyProg = Math.min(((currentCount % dailyGoal) / dailyGoal) * 100, 100);

    return (
        <div className="w-full min-h-[100dvh] lg:h-screen choco-dashboard flex flex-col font-outfit select-none lg:overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #2d1b14 0%, #1c130f 100%)' }}
        >
            {/* Ambient clay glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
                style={{ background: 'radial-gradient(circle at 30% 20%, #c5a059 0%, transparent 40%), radial-gradient(circle at 70% 80%, #8b6e37 0%, transparent 40%)' }}
            />

            {/* ── TOP ACTION BAR ── */}
            <div className="absolute top-6 right-6 z-20 flex gap-3">
                <button
                    onClick={() => setIsStyleCenterOpen(true)}
                    className="choco-button p-3 rounded-full flex items-center justify-center text-white/40 hover:text-[#c5a059] transition-all"
                >
                    <Shapes size={20} />
                </button>
            </div>

            <StyleCenter isOpen={isStyleCenterOpen} onClose={() => setIsStyleCenterOpen(false)} initialTab="shapes" />

            {/* ── CONTENT ROW ── */}
            <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 w-full lg:h-full relative z-10 overflow-y-auto lg:overflow-y-hidden">

                {/* LEFT: MY PROGRESS */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 w-full lg:max-w-sm mx-auto flex flex-col gap-5 lg:h-full lg:overflow-y-auto scrollbar-hide order-2 lg:order-1"
                >
                    <div className="choco-clay p-6 flex flex-col gap-5 shrink-0">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">My Progress</h2>

                        <div className="flex items-center gap-4">
                            <div className="choco-inner w-16 h-20 flex flex-col items-center justify-center gap-1 shrink-0">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">YOUR:</span>
                                <span className="text-[9px] font-black text-white/50 uppercase">SEEKER</span>
                                <Trophy className="w-6 h-6 text-[#c5a059] mt-1" />
                            </div>
                            <div className="flex-1 h-20 flex items-end gap-1 px-1">
                                {[40, 60, 45, 80, 70, 90, 75].map((h, i) => (
                                    <div key={i} className="flex-1 rounded-[2px]"
                                        style={{ height: `${h}%`, background: i === 6 ? '#c5a059' : 'rgba(197,160,89,0.1)' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black text-white/30 uppercase tracking-widest">
                                <span>Level Progress</span>
                                <span className="text-[#c5a059]">3%</span>
                            </div>
                            <div className="h-3 choco-inner overflow-hidden p-[2px]">
                                <motion.div className="h-full bg-[#c5a059] rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="choco-inner p-4 flex flex-col items-center gap-2 text-center">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Streak</span>
                                <ClayGauge value={streakDays} color="#f97316" />
                                <span className="text-base font-black text-white">{streakDays}</span>
                                <span className="text-[7px] font-black text-white/20 uppercase">Progress</span>
                            </div>
                            <div className="choco-inner p-4 flex flex-col items-center gap-2 text-center">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Daily Goal</span>
                                <ClayGauge value={dailyProg} color="#c5a059" />
                                <span className="text-base font-black text-white">{currentCount % dailyGoal}/{dailyGoal}</span>
                                <span className="text-[7px] font-black text-white/20 uppercase">Daily Goal</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/5 mt-auto">
                            <div className="flex items-center justify-between choco-inner px-4 py-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Total All Time</span>
                                <span className="text-[10px] font-black text-white/60">{totalAllTime.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between choco-inner px-4 py-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Achievements</span>
                                <span className="text-[10px] font-black text-white/60">{unlockedAchievements.length} Unlocked</span>
                            </div>
                        </div>
                    </div>

                    {/* Status card */}
                    <div className="choco-clay p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Current Status</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.1)' }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-black text-green-500 uppercase">Live</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Active Occasion</span>
                                <p className="text-sm font-black text-white/80">Ramadan Kareem</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="choco-button p-2"><ChevronLeft size={12} /></button>
                                <button className="choco-button p-2"><ChevronRight size={12} /></button>
                            </div>
                        </div>
                        <div className="choco-inner px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Flame size={12} className="text-[#c5a059]" />
                                <span className="text-[9px] font-black text-white/40 uppercase">Taqwa Boost</span>
                            </div>
                            <span className="text-[9px] font-black text-[#c5a059]">+15% Focus</span>
                        </div>
                    </div>
                </motion.div>

                {/* CENTER: COUNTER */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex-[2] w-full py-8 lg:py-0 flex flex-col items-center justify-center gap-6 px-4 order-1 lg:order-2 lg:h-full lg:overflow-y-auto"
                >
                    <div className="text-center space-y-1">
                        <motion.p key={currentDhikr.id} className="font-amiri text-5xl lg:text-6xl text-[#c5a059]" style={{ textShadow: '0 0 30px rgba(197,160,89,0.3)' }}>{currentDhikr.arabic}</motion.p>
                        {showTransliteration && (
                            <p className="text-xl font-black tracking-[0.3em] uppercase text-white/40">{currentDhikr.transliteration}</p>
                        )}
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">{sessionMode.type === 'tasbih100' ? `Phase ${sessionMode.currentPhase + 1} of 4` : '∞'}</p>
                        <div className="mt-2"><SessionTimer /></div>
                    </div>

                    <div className="relative flex items-center justify-center w-full max-w-[280px] lg:max-w-md aspect-square">
                        <div className="absolute inset-0 choco-rim-3d rounded-full scale-105 opacity-10 blur-sm" />
                        <CounterVisuals
                            layout="default" counterShape={counterShape} counterVerticalOffset={counterVerticalOffset}
                            counterScale={counterScale} progress={progress / 100} currentCount={currentCount}
                            currentSettings={themeSettings[theme] || themeSettings['light']}
                            countFontSize={countFontSize} handleTap={increment} showCompletion={false}
                            disabled={false}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={undo} className="choco-button p-3 rounded-xl"><Undo2 size={20} className="text-white/40" /></button>
                        <button onClick={increment} className="choco-button px-10 py-3 rounded-2xl font-black tracking-widest text-[#c5a059]">TAP</button>
                        <button onClick={reset} className="choco-button p-3 rounded-xl"><RotateCcw size={20} className="text-white/40" /></button>
                    </div>

                    {/* Wisdom Card */}
                    <div className="w-full max-w-lg hidden lg:block">
                        <div className="choco-clay p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">فضائل الذكر</span>
                                <CheckCircle2 size={12} className="text-[#c5a059]/40" />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <p className="arabic text-lg text-white/60 text-center leading-loose">{currentDhikr.hadiths?.[hadithIndex]?.text || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ'}</p>
                                    <p className="text-[10px] text-white/20 text-center mt-3 italic">— {currentDhikr.hadiths?.[hadithIndex]?.source || 'Sahih Muslim'}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: COMMUNITY */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 w-full lg:max-w-sm mx-auto flex flex-col gap-5 lg:h-full lg:overflow-y-auto scrollbar-hide order-3"
                >
                    <div className="choco-clay flex flex-col overflow-hidden lg:h-full">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Community</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-green-500 uppercase">Live</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="p-5 flex-1 overflow-y-auto scrollbar-hide space-y-6">
                            <div className="choco-inner h-32 flex items-center justify-center">
                                <Globe className="w-16 h-16 text-white/5" />
                                <div className="absolute">{/* VisitorCounter removed */}</div>
                            </div>
                            {/* GlobalChallenges removed */}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
