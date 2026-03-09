import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import {
    Trophy, Flame, Undo2, RotateCcw, Globe, Star, Minus, BadgeCheck
} from 'lucide-react';
import { CounterVisuals } from '@/components/CounterVisuals';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SessionTimer } from '@/components/SessionTimer';
import { GlobalChallenges } from '@/components/GlobalChallenges';
import { RadialAchievement } from '@/components/RadialAchievement';

export const ObsidianDashboard: React.FC = () => {
    const {
        currentCount,
        targetCount,
        increment,
        undo,
        reset,
        currentDhikr,
        streakDays,
        dailyGoal,
        totalAllTime,
        unlockedAchievements,
        sessionMode,
        decrement,
        showTransliteration,
        counterShape,
        counterScale,
        counterVerticalOffset,
        theme,
        themeSettings,
        countFontSize,
        hadithSlideDuration,
    } = useTasbeehStore();

    const [hadithIndex, setHadithIndex] = useState(0);

    useEffect(() => { setHadithIndex(0); }, [currentDhikr.id]);

    useEffect(() => {
        if (!currentDhikr.hadiths || currentDhikr.hadiths.length <= 1) return;
        const timer = setInterval(() => {
            setHadithIndex((prev) => (prev + 1) % currentDhikr.hadiths!.length);
        }, hadithSlideDuration * 1000);
        return () => clearInterval(timer);
    }, [currentDhikr.hadiths, hadithSlideDuration]);

    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const todayStr = new Date().toISOString().split('T')[0];
    const totalRank = totalAllTime >= 10000 ? 'MASTER' : totalAllTime >= 5000 ? 'DEVOTED' : totalAllTime >= 1000 ? 'APPRENTICE' : 'SEEKER';
    const rankProg = totalAllTime >= 10000 ? Math.min(100, (totalAllTime / 25000) * 100) : totalAllTime >= 5000 ? (totalAllTime / 10000) * 100 : totalAllTime >= 1000 ? (totalAllTime / 5000) * 100 : (totalAllTime / 1000) * 100;

    return (
        <div
            className="w-full h-screen p-4 lg:p-6 flex flex-col font-outfit overflow-hidden select-none pb-20 lg:pb-0"
            style={{ background: 'linear-gradient(135deg, #0a0a0c 0%, #111116 50%, #0a0a0c 100%)' }}
        >
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(120,80,200,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(60,120,200,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 h-full min-h-0 relative z-10">

                {/* LEFT PANEL: Achievement Hub */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-4 lg:h-full lg:overflow-y-auto scrollbar-hide order-2 lg:order-1"
                >
                    <div className="obsidian-glass rounded-[2rem] p-5 flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Achievement Hub</h2>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Your Rank</span>
                            <h3 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 20px rgba(180,140,255,0.4)' }}>{totalRank}</h3>
                        </div>

                        <RadialAchievement progress={Math.round(rankProg)} title="Level Progress" />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-1">
                                    <Flame className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="text-xl font-black text-white">{streakDays}</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Day Streak</span>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-1">
                                    <Trophy className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="text-xl font-black text-white">{unlockedAchievements.length}</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Unlocked</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-2 pt-2 border-t border-white/5">
                            <div className="bg-white/[0.03] rounded-full px-4 py-1.5 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-3 h-3 text-blue-400" />
                                    <span className="text-[8px] font-bold text-white/40 uppercase">Total All-Time</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-400">{totalAllTime.toLocaleString()}</span>
                            </div>
                            <div className="bg-white/[0.03] rounded-full px-4 py-1.5 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[8px] font-bold text-white/40 uppercase">Achievements</span>
                                </div>
                                <span className="text-[8px] font-black text-yellow-400">{unlockedAchievements.length} Unlocked</span>
                            </div>
                        </div>
                    </div>

                    <div className="obsidian-glass rounded-[2rem] p-5 flex flex-col gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Current Status</span>
                        <div className="space-y-2">
                            <span className="text-[8px] font-bold text-white/30 uppercase block">Occasion</span>
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-2 flex items-center justify-between">
                                <span className="text-xs font-black text-white/70">Ramadan Kareem</span>
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/50">Taqwa Boost</span>
                                <span className="text-[9px] font-black text-purple-400">+15%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CENTER PANEL */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-[2] flex flex-col items-center justify-center relative lg:h-full scrollbar-hide order-1 lg:order-2 z-10"
                >
                    <div className="flex flex-col items-center gap-1 mb-6">
                        <motion.span
                            key={currentDhikr.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl lg:text-6xl font-amiri text-white/90 drop-shadow-[0_0_30px_rgba(180,140,255,0.3)] leading-[1.2]"
                        >
                            {currentDhikr.arabic}
                        </motion.span>
                        {showTransliteration && (
                            <motion.h1
                                key={currentDhikr.id + '-t'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-black tracking-[0.4em] text-white/60 uppercase mt-2"
                            >
                                {currentDhikr.transliteration}
                            </motion.h1>
                        )}
                        <SessionTimer />
                        {sessionMode.type === 'tasbih100' && (
                            <div className="flex gap-1 mt-2">
                                {[0, 1, 2, 3].map(p => (
                                    <div key={p} className={`w-2 h-2 rounded-full transition-all ${p < sessionMode.currentPhase ? 'bg-purple-400' : p === sessionMode.currentPhase ? 'bg-purple-400 scale-150 animate-pulse' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vertical controls anchored left */}
                    <div className="absolute left-0 top-1/3 flex flex-col gap-3 obsidian-glass p-2 rounded-r-[2rem] rounded-l-none">
                        <button onClick={undo} className="p-3 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-colors">
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-auto" />
                        <button onClick={decrement} disabled={currentCount === 0} className="p-3 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-20">
                            <Minus className="w-5 h-5" />
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-auto" />
                        <button onClick={reset} className="p-3 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-colors">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full opacity-20 blur-2xl -z-10" style={{ background: 'radial-gradient(circle, rgba(180,140,255,0.3) 0%, transparent 70%)' }} />
                        <CounterVisuals
                            layout="default"
                            counterShape={counterShape}
                            counterVerticalOffset={counterVerticalOffset}
                            counterScale={counterScale}
                            progress={progress / 100}
                            currentCount={currentCount}
                            currentSettings={themeSettings[theme] || themeSettings['light']}
                            countFontSize={countFontSize}
                            handleTap={increment}
                            showCompletion={false}
                            disabled={false}
                        />
                    </div>

                    <div className="mt-6 w-full max-w-lg hidden sm:block">
                        <div className="obsidian-glass rounded-[2rem] p-6">
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                                    <p className="arabic text-lg text-center text-white/70 leading-loose">{currentDhikr.hadiths?.[hadithIndex]?.text || '"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"'}</p>
                                    <p className="text-[10px] italic text-white/30 text-center uppercase tracking-widest">{currentDhikr.hadiths?.[hadithIndex]?.source || 'Hadith'}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT PANEL: Global Community */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-4 lg:h-full lg:overflow-y-auto scrollbar-hide order-3"
                >
                    <div className="obsidian-glass rounded-[2rem] flex flex-col overflow-hidden h-full">
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Community</h2>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Live</span>
                            </div>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-4 flex flex-col items-center">
                                <VisitorCounter />
                                <span className="text-[10px] font-black text-white/20 uppercase mt-2 tracking-widest">Dhikrs Worldwide</span>
                            </div>
                            <GlobalChallenges />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
