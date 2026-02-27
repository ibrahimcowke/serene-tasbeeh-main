import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import {
    Settings,
    Bell,
    Calendar,
    ChevronDown,
    Activity,
    Users
} from 'lucide-react';
import { SkeuoCounter } from './SkeuoCounter';
import { RadialAchievement } from './RadialAchievement';
import { FramedWisdom } from './FramedWisdom';
import { GlobalStats } from './GlobalStats';
import { GlobalChallenges } from './GlobalChallenges';
import { VisitorCounter } from './VisitorCounter';

export const PremiumHub = () => {
    const {
        currentDhikr,
        currentCount: count,
        targetCount: total,
        increment,
        reset,
        undo,
        totalAllTime,
        dailyGoal
    } = useTasbeehStore();

    // Mock wisdom for display (could be from store/API)
    const wisdom = {
        arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ ، عَدَدَ خَلْقِهِ ، وَرِضَا نَفْسِهِ ، وَزِنَةَ عَرْشِهِ ، وَمِدَادَ كَلِمَاتِهِ",
        english: "Glory be to Allah and praise is to Him, according to the number of His creation and according to the pleasure of His Self and according to the weight of His Throne and according to the ink used in recording His words.",
        source: "Sahih Muslim"
    };

    return (
        <div className="w-full min-h-screen bg-transparent relative overflow-hidden flex flex-col">

            {/* Premium Background Ambient Glows */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Hub Content */}
            <div className="flex-1 w-full grid grid-cols-12 gap-4 lg:gap-8 p-4 lg:p-8 relative z-10">

                {/* Left Column: Achievement Hub */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-12 lg:col-span-2 flex flex-col gap-4 lg:gap-6"
                >
                    <div className="skeuo-glass rounded-[2.5rem] p-6 flex flex-col items-center border-white/[0.08] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 relative z-10">Achievement Hub</h2>

                        <div className="flex flex-col items-center gap-1 mb-4">
                            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Your Rank:</span>
                            <h3 className="text-3xl font-black text-white tracking-tighter text-glow-gold">SEEKER</h3>
                        </div>

                        <RadialAchievement progress={1} title="Level Progress" />

                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-1">
                                    <Activity className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-xl font-black text-white">1</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Day</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                                    <div className="w-2 h-2 rounded-full border border-primary" />
                                </div>
                                <span className="text-xl font-black text-white">1/100</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Daily Goal</span>
                            </div>
                        </div>

                        {/* Additional stats matching screenshot bottom left */}
                        <div className="mt-auto w-full pt-4 border-t border-white/5 space-y-2.5">
                            <div className="bg-black/20 rounded-full px-4 py-1.5 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-sm bg-blue-500" />
                                    <span className="text-[8px] font-bold text-white/40 uppercase">Global Activity</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-500">11/100 (Leads 2%)</span>
                            </div>
                            <div className="bg-black/20 rounded-full px-4 py-1.5 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-white/40" />
                                    <span className="text-[8px] font-bold text-white/40 uppercase">Global Activity</span>
                                </div>
                                <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Live</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Center Column: Spiritual Heart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-12 lg:col-span-6 flex flex-col gap-8 lg:gap-12 items-center justify-start pt-12 relative"
                >
                    {/* Center plateau effect */}
                    <div className="absolute inset-x-0 top-0 bottom-[-20px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-[3rem] blur-sm -z-10 border border-white/[0.05]" />

                    <div className="flex flex-col items-center text-center gap-3 relative z-10">
                        <motion.h1
                            className="text-8xl font-arabic text-primary mb-2 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            سُبْحَانَ اللهِ
                        </motion.h1>
                        <span className="text-2xl font-black tracking-[0.4em] text-white/90 drop-shadow-sm">SUBHANALLAH</span>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Step 1 of 5</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                            <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Subhanallah x33</span>
                        </div>
                    </div>

                    <SkeuoCounter
                        count={count}
                        total={total}
                        dhikrName={currentDhikr.transliteration}
                        onIncrement={increment}
                        onReset={reset}
                        onUndo={undo}
                    />

                    <FramedWisdom
                        arabic={wisdom.arabic}
                        english={wisdom.english}
                        source={wisdom.source}
                    />
                </motion.div>

                {/* Right Column: Community */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6"
                >
                    <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.03] to-transparent pointer-events-none" />
                        <div className="p-4 lg:p-6 flex items-center justify-between border-b border-white/5 relative z-10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Community</h2>
                                <ChevronDown className="w-4 h-4 text-white/20" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Live</span>
                            </div>
                        </div>

                        <div className="p-4 lg:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-350px)] scrollbar-hide relative z-10">
                            {/* Global Pulse Card - Refined */}
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-[2rem] p-4 flex flex-col items-center shadow-inner relative overflow-hidden group transition-all hover:bg-white/[0.05] hover:border-primary/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <VisitorCounter />
                                <span className="text-[10px] font-black text-primary/40 uppercase mt-3 tracking-widest">Dhikrs Worldwide</span>
                            </div>

                            {/* Challenges */}
                            <div className="space-y-4">
                                <GlobalChallenges />
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>

        </div>
    );
};
