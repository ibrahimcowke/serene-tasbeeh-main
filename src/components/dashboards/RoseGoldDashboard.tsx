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

export const RoseGoldDashboard: React.FC = () => {
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
        <div className="w-full h-screen rose-gold-dashboard p-4 lg:p-6 flex flex-col font-outfit overflow-hidden select-none pb-20 lg:pb-0">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 h-full min-h-0 relative z-10">
                {/* LEFT PANEL: MY PROGRESS */}
                <div className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-6 lg:h-full lg:overflow-y-auto pr-2 scrollbar-hide order-2 lg:order-1 custom-scrollbar">
                    <div className="rose-gold-clay p-6 flex flex-col gap-5 shrink-0">
                        <div className="flex items-center justify-between text-glow-gold">
                            <h2 className="text-xl font-bold tracking-tight opacity-70">MY PROGRESS</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="rose-gold-inner p-4 w-20 h-24 flex flex-col items-center justify-center gap-1">
                                    <span className="text-[10px] font-bold opacity-40 leading-none">YOUR</span>
                                    <span className="text-[10px] font-bold opacity-70 leading-none">RANK</span>
                                    <Trophy className="w-8 h-8 text-[#e6a88b] mt-1" />
                                </div>
                            </div>

                            <div className="flex-1 h-24 flex items-end gap-1 px-2">
                                {[40, 60, 45, 80, 70, 90, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-[#ba765b] to-[#f5cfc4] rounded-sm opacity-80"
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
                            <div className="h-3 rose-gold-inner overflow-hidden p-[2px]">
                                <motion.div
                                    className="h-full rose-gold-gradient-gold rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rose-gold-inner p-5 flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black tracking-widest opacity-40 uppercase">STREAK</span>
                                <div className="relative flex items-center justify-center">
                                    <Flame className="w-10 h-10 text-[#e6a88b] fill-[#e6a88b]/20" />
                                    <span className="absolute text-lg font-black mt-1 ml-0">{streakDays}</span>
                                </div>
                                <div className="w-full h-1 bg-[#0f1013] rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-[#e6a88b] w-3/4 opacity-50" />
                                </div>
                                <span className="text-[8px] font-bold opacity-40 uppercase">DAYS</span>
                            </div>

                            <div className="rose-gold-inner p-5 flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black tracking-widest opacity-40 uppercase">GOAL</span>
                                <div className="relative w-14 h-14 rounded-full border-4 border-[#0f1013] flex items-center justify-center">
                                    <span className="text-xs font-black">{totalAllTime % dailyGoal}/{dailyGoal}</span>
                                </div>
                                <div className="w-full h-1 bg-[#0f1013] rounded-full overflow-hidden mt-1">
                                    <div className="h-full bg-[#e6a88b]" style={{ width: `${dailyProgress}%` }} />
                                </div>
                                <span className="text-[8px] font-bold opacity-40 uppercase">TARGET</span>
                            </div>
                        </div>
                    </div>

                    <div className="rose-gold-clay p-6 flex flex-col gap-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black tracking-widest opacity-40 uppercase">STATUS</span>
                            <div className="flex items-center gap-2 bg-[#0f1013] px-3 py-1 rounded-full border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-[#e6a88b] animate-pulse" />
                                <span className="text-[8px] font-bold opacity-60">ACTIVE</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold opacity-40 block uppercase">OCCASION</span>
                                    <span className="text-xs font-bold uppercase">Ramadan Kareem</span>
                                </div>
                            </div>
                            <div className="rose-gold-inner px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-3 h-3 text-[#e6a88b]" />
                                    <span className="text-[10px] font-bold uppercase">Taqwa Boost</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#e6a88b]">+15% Focus</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER PANEL: THE COUNTER */}
                <div className="flex-[2] flex flex-col items-center justify-center relative py-4 lg:py-8 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide order-1 lg:order-2 z-10 scale-90 lg:scale-[0.85] xl:scale-95 2xl:scale-100 origin-center">
                    <div className="flex flex-col items-center gap-1 mb-4 lg:mb-8">
                        <motion.span
                            key={currentDhikr.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl lg:text-5xl font-amiri text-[#e6a88b] drop-shadow-[0_0_15px_rgba(230,168,139,0.3)]"
                        >
                            {currentDhikr.arabic}
                        </motion.span>
                        <AnimatePresence mode="wait">
                            {showTransliteration && (
                                <motion.h1
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-lg lg:text-2xl font-black tracking-[0.2em] opacity-80 uppercase text-center mt-2 text-[#e6a88b]"
                                >
                                    {currentDhikr.transliteration}
                                </motion.h1>
                            )}
                        </AnimatePresence>

                        <div className="mt-2 scale-110 lg:scale-125">
                            <SessionTimer />
                        </div>
                    </div>

                    <div className="absolute left-4 lg:left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={undo}
                            className="rose-gold-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group"
                        >
                            <Undo2 className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={decrement}
                            disabled={currentCount === 0}
                            className="rose-gold-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group disabled:opacity-20"
                        >
                            <Minus className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={reset}
                            className="rose-gold-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group"
                        >
                            <RotateCcw className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                        </motion.button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="rose-gold-button w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center group"
                                >
                                    <Palette className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                                </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="right" className="bg-[#0f1013]/95 backdrop-blur-xl border-white/5 rose-gold-clay text-white">
                                <DropdownMenuLabel className="text-[10px] font-black tracking-widest opacity-40">SELECT THEME</DropdownMenuLabel>
                                <div className="max-h-64 overflow-y-auto scrollbar-hide p-1">
                                    {themes.map((t) => (
                                        <DropdownMenuItem
                                            key={t.id}
                                            onClick={() => setTheme(t.id as any)}
                                            className={`flex items-center justify-between gap-2 cursor-pointer text-xs font-bold hover:bg-white/5 ${theme === t.id ? 'text-[#e6a88b]' : 'opacity-60'}`}
                                        >
                                            <span>{t.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 rose-gold-rim-3d rounded-full scale-105 opacity-10 blur-sm -z-10" />
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

                    <div className="mt-6 lg:mt-8 w-full max-w-lg hidden sm:block">
                        <div className="rose-gold-clay p-6 lg:p-8 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${currentDhikr.id}-${hadithIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <p className="arabic text-lg lg:text-xl text-center opacity-90 px-4 min-h-[4rem] flex items-center justify-center text-[#e6a88b]">
                                        {currentDhikr.hadiths?.[hadithIndex]?.text || '"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"'}
                                    </p>
                                    <p className="text-xs italic opacity-40 text-center uppercase tracking-widest">
                                        {currentDhikr.hadiths?.[hadithIndex]?.source || 'Hadith Source'}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: GLOBAL COMMUNITY */}
                <div className="flex-1 max-w-sm w-full mx-auto flex flex-col gap-6 lg:h-full lg:overflow-y-auto pl-2 scrollbar-hide order-3 custom-scrollbar">
                    <div className="rose-gold-clay p-6 flex flex-col gap-5 shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight opacity-70 uppercase">World Feed</h2>
                            <div className="flex items-center gap-2 bg-[#0f1013] px-3 py-1 rounded-full border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[8px] font-bold opacity-60">LIVE</span>
                            </div>
                        </div>

                        <div className="rose-gold-inner aspect-video flex items-center justify-center relative sm:hidden lg:flex overflow-hidden">
                            <Globe className="w-20 h-20 opacity-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1013] to-transparent" />
                        </div>

                        <VisitorCounter />

                        <div className="space-y-4">
                            <div className="rose-gold-inner p-5 space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block">Global Event</span>
                                <GlobalChallenges />
                            </div>

                            <div className="rose-gold-inner p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xs font-black uppercase">Community Pool</h3>
                                    <Star className="w-4 h-4 text-[#e6a88b] opacity-40" />
                                </div>
                                <div className="h-2 rose-gold-inner overflow-hidden">
                                    <div className="h-full rose-gold-gradient-gold w-[35%] rounded-full opacity-60" />
                                </div>
                                <Button className="w-full rose-gold-button h-10 text-[#e6a88b] font-black text-[9px] uppercase tracking-widest border-none">
                                    Contribute
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
