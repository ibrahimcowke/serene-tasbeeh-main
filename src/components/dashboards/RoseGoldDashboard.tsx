import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Flame, Star, Globe, Shield, ChevronLeft, ChevronRight, RotateCcw, BadgeCheck, Trophy } from 'lucide-react';

import { CounterVisuals } from '@/components/CounterVisuals';
import { StyleCenter } from '@/components/StyleCenter';
import { Shapes, Settings as LucideSettings } from 'lucide-react';

// ─── Circular Gauge ─────────────────────────────────────────────
const CircularGauge = ({ value, color }: { value: number; color: string }) => {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r={r} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="24" cy="24" r={r} fill="transparent" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black" style={{ color }}>{Math.round(value)}%</span>
            </div>
        </div>
    );
};

// ─── Stat Pill ──────────────────────────────────────────────────
const StatPill = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-center justify-between px-4 py-2 rounded-full"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-white/80">{value}</span>
    </div>
);

// ─── Main Component ─────────────────────────────────────────────
export const RoseGoldDashboard: React.FC = () => {
    const {
        currentCount, targetCount, increment, undo, reset, currentDhikr,
        streakDays, dailyGoal, totalAllTime, unlockedAchievements, sessionMode,
        showTransliteration, hadithSlideDuration, theme, themeSettings,
        counterShape, counterScale, counterVerticalOffset, countFontSize
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
    const streakProg = Math.min((streakDays / 30) * 100, 100);

    const sessionLabel = sessionMode.type === 'tasbih100'
        ? `Phase ${sessionMode.currentPhase + 1} of 4`
        : `Phase 1 of 4`;

    return (
        <div className="w-full min-h-[100dvh] lg:h-screen flex flex-col font-outfit select-none lg:overflow-hidden relative"
            style={{ background: '#16181b' }}
        >
            {/* Ambient glows */}
            <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(183,110,80,0.05) 0%, transparent 100%)' }} />

            <div className="absolute top-6 right-6 z-20 flex gap-3">
                <button
                    onClick={() => setIsStyleCenterOpen(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-[#b76e50] transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <Shapes size={20} />
                </button>
            </div>

            <StyleCenter isOpen={isStyleCenterOpen} onClose={() => setIsStyleCenterOpen(false)} initialTab="shapes" />

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 overflow-y-auto">

                {/* Arabic text */}
                <div className="text-center space-y-2">
                    <motion.p key={currentDhikr.id}
                        className="font-amiri text-5xl lg:text-6xl text-[#b76e50]"
                        style={{ textShadow: '0 0 30px rgba(183,110,80,0.3)' }}
                    >{currentDhikr.arabic}</motion.p>
                    {showTransliteration && (
                        <p className="text-2xl font-black tracking-[0.4em] uppercase text-white/40">{currentDhikr.transliteration}</p>
                    )}
                    <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.3em]">{sessionLabel}</p>
                </div>

                {/* Ring Counter */}
                <div className="relative group cursor-pointer" onClick={increment}>
                    {/* Ring Rim */}
                    <div className="absolute -inset-4 rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #b76e50 0%, #3a2a22 50%, #e8a880 100%)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.2)',
                            opacity: 0.15,
                        }}
                    />
                    <div className="relative z-10 scale-110">
                        <CounterVisuals
                            layout="default"
                            counterShape={counterShape}
                            counterVerticalOffset={counterVerticalOffset}
                            counterScale={counterScale}
                            progress={progress / 100}
                            currentCount={currentCount}
                            currentSettings={themeSettings[theme] || themeSettings['light']}
                            countFontSize={countFontSize} handleTap={increment} showCompletion={false}
                            disabled={false}
                        />
                    </div>
                </div>

                {/* Wisdom Card */}
                <div className="w-full max-w-lg hidden sm:block">
                    <div className="rounded-[2rem] p-6 text-center relative overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">فضائل الذكر</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#b76e50]/40" />
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <p className="arabic text-xl text-white/60 leading-relaxed">{currentDhikr.hadiths?.[hadithIndex]?.text || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ'}</p>
                                <p className="text-[10px] text-white/20 mt-3 italic">— {currentDhikr.hadiths?.[hadithIndex]?.source || 'Sahih Muslim'}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetalIconButton = ({ icon: Icon, onClick, size = 'md' }: any) => (
    <motion.button
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 transition-colors ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}`}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
    </motion.button>
);

const Settings = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
