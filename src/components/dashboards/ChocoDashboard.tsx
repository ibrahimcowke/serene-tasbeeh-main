import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import {
    Trophy,
    Flame,
    Target,
    ChevronLeft,
    ChevronRight,
    Undo2,
    RotateCcw,
    Palette,
    Globe,
    CheckCircle2,
    Clock,
    ExternalLink,
    Star,
    X,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CounterVisuals } from '@/components/CounterVisuals';
import { VisitorCounter } from '@/components/VisitorCounter';
import { SessionTimer } from '@/components/SessionTimer';
import { GlobalChallenges } from '@/components/GlobalChallenges';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes } from '@/lib/constants';

export const ChocoDashboard: React.FC = () => {
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
        setTheme,
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
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setHadithIndex(0);
    }, [currentDhikr.id]);

    useEffect(() => {
        if (!currentDhikr.hadiths || currentDhikr.hadiths.length <= 1 || isPaused) return;
        const timer = setInterval(() => {
            setHadithIndex((prev) => (prev + 1) % currentDhikr.hadiths!.length);
        }, hadithSlideDuration * 1000);
        return () => clearInterval(timer);
    }, [currentDhikr.hadiths, hadithSlideDuration, isPaused]);

    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const dailyProgress = Math.min(((totalAllTime % dailyGoal) / dailyGoal) * 100, 100);

    return (
        <div className="w-full h-screen choco-dashboard p-4 lg:p-6 flex flex-col font-outfit overflow-hidden select-none pb-20 lg:pb-0">

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 h-full min-h-0 relative z-10">

                {/* LEFT PANEL: MY PROGRESS */}
                <div className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-6 lg:h-full lg:overflow-y-auto pr-2 scrollbar-hide order-2 lg:order-1 custom-scrollbar">
                    <div className="choco-clay p-6 flex flex-col gap-5 shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight opacity-70">MY PROGRESS</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="choco-inner p-4 w-20 h-24 flex flex-col items-center justify-center gap-1">
                                    <span className="text-[10px] font-bold opacity-40 leading-none">YOUR</span>
                                    <span className="text-[10px] font-bold opacity-70 leading-none">SEEKER</span>
                                    <Trophy className="w-8 h-8 text-[#c5a059] mt-1" />
                                </div>
                            </div>

                            <div className="flex-1 h-24 flex items-end gap-1 px-2">
                                {[40, 60, 45, 80, 70, 90, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-[#8b6e37] to-[#e9d5a3] rounded-sm opacity-80"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold tracking-wider opacity-60">
                                <span>Level Progress</span>
                                <span>{Math.floor(progress)}%</span>
                            </div>
                            <div className="h-3 choco-inner overflow-hidden p-[2px]">
                                <motion.div
                                    className="h-full choco-gradient-gold rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="choco-inner p-5 flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black tracking-widest opacity-40">STREAK</span>
                                <div className="relative flex items-center justify-center">
                                    <Flame className="w-10 h-10 text-[#c5a059] fill-[#c5a059]/20" />
                                    <span className="absolute text-lg font-black mt-1 ml-0">{streakDays}</span>
                                </div>
                                <div className="w-full h-1 bg-[#1c130f] rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-[#c5a059] w-3/4 opacity-50" />
                                </div>
                                <span className="text-[8px] font-bold opacity-40">PROGRESS</span>
                            </div>

                            <div className="choco-inner p-5 flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black tracking-widest opacity-40">DAILY GOAL</span>
                                <div className="relative w-14 h-14 rounded-full border-4 border-[#1c130f] flex items-center justify-center">
                                    <span className="text-xs font-black">{totalAllTime % dailyGoal}/{dailyGoal}</span>
                                </div>
                                <div className="w-full h-1 bg-[#1c130f] rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-[#c5a059]" style={{ width: `${dailyProgress}%` }} />
                                </div>
                                <span className="text-[8px] font-bold opacity-40">DAILY GOAL</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="choco-inner py-3 px-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 opacity-40" />
                                    <span className="text-[10px] font-bold opacity-50 tracking-wider">TOTAL ALL-TIME</span>
                                </div>
                                <span className="text-xs font-black">{totalAllTime.toLocaleString()}</span>
                            </div>
                            <div className="choco-inner py-3 px-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star className="w-4 h-4 opacity-40" />
                                    <span className="text-[10px] font-bold opacity-50 tracking-wider">ACHIEVEMENTS</span>
                                </div>
                                <span className="text-xs font-black">{unlockedAchievements.length} Unlocked</span>
                            </div>
                        </div>
                    </div>

                    <div className="choco-clay p-6 flex flex-col gap-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black tracking-widest opacity-40">CURRENT STATUS</span>
                            <div className="flex items-center gap-2 bg-[#1c130f] px-3 py-1 rounded-full border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[8px] font-bold opacity-60">RAMADAN</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold opacity-40 block uppercase">Active Occasion</span>
                                <span className="text-xs font-bold">Ramadan Kareem</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="choco-button p-2"><ChevronLeft className="w-3 h-3" /></button>
                                <button className="choco-button p-2"><ChevronRight className="w-3 h-3" /></button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[8px] font-bold opacity-40 block uppercase">Active Influence</span>
                            <div className="choco-inner px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-3 h-3 text-[#c5a059]" />
                                    <span className="text-[10px] font-bold">Taqwa Boost</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#c5a059]">+15% Focus</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER PANEL: THE COUNTER */}
                <div className="flex-[2] flex flex-col items-center justify-center relative py-4 lg:py-8 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide order-1 lg:order-2 z-10 scale-90 lg:scale-[0.85] xl:scale-95 2xl:scale-100 origin-center">
                    <div className="flex flex-col items-center gap-1 mb-4 lg:mb-8">
                        <span className="text-3xl lg:text-4xl arabic font-amiri text-glow-gold">{currentDhikr.arabic}</span>
                        <AnimatePresence mode="wait">
                            {showTransliteration && (
                                <motion.h1
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-lg lg:text-2xl font-black tracking-[0.2em] opacity-80 uppercase text-center mt-2"
                                >
                                    {currentDhikr.transliteration}
                                </motion.h1>
                            )}
                        </AnimatePresence>

                        <div className="mt-2 scale-110 lg:scale-125">
                            <SessionTimer />
                        </div>

                        {sessionMode.type === 'tasbih100' && (
                            <div className="flex flex-col items-center gap-2 mt-4">
                                <div className="flex justify-center gap-2">
                                    {[0, 1, 2, 3].map((phase) => (
                                        <div
                                            key={phase}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${phase < sessionMode.currentPhase
                                                ? 'bg-[#c5a059]'
                                                : phase === sessionMode.currentPhase
                                                    ? 'bg-[#c5a059] animate-pulse scale-150 shadow-[0_0_10px_rgba(197,160,89,0.5)]'
                                                    : 'bg-white/10'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase">
                                    Phase {sessionMode.currentPhase + 1} of 4
                                </span>
                            </div>
                        )}

                        {sessionMode.type === 'tasbih1000' && (
                            <div className="flex flex-col items-center gap-2 mt-4">
                                <span className="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase">
                                    Set {sessionMode.currentPhase + 1} of 8 • {Math.floor((sessionMode.currentPhase * 125) + currentCount)}/1000
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Floating Actions */}
                    <div className="absolute left-4 lg:left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={undo}
                            className="choco-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group"
                        >
                            <Undo2 className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                            <span className="absolute -bottom-6 text-[8px] font-black opacity-30 whitespace-nowrap hidden lg:block uppercase">Undo</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={decrement}
                            disabled={currentCount === 0}
                            className="choco-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group disabled:opacity-20"
                        >
                            <Minus className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                            <span className="absolute -bottom-6 text-[8px] font-black opacity-30 whitespace-nowrap hidden lg:block uppercase">Minus</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={reset}
                            className="choco-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group"
                        >
                            <RotateCcw className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                            <span className="absolute -bottom-6 text-[8px] font-black opacity-30 whitespace-nowrap hidden lg:block uppercase">Reset</span>
                        </motion.button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="choco-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group"
                                >
                                    <Palette className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                                </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="right" className="w-48 bg-[#1c130f]/95 backdrop-blur-xl border-white/5 choco-clay text-white">
                                <DropdownMenuLabel className="text-[10px] font-black tracking-widest opacity-40">SELECT THEME</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <div className="max-h-64 overflow-y-auto scrollbar-hide p-1">
                                    {themes.map((t) => (
                                        <DropdownMenuItem
                                            key={t.id}
                                            onClick={() => setTheme(t.id as any)}
                                            className={`flex items-center justify-between gap-2 cursor-pointer text-xs font-bold hover:bg-white/5 ${theme === t.id ? 'text-[#c5a059]' : 'opacity-60'}`}
                                        >
                                            <span>{t.label}</span>
                                            {theme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* MAIN COUNTER RING / INTEGRATED COUNTER VISUALS */}
                    <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 choco-rim-3d rounded-full scale-105 opacity-10 blur-sm -z-10" />

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

                    {/* WISDOM CARD - Reduced Margin */}
                    <div
                        className="mt-6 lg:mt-8 w-full max-w-lg hidden sm:block"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="choco-clay p-6 lg:p-8 relative overflow-hidden">
                            {/* Progress Bar for Hadith */}
                            {currentDhikr.hadiths && currentDhikr.hadiths.length > 1 && !isPaused && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                                    <motion.div
                                        key={hadithIndex}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: hadithSlideDuration, ease: "linear" }}
                                        className="h-full bg-[#c5a059]/40"
                                    />
                                </div>
                            )}

                            <div className="absolute top-4 left-4 p-1.5 choco-inner rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-[#c5a059]" />
                            </div>

                            <div className="absolute top-4 right-8 flex items-center gap-3">
                                {isPaused && (
                                    <span className="text-[8px] font-black tracking-widest opacity-20 uppercase animate-pulse">Paused</span>
                                )}
                                <span className="font-amiri text-xs opacity-40 italic">فضائل الذكر</span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${currentDhikr.id}-${hadithIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-4 lg:space-y-6 pt-2"
                                >
                                    <p className="arabic text-lg lg:text-xl leading-loose text-center opacity-90 px-4 min-h-[4rem] flex items-center justify-center">
                                        {currentDhikr.hadiths?.[hadithIndex]?.text || '"كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ..."'}
                                    </p>
                                    <div className="space-y-3 lg:space-y-4">
                                        <p className="text-xs lg:text-sm italic opacity-60 text-center leading-relaxed min-h-[2.5rem] flex items-center justify-center">
                                            {currentDhikr.hadiths?.[hadithIndex]?.source || 'A light word on the tongue, heavy on the scale, and beloved to the Merciful.'}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <div className="flex gap-1">
                                                {currentDhikr.hadiths && currentDhikr.hadiths.length > 1 && currentDhikr.hadiths.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 rounded-full transition-all duration-300 ${i === hadithIndex ? 'w-4 bg-[#c5a059]' : 'w-1 bg-[#c5a059]/20'}`}
                                                    />
                                                ))}
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-6 lg:h-8 text-[8px] lg:text-[10px] items-center gap-2 opacity-40 hover:opacity-100">
                                                View More <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: GLOBAL COMMUNITY */}
                <div className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-6 lg:h-full lg:overflow-y-auto pl-2 scrollbar-hide order-3 custom-scrollbar">
                    <div className="choco-clay p-6 flex flex-col gap-5 shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight opacity-70">GLOBAL COMMUNITY</h2>
                            <div className="flex items-center gap-2 bg-[#1c130f] px-3 py-1 rounded-full border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[8px] font-bold opacity-60">LIVE</span>
                            </div>
                        </div>

                        <div className="choco-inner aspect-video flex items-center justify-center group overflow-hidden relative sm:hidden lg:flex">
                            <Globe className="w-20 h-20 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c130f]/40" />
                        </div>

                        <div className="scale-90 lg:scale-100 origin-top">
                            <VisitorCounter />
                        </div>

                        <div className="space-y-4">
                            <div className="choco-inner p-5 space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Active Challenges</span>
                                </div>
                                <div className="scale-90 origin-top">
                                    <GlobalChallenges />
                                </div>
                            </div>

                            <div className="choco-inner p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black tracking-tight leading-none uppercase">1 Million Salawat</h3>
                                        <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Community Goal</span>
                                    </div>
                                    <Star className="w-4 h-4 text-[#c5a059] opacity-40" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black">
                                        <span className="text-[#c5a059]">15%</span>
                                        <span className="opacity-30">Goal Progress</span>
                                    </div>
                                    <div className="h-2 choco-inner overflow-hidden p-[1px]">
                                        <div className="h-full choco-gradient-gold w-[15%] rounded-full" />
                                    </div>
                                </div>
                                <button className="w-full choco-button h-10 choco-text-gold font-black text-[9px] tracking-widest uppercase">
                                    Join Force →
                                </button>
                            </div>

                            <div className="choco-inner p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black tracking-tight leading-none uppercase">500k Istighfar</h3>
                                        <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Active Night</span>
                                    </div>
                                    <Target className="w-4 h-4 text-[#c5a059] opacity-40" />
                                </div>
                                <div className="h-2 choco-inner overflow-hidden" />
                                <button className="w-full choco-button h-10 choco-text-gold font-black text-[9px] tracking-widest opacity-40 cursor-not-allowed uppercase">
                                    Locked
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
