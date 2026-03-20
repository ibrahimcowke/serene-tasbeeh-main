import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Flame, Globe2, ChevronLeft, ChevronRight, RotateCcw, Star } from 'lucide-react';

import { GlobalChallenges } from '@/components/GlobalChallenges';
import { CounterVisuals } from '@/components/CounterVisuals';
import { StyleCenter } from '@/components/StyleCenter';
import { Shapes } from 'lucide-react';

// ─── Flip Digit (Military style) ────────────────────────────────
const FlipDigit = ({ digit }: { digit: string }) => (
    <div className="relative w-[48px] h-[68px] flex items-center justify-center overflow-hidden"
        style={{
            background: 'linear-gradient(180deg, #1c1c1e 0%, #111 50%, #0a0a0a 100%)',
            borderRadius: '5px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
        }}
    >
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/70 z-10" />
        <AnimatePresence mode="popLayout">
            <motion.span
                key={digit}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-mono font-black text-white/90 select-none"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >{digit}</motion.span>
        </AnimatePresence>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.25) 100%)' }} />
    </div>
);

// ─── Metal Icon Button ──────────────────────────────────────────
const MetalBtn = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        className="w-11 h-11 rounded-full flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 transition-colors"
        style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
            boxShadow: '3px 3px 6px rgba(0,0,0,0.8), -2px -2px 4px rgba(255,255,255,0.04), inset 0 1px 1px rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.05)',
        }}
    >{children}</motion.button>
);

// ─── Arc Progress (semicircle) ──────────────────────────────────
const ArcProgress = ({ progress, rank }: { progress: number; rank: string }) => {
    const r = 70;
    const circumference = Math.PI * r;
    const offset = circumference - (progress / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="180" height="100" viewBox="0 0 180 100">
                <path d={`M 15 95 A ${r} ${r} 0 0 1 165 95`} fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="10" strokeLinecap="round" />
                <path d={`M 15 95 A ${r} ${r} 0 0 1 165 95`} fill="none"
                    stroke="url(#emeraldGrad)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
                <defs>
                    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#065f46" />
                        <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                </defs>
                <text x="90" y="85" textAnchor="middle" fill="rgba(52,211,153,0.9)" fontSize="14" fontWeight="900" fontFamily="Outfit, sans-serif">{Math.round(progress)}%</text>
            </svg>
            <p className="text-[8px] text-emerald-400/40 uppercase tracking-widest font-bold">Level Progress</p>
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────
export const EmeraldDashboard: React.FC = () => {
    const {
        currentCount, targetCount, increment, undo, reset, currentDhikr,
        streakDays, dailyGoal, totalAllTime, unlockedAchievements, sessionMode,
        showTransliteration, hadithSlideDuration, dateContext,
        counterShape, counterScale, counterVerticalOffset,
        theme, themeSettings, countFontSize
    } = useTasbeehStore();

    const [isStyleCenterOpen, setIsStyleCenterOpen] = useState(false);

    const [hadithIndex, setHadithIndex] = useState(0);
    useEffect(() => { setHadithIndex(0); }, [currentDhikr.id]);
    useEffect(() => {
        if (!currentDhikr.hadiths || currentDhikr.hadiths.length <= 1) return;
        const t = setInterval(() => setHadithIndex(p => (p + 1) % currentDhikr.hadiths!.length), hadithSlideDuration * 1000);
        return () => clearInterval(t);
    }, [currentDhikr.hadiths, hadithSlideDuration]);

    const digits = currentCount.toString().padStart(4, '0').split('');
    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const dailyCount = currentCount;
    const totalRank = totalAllTime >= 10000 ? 'MASTER' : totalAllTime >= 5000 ? 'DEVOTED' : totalAllTime >= 1000 ? 'APPRENTICE' : 'SEEKER';
    const prevMax = totalAllTime >= 10000 ? 10000 : totalAllTime >= 5000 ? 5000 : totalAllTime >= 1000 ? 1000 : 0;
    const nextMax = totalAllTime >= 10000 ? 25000 : totalAllTime >= 5000 ? 10000 : totalAllTime >= 1000 ? 5000 : 1000;
    const rankProg = Math.min(((totalAllTime - prevMax) / (nextMax - prevMax)) * 100, 100);

    const sessionLabel = sessionMode.type === 'tasbih100'
        ? `Step ${sessionMode.currentPhase + 1} of 5 · ${currentDhikr.transliteration?.toUpperCase()} ×33`
        : `${currentCount} / ${targetCount > 0 ? targetCount : '∞'}`;

    return (
        <div className="w-full min-h-[100dvh] lg:h-screen flex flex-col lg:flex-row font-outfit select-none lg:overflow-hidden relative"
            style={{ background: '#141614' }}
        >
            {/* Stone texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.12]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '300px 300px',
                }}
            />
            {/* dark overlay for depth */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.05) 0%, transparent 60%)' }} />

            {/* ── TOP DATE BAR ── */}
            <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-emerald-500/10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div className="w-4 h-4 rounded-sm bg-emerald-700/50 flex items-center justify-center">
                        <span className="text-[8px] text-emerald-300">📅</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-300/70">{dateContext?.hijriDate || '10 Ramadan 1447'}</span>
                </div>
                <div className="text-[12px] font-black text-emerald-300/30 uppercase tracking-[0.3em]">سُبْحَانَهُ</div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsStyleCenterOpen(true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-300/40 hover:text-emerald-300 transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <Shapes size={14} />
                    </button>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-[12px]">🔔</span>
                    </div>
                </div>
            </div>

            <StyleCenter isOpen={isStyleCenterOpen} onClose={() => setIsStyleCenterOpen(false)} initialTab="shapes" />

            {/* ── MAIN ROW ── */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0 relative z-10 overflow-y-auto lg:overflow-y-hidden">
                {/* LEFT */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-[270px] shrink-0 flex flex-col gap-3 p-4 lg:overflow-y-auto scrollbar-hide order-2 lg:order-1"
                >
                    <div className="rounded-[1.5rem] p-5 flex flex-col gap-4"
                        style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', backdropFilter: 'blur(20px)', boxShadow: 'inset 0 1px 1px rgba(16,185,129,0.05), 0 15px 35px rgba(0,0,0,0.6)' }}
                    >
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/40">Achievement Hub</h2>
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[9px] text-emerald-400/30 font-bold uppercase tracking-widest">Your Rank:</span>
                            <h3 className="text-3xl font-black text-white tracking-tight" style={{ textShadow: '0 0 20px rgba(52,211,153,0.5)' }}>{totalRank}</h3>
                        </div>

                        <ArcProgress progress={rankProg} rank={totalRank} />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl p-3 flex flex-col items-center gap-1.5" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                                <Flame className="w-5 h-5 text-orange-400" />
                                <span className="text-2xl font-black text-white">{streakDays}</span>
                                <span className="text-[8px] text-emerald-400/40 uppercase tracking-wider font-bold">Day</span>
                            </div>
                            <div className="rounded-2xl p-3 flex flex-col items-center gap-1.5" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                                <div className="w-5 h-5 rounded-full border-2 border-emerald-400/40 flex items-center justify-center" />
                                <span className="text-2xl font-black text-white">{dailyCount}/{dailyGoal}</span>
                                <span className="text-[8px] text-emerald-400/40 uppercase tracking-wider font-bold">Daily Goal</span>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-emerald-500/10 pt-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-emerald-400/30 uppercase">Global Activity</span>
                                <span className="text-[8px] font-black text-emerald-300/60">{totalAllTime.toLocaleString()} Leads (3%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[8px] text-emerald-400/30 font-black uppercase tracking-widest">Global Activity Live</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CENTER */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full lg:flex-1 py-8 lg:py-0 flex flex-col items-center justify-center gap-5 px-4 lg:overflow-y-auto scrollbar-hide order-1 lg:order-2"
                >
                    {/* Arabic dhikr */}
                    <div className="flex flex-col items-center gap-1 text-center">
                        <motion.p key={currentDhikr.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="font-amiri text-5xl leading-[1.3]"
                            style={{ color: '#6ee7b7', textShadow: '0 0 25px rgba(52,211,153,0.35)' }}
                        >{currentDhikr.arabic}</motion.p>
                        {showTransliteration && (
                            <p className="text-2xl font-black tracking-[0.35em] uppercase" style={{ color: 'rgba(110,231,183,0.7)' }}>{currentDhikr.transliteration}</p>
                        )}
                        <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mt-1">{sessionLabel}</p>
                    </div>

                    {/* Counter Frame (military/metal) */}
                    <div className="flex flex-col items-center gap-4">
                        {(counterShape === 'plain' || counterShape === 'minimal' || counterShape === 'classic') ? (
                            <div className="relative p-3 rounded-xl"
                                style={{
                                    background: 'linear-gradient(180deg, #888 0%, #444 50%, #222 50%, #555 100%)',
                                    border: '2px solid #111',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.1)',
                                }}
                            >
                                <motion.div
                                    className="rounded-lg p-3 cursor-pointer relative"
                                    style={{ background: '#1a1a1f', border: '1px solid rgba(16,185,129,0.1)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)' }}
                                    whileTap={{ y: 2 }}
                                    onClick={increment}
                                >
                                    {/* corner screws */}
                                    {['top-1.5 left-1.5', 'top-1.5 right-1.5', 'bottom-1.5 left-1.5', 'bottom-1.5 right-1.5'].map((pos, i) => (
                                        <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full`}
                                            style={{ background: 'radial-gradient(circle at 35% 35%, #666, #222)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)' }}
                                        />
                                    ))}
                                    <div className="flex gap-1.5 px-2">
                                        {digits.map((d, i) => <FlipDigit key={i} digit={d} />)}
                                    </div>
                                    <div className="text-center mt-2 border-t border-white/5 pt-1.5">
                                        <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">{currentCount} of {targetCount}</span>
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

                        {/* Metal icon buttons */}
                        <div className="flex items-center gap-3">
                            <MetalBtn onClick={undo}><Globe2 className="w-4 h-4" /></MetalBtn>
                            <MetalBtn onClick={increment}><Star className="w-4 h-4" /></MetalBtn>
                            <MetalBtn onClick={reset}><RotateCcw className="w-4 h-4" /></MetalBtn>
                        </div>
                    </div>

                    {/* Wooden Framed Wisdom Card */}
                    <div className="w-full max-w-lg hidden sm:block mt-2">
                        <div className="relative rounded-xl overflow-hidden"
                            style={{
                                border: '8px solid #3d2a14',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.6)',
                            }}
                        >
                            {/* wood grain corners */}
                            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #5c3d1a, #4a2e10, #5c3d1a)' }} />
                            <div className="p-5" style={{ background: 'rgba(10,12,10,0.95)' }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }} />
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">فضائل الذكر</span>
                                    </div>
                                    <span className="text-[8px] italic text-white/20">Sahih Muslim</span>
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <p className="arabic text-base text-emerald-300/60 text-center leading-loose">{currentDhikr.hadiths?.[hadithIndex]?.text?.slice(0, 120) || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ'}</p>
                                        <p className="text-[10px] text-white/25 text-center mt-2 italic leading-relaxed">"{currentDhikr.hadiths?.[hadithIndex]?.source || 'Sahih Muslim'}"</p>
                                    </motion.div>
                                </AnimatePresence>
                                <div className="flex gap-1 justify-center mt-3">
                                    {currentDhikr.hadiths?.map((_, i) => (
                                        <div key={i} className={`h-1 rounded-full transition-all ${i === hadithIndex ? 'w-4 bg-emerald-400' : 'w-1 bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: Community */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-[270px] shrink-0 flex flex-col gap-3 p-4 lg:overflow-y-auto scrollbar-hide order-3"
                >
                    <div className="rounded-[1.5rem] flex flex-col overflow-hidden lg:h-full"
                        style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 15px 35px rgba(0,0,0,0.6)' }}
                    >
                        <div className="p-4 flex items-center justify-between border-b border-emerald-500/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400/40">Community</h2>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-black text-green-400 uppercase">Live</span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto scrollbar-hide space-y-4">
                            <div className="rounded-2xl p-4 flex flex-col items-center" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)' }}>
                                {/* VisitorCounter removed */}
                                <span className="text-[9px] text-emerald-400/30 uppercase tracking-widest mt-2 font-bold">Dhikrs Worldwide</span>
                            </div>
                            <GlobalChallenges />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
