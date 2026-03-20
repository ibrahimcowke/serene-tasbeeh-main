import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Trophy, Flame, Target, ChevronLeft, ChevronRight, Undo2, RotateCcw, Palette, CheckCircle2, Star, Minus } from 'lucide-react';
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

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 overflow-y-auto w-full">

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
            </div>
        </div>
    );
};
