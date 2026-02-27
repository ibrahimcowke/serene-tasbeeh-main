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
        <div className="w-full min-h-screen bg-rock-hub relative overflow-hidden flex flex-col">

            {/* Top Navigation Bar */}
            <div className="w-full h-16 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md border-b border-white/5 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Users className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold text-white/70 tracking-widest">2</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">10 RAMADAN 1447</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <main className="flex-1 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 relative z-10">

                {/* Left Column: Achievement Hub */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-3 flex flex-col gap-6"
                >
                    <div className="skeuo-glass rounded-[2rem] p-8 flex flex-col items-center flex-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-12">Achievement Hub</h2>

                        <div className="flex flex-col items-center gap-2 mb-12">
                            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Your Rank:</span>
                            <h3 className="text-3xl font-black text-white tracking-tighter text-glow-gold">SEEKER</h3>
                        </div>

                        <RadialAchievement progress={1} title="Level Progress" />

                        <div className="grid grid-cols-2 gap-4 w-full mt-12">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center shadow-inner">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                                    <Activity className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-xl font-black text-white">1</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Day</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center shadow-inner">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                                    <div className="w-2 h-2 rounded-full border border-primary" />
                                </div>
                                <span className="text-xl font-black text-white">1/100</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Daily Goal</span>
                            </div>
                        </div>

                        {/* Additional stats matching screenshot bottom left */}
                        <div className="mt-auto w-full pt-6 border-t border-white/5 space-y-4">
                            <div className="bg-black/20 rounded-full px-4 py-2 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-sm bg-blue-500" />
                                    <span className="text-[8px] font-bold text-white/40 uppercase">Global Activity</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-500">11/100 (Leads 2%)</span>
                            </div>
                            <div className="bg-black/20 rounded-full px-4 py-2 flex items-center justify-between border border-white/5">
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
                    className="lg:col-span-12 xl:col-span-5 flex flex-col gap-12 items-center justify-center pt-8"
                >
                    <div className="flex flex-col items-center text-center gap-2">
                        <motion.h1
                            className="text-7xl font-arabic text-primary/90 mb-2"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        >
                            سُبْحَانَ اللهِ
                        </motion.h1>
                        <span className="text-xl font-black tracking-[0.3em] text-white/80">SUBHANALLAH</span>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Step 1 of 5</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Subhanallah x33</span>
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
                    className="lg:col-span-4 flex flex-col gap-6"
                >
                    <div className="bg-green-950/20 backdrop-blur-3xl border border-green-500/10 rounded-[2rem] flex flex-col overflow-hidden h-full">
                        <div className="p-8 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Community</h2>
                                <ChevronDown className="w-4 h-4 text-white/40" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500 font-black uppercase">Live</span>
                            </div>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide">
                            {/* Global Pulse Card */}
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-2 mb-4 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <Users className="w-3 h-3 text-primary" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Community Pulse</span>
                                </div>
                                <VisitorCounter />
                                <span className="text-[10px] font-bold text-primary/60 uppercase mt-2">Dhikrs Worldwide</span>
                                <div className="flex items-center gap-1.5 mt-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[8px] font-black text-green-500 uppercase">Live</span>
                                </div>
                            </div>

                            {/* Challenges */}
                            <div className="space-y-4">
                                <GlobalChallenges />
                            </div>
                        </div>

                        {/* Contribution footer simulated card style */}
                        <div className="mt-auto p-4 px-8 pb-8">
                            <div className="bg-primary/5 rounded-2xl p-4 border border-white/5 text-center">
                                <p className="text-[10px] text-white/40 font-medium italic">"The believers in their mutual kindness, compassion and sympathy are just like one body..."</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </main>

            {/* Bottom Right Decoration */}
            <div className="absolute bottom-8 right-8 z-30 pointer-events-none opacity-50">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0L24.4903 15.5097L40 20L24.4903 24.4903L20 40L15.5097 24.4903L0 20L15.5097 15.5097L20 0Z" fill="white" />
                </svg>
            </div>
        </div>
    );
};
