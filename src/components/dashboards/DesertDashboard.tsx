import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Flame, Undo2, RotateCcw, Star, Trophy, Target, Minus } from 'lucide-react';
import { CounterVisuals } from '@/components/CounterVisuals';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SessionTimer } from '@/components/SessionTimer';
import { GlobalChallenges } from '@/components/GlobalChallenges';

export const DesertDashboard: React.FC = () => {
    const {
        currentCount, targetCount, increment, undo, reset, currentDhikr,
        streakDays, dailyGoal, totalAllTime, unlockedAchievements, sessionMode,
        decrement, showTransliteration, counterShape, counterScale,
        counterVerticalOffset, theme, themeSettings, countFontSize, hadithSlideDuration,
    } = useTasbeehStore();

    const [hadithIndex, setHadithIndex] = useState(0);

    useEffect(() => { setHadithIndex(0); }, [currentDhikr.id]);
    useEffect(() => {
        if (!currentDhikr.hadiths || currentDhikr.hadiths.length <= 1) return;
        const timer = setInterval(() => setHadithIndex(p => (p + 1) % currentDhikr.hadiths!.length), hadithSlideDuration * 1000);
        return () => clearInterval(timer);
    }, [currentDhikr.hadiths, hadithSlideDuration]);

    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const dailyProgress = Math.min(((totalAllTime % dailyGoal) / dailyGoal) * 100, 100);
    const totalRank = totalAllTime >= 10000 ? 'MASTER' : totalAllTime >= 5000 ? 'DEVOTED' : totalAllTime >= 1000 ? 'APPRENTICE' : 'SEEKER';

    return (
        <div className="desert-dashboard w-full h-screen p-4 lg:p-6 flex flex-col font-outfit overflow-hidden select-none pb-20 lg:pb-0">
            {/* Sand grain overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(218,204,168,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(138,112,82,0.2) 0%, transparent 50%)`,
                }}
            />

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 h-full min-h-0 relative z-10">
                {/* LEFT PANEL */}
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-4 lg:h-full lg:overflow-y-auto scrollbar-hide order-2 lg:order-1"
                >
                    <div className="desert-clay rounded-[1.5rem] p-5 flex flex-col gap-4 border border-white/10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#4a3b2c]/70">MY PROGRESS</h2>

                        <div className="flex items-center gap-3">
                            <div className="desert-inner rounded-xl p-4 w-20 h-20 flex flex-col items-center justify-center">
                                <Trophy className="w-8 h-8 text-[#6b4c2a]" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#4a3b2c]/60 mt-1">{totalRank}</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-[9px] font-black text-[#4a3b2c]/60 uppercase">
                                    <span>Progress</span><span>{Math.floor(progress)}%</span>
                                </div>
                                <div className="h-3 desert-inner rounded-full overflow-hidden p-[2px]">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                        className="h-full rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #8a7052, #dacca8)' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="desert-inner rounded-xl p-4 flex flex-col items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#4a3b2c]/50">STREAK</span>
                                <div className="flex items-center gap-1">
                                    <Flame className="w-5 h-5 text-amber-700" />
                                    <span className="text-2xl font-black text-[#4a3b2c]">{streakDays}</span>
                                </div>
                                <span className="text-[7px] font-bold text-[#4a3b2c]/40 uppercase">Days</span>
                            </div>
                            <div className="desert-inner rounded-xl p-4 flex flex-col items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#4a3b2c]/50">GOAL</span>
                                <span className="text-xl font-black text-[#4a3b2c]">{totalAllTime % dailyGoal}/{dailyGoal}</span>
                                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(74,59,44,0.1)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${dailyProgress}%`, background: '#8a7052' }} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="desert-inner rounded-xl px-4 py-2.5 flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase text-[#4a3b2c]/50">All-Time</span>
                                <span className="text-[9px] font-black text-[#6b4c2a]">{totalAllTime.toLocaleString()}</span>
                            </div>
                            <div className="desert-inner rounded-xl px-4 py-2.5 flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase text-[#4a3b2c]/50">Achievements</span>
                                <span className="text-[9px] font-black text-[#6b4c2a]">{unlockedAchievements.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="desert-clay rounded-[1.5rem] p-5 flex flex-col gap-3 border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a3b2c]/60">STATUS</span>
                        <div className="desert-inner rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-[#4a3b2c]/60">Occasion</span>
                            <span className="text-[9px] font-black text-[#6b4c2a]">Ramadan</span>
                        </div>
                        <div className="desert-inner rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-[#4a3b2c]/60">Boost</span>
                            <span className="text-[9px] font-black text-[#8a7052]">+15% Focus</span>
                        </div>
                    </div>
                </motion.div>

                {/* CENTER */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex-[2] flex flex-col items-center justify-center relative lg:h-full scrollbar-hide order-1 lg:order-2 z-10"
                >
                    <div className="flex flex-col items-center gap-1 mb-6">
                        <motion.span key={currentDhikr.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl lg:text-6xl font-amiri leading-[1.2] text-[#4a3b2c]"
                            style={{ textShadow: '2px 2px 4px rgba(74,59,44,0.2)' }}
                        >{currentDhikr.arabic}</motion.span>
                        {showTransliteration && (
                            <motion.h1 key={currentDhikr.id + '-t'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-xl font-black tracking-[0.35em] uppercase mt-2 text-[#6b4c2a]/80"
                            >{currentDhikr.transliteration}</motion.h1>
                        )}
                        <SessionTimer />
                        {sessionMode.type === 'tasbih100' && (
                            <div className="flex gap-2 mt-2">
                                {[0, 1, 2, 3].map(p => (
                                    <div key={p} className={`w-2 h-2 rounded-sm transition-all ${p < sessionMode.currentPhase ? 'bg-[#8a7052]' : p === sessionMode.currentPhase ? 'bg-[#6b4c2a] scale-150' : 'bg-[#4a3b2c]/20'}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vertical controls */}
                    <div className="absolute left-0 top-1/3 flex flex-col gap-3 desert-clay p-2 rounded-r-[1.5rem] rounded-l-none border border-l-0 border-white/10">
                        <button onClick={undo} className="p-3 rounded-lg text-[#4a3b2c]/40 hover:text-[#4a3b2c] hover:bg-black/5 transition-colors"><Undo2 className="w-5 h-5" /></button>
                        <div className="w-px h-3 bg-[#4a3b2c]/10 mx-auto" />
                        <button onClick={decrement} disabled={currentCount === 0} className="p-3 rounded-lg text-[#4a3b2c]/40 hover:text-[#4a3b2c] hover:bg-black/5 transition-colors disabled:opacity-20"><Minus className="w-5 h-5" /></button>
                        <div className="w-px h-3 bg-[#4a3b2c]/10 mx-auto" />
                        <button onClick={reset} className="p-3 rounded-lg text-[#4a3b2c]/40 hover:text-[#4a3b2c] hover:bg-black/5 transition-colors"><RotateCcw className="w-5 h-5" /></button>
                    </div>

                    <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 rounded-2xl opacity-20 -z-10 desert-clay" style={{ borderRadius: '2rem' }} />
                        <CounterVisuals
                            layout="default" counterShape={counterShape} counterVerticalOffset={counterVerticalOffset}
                            counterScale={counterScale} progress={progress / 100} currentCount={currentCount}
                            currentSettings={themeSettings[theme] || themeSettings['light']}
                            countFontSize={countFontSize} handleTap={increment} showCompletion={false} disabled={false}
                        />
                    </div>

                    <div className="mt-6 w-full max-w-lg hidden sm:block">
                        <div className="desert-clay rounded-[1.5rem] p-6 border border-white/10">
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <p className="arabic text-lg text-center leading-loose text-[#4a3b2c]">{currentDhikr.hadiths?.[hadithIndex]?.text || '"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"'}</p>
                                    <p className="text-[10px] italic text-[#6b4c2a]/50 text-center uppercase tracking-widest mt-2">{currentDhikr.hadiths?.[hadithIndex]?.source || 'Hadith'}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: Community */}
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-4 lg:h-full scrollbar-hide order-3"
                >
                    <div className="desert-clay rounded-[1.5rem] flex flex-col overflow-hidden h-full border border-white/10">
                        <div className="p-4 flex items-center justify-between border-b border-[#4a3b2c]/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#4a3b2c]/60">Community</h2>
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#4a3b2c]/10 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse" />
                                <span className="text-[10px] text-[#6b4c2a] font-black uppercase">Live</span>
                            </div>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                            <div className="desert-inner rounded-xl p-4 flex flex-col items-center">
                                <VisitorCounter />
                                <span className="text-[9px] font-black text-[#4a3b2c]/40 uppercase mt-2 tracking-widest">Worldwide</span>
                            </div>
                            <GlobalChallenges />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
