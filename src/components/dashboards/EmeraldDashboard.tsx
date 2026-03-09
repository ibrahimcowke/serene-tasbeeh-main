import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Flame, Undo2, RotateCcw, Star, Minus } from 'lucide-react';
import { CounterVisuals } from '@/components/CounterVisuals';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SessionTimer } from '@/components/SessionTimer';
import { GlobalChallenges } from '@/components/GlobalChallenges';
import { RadialAchievement } from '@/components/RadialAchievement';

export const EmeraldDashboard: React.FC = () => {
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
    const totalRank = totalAllTime >= 10000 ? 'MASTER' : totalAllTime >= 5000 ? 'DEVOTED' : totalAllTime >= 1000 ? 'APPRENTICE' : 'SEEKER';
    const rankProg = totalAllTime >= 10000 ? Math.min(100, (totalAllTime / 25000) * 100) : totalAllTime >= 5000 ? (totalAllTime / 10000) * 100 : totalAllTime >= 1000 ? (totalAllTime / 5000) * 100 : (totalAllTime / 1000) * 100;
    const dailyProgress = Math.min(((totalAllTime % dailyGoal) / dailyGoal) * 100, 100);

    return (
        <div
            className="w-full h-screen p-4 lg:p-6 flex flex-col font-outfit overflow-hidden select-none pb-20 lg:pb-0"
            style={{ background: 'linear-gradient(135deg, #0e1410 0%, #111814 50%, #0e1410 100%)' }}
        >
            {/* Stone texture overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(16,185,129,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            {/* Ambient emerald glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 h-full min-h-0 relative z-10">
                {/* LEFT: Progress Panel */}
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-4 lg:h-full lg:overflow-y-auto scrollbar-hide order-2 lg:order-1"
                >
                    <div className="emerald-glass rounded-[2rem] p-5 flex flex-col gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/50">My Progress</h2>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] text-emerald-400/40 font-bold uppercase tracking-widest">Rank</span>
                            <h3 className="text-3xl font-black tracking-tighter" style={{ color: '#34d399', textShadow: '0 0 20px rgba(52,211,153,0.4)' }}>{totalRank}</h3>
                        </div>

                        <RadialAchievement progress={Math.round(rankProg)} title="Level Progress" />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3 flex flex-col items-center text-center">
                                <Flame className="w-5 h-5 text-orange-400 mb-1" />
                                <span className="text-xl font-black text-white">{streakDays}</span>
                                <span className="text-[8px] font-bold text-emerald-400/40 uppercase tracking-wider">Streak</span>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3 flex flex-col items-center text-center">
                                <Star className="w-5 h-5 text-yellow-400 mb-1" />
                                <span className="text-xl font-black text-white">{unlockedAchievements.length}</span>
                                <span className="text-[8px] font-bold text-emerald-400/40 uppercase tracking-wider">Badges</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-emerald-400/40 uppercase tracking-widest">
                                <span>Daily</span><span>{Math.floor(dailyProgress)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-emerald-500/10 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${dailyProgress}%` }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #059669, #34d399)' }} />
                            </div>
                        </div>
                    </div>

                    <div className="emerald-glass rounded-[2rem] p-5 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/40 block">Status</span>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-4 py-2.5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/50 uppercase">Ramadan Kareem</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-4 py-2.5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/50">Taqwa Boost</span>
                            <span className="text-[9px] font-black text-emerald-400">+15%</span>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-4 py-2.5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/50 uppercase">All-Time</span>
                            <span className="text-[9px] font-black text-emerald-300">{totalAllTime.toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>

                {/* CENTER */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex-[2] flex flex-col items-center justify-center relative lg:h-full scrollbar-hide order-1 lg:order-2 z-10"
                >
                    <div className="flex flex-col items-center gap-1 mb-6">
                        <motion.span key={currentDhikr.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl lg:text-6xl font-amiri leading-[1.2]"
                            style={{ color: '#6ee7b7', textShadow: '0 0 30px rgba(52,211,153,0.3)' }}
                        >{currentDhikr.arabic}</motion.span>
                        {showTransliteration && (
                            <motion.h1 key={currentDhikr.id + '-t'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-2xl font-black tracking-[0.4em] uppercase mt-2"
                                style={{ color: 'rgba(110,231,183,0.7)' }}
                            >{currentDhikr.transliteration}</motion.h1>
                        )}
                        <SessionTimer />
                        {sessionMode.type === 'tasbih100' && (
                            <div className="flex gap-2 mt-2">
                                {[0, 1, 2, 3].map(p => (
                                    <div key={p} className={`w-2 h-2 rounded-full transition-all ${p < sessionMode.currentPhase ? 'bg-emerald-400' : p === sessionMode.currentPhase ? 'bg-emerald-400 scale-150 animate-pulse' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vertical controls left */}
                    <div className="absolute left-0 top-1/3 flex flex-col gap-3 emerald-glass p-2 rounded-r-[2rem] rounded-l-none">
                        <button onClick={undo} className="p-3 rounded-full text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"><Undo2 className="w-5 h-5" /></button>
                        <div className="w-px h-4 bg-emerald-500/10 mx-auto" />
                        <button onClick={decrement} disabled={currentCount === 0} className="p-3 rounded-full text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-20"><Minus className="w-5 h-5" /></button>
                        <div className="w-px h-4 bg-emerald-500/10 mx-auto" />
                        <button onClick={reset} className="p-3 rounded-full text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"><RotateCcw className="w-5 h-5" /></button>
                    </div>

                    <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full -z-10 opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' }} />
                        <CounterVisuals
                            layout="default" counterShape={counterShape} counterVerticalOffset={counterVerticalOffset}
                            counterScale={counterScale} progress={progress / 100} currentCount={currentCount}
                            currentSettings={themeSettings[theme] || themeSettings['light']}
                            countFontSize={countFontSize} handleTap={increment} showCompletion={false} disabled={false}
                        />
                    </div>

                    <div className="mt-6 w-full max-w-lg hidden sm:block">
                        <div className="emerald-glass rounded-[2rem] p-6">
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentDhikr.id}-${hadithIndex}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <p className="arabic text-lg text-center leading-loose" style={{ color: 'rgba(110,231,183,0.7)' }}>{currentDhikr.hadiths?.[hadithIndex]?.text || '"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"'}</p>
                                    <p className="text-[10px] italic text-emerald-400/30 text-center uppercase tracking-widest mt-2">{currentDhikr.hadiths?.[hadithIndex]?.source || 'Hadith'}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: Community */}
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-4 lg:h-full scrollbar-hide order-3"
                >
                    <div className="emerald-glass rounded-[2rem] flex flex-col overflow-hidden h-full">
                        <div className="p-4 flex items-center justify-between border-b border-emerald-500/10">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400/40">Community</h2>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] text-green-400 font-black uppercase">Live</span>
                            </div>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-4 flex flex-col items-center">
                                <VisitorCounter />
                                <span className="text-[10px] font-black text-emerald-400/30 uppercase mt-2 tracking-widest">Dhikrs Worldwide</span>
                            </div>
                            <GlobalChallenges />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
