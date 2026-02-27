import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, CounterShape } from '@/store/tasbeehStore';
import {
    Settings,
    Bell,
    Calendar,
    ChevronDown,
    Activity,
    Users,
    Plus,
    Star,
    Award,
    Search,
    Palette,
    Shapes,
    Layout,
    Moon
} from 'lucide-react';
import { SkeuoCounter } from './SkeuoCounter';
import { RadialAchievement } from './RadialAchievement';
import { FramedWisdom } from './FramedWisdom';
import { GlobalStats } from './GlobalStats';
import { GlobalChallenges } from './GlobalChallenges';
import { VisitorCounter } from './VisitorCounter';
import { SidebarChallenges } from './SidebarChallenges';

export const PremiumHub = () => {
    const {
        currentDhikr,
        currentCount: count, // Kept original alias for count
        targetCount: total,
        increment,
        reset,
        undo,
        totalAllTime,
        dailyGoal,
        theme,
        setTheme,
        counterShape,
        setCounterShape,
        dateContext
    } = useTasbeehStore();

    const [activeTab, setActiveTab] = useState<'dashboard' | 'community'>('dashboard');

    // Available categories for cycling
    const themes: any[] = [
        'light', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass',
        'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical',
        'theme-steampunk', 'theme-crystal-depth', 'theme-mecca-night', 'theme-medina-rose',
        'theme-blue-mosque', 'theme-desert-starlight', 'theme-sahara-warmth', 'theme-andalusia-earth',
        'theme-istanbul-sunset', 'theme-taj-marble', 'theme-royal-persian', 'theme-ramadan-lantern'
    ];

    const shapes: CounterShape[] = [
        'minimal', 'classic', 'beads', 'flower', 'digital', 'bead-ring', 'halo-ring',
        'luminous-beads', 'helix-strand', 'cyber-hexagon', 'blooming-lotus', 'constellation',
        'smart-ring', 'moon-phase', 'water-ripple', 'sand-hourglass', 'lantern-fanous',
        'digital-watch', 'star-burst', 'crystal-prism', 'galaxy', 'tally-clicker',
        'cyber-3d', 'crystal-iso', 'neumorph'
    ];

    const cycleTheme = () => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const cycleShape = () => {
        const currentIndex = shapes.indexOf(counterShape);
        const nextIndex = (currentIndex + 1) % shapes.length;
        setCounterShape(shapes[nextIndex]);
    };

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

            {/* Main Hub Header with Tabs */}
            <div className="flex flex-col items-center pt-8 pb-4 relative z-20">
                <div className="flex p-1 bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-full shadow-2xl relative">
                    <motion.div
                        className="absolute bg-primary/10 border border-primary/20 rounded-full z-0 h-[calc(100%-8px)]"
                        layoutId="activeTabGlow"
                        initial={false}
                        animate={{
                            x: activeTab === 'dashboard' ? 4 : 110,
                            width: activeTab === 'dashboard' ? 100 : 100
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`relative z-10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-white/30 hover:text-white/50'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('community')}
                        className={`relative z-10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'community' ? 'text-primary' : 'text-white/30 hover:text-white/50'}`}
                    >
                        Community
                    </button>
                </div>
            </div>

            {/* Main Hub Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'dashboard' ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 w-full grid grid-cols-12 gap-4 lg:gap-8 p-4 lg:pt-2 lg:px-8 lg:pb-8 relative z-10"
                    >

                        {/* Left Column: Achievement Hub */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="col-span-12 lg:col-span-3 flex flex-col gap-4 lg:gap-6"
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

                            {/* Status Card - Restored */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="skeuo-glass rounded-[2.5rem] p-6 border-white/[0.08] shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Current Status</span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                        <Moon className="w-2.5 h-2.5 text-primary" />
                                        <span className="text-[8px] font-black text-primary uppercase tracking-tighter">
                                            {dateContext?.hijriDate || '8 Ramadan'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Active Occasion</span>
                                            <span className="text-xs font-black text-white/90">{dateContext?.specialDayName || 'Ramadan Kareem'}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Star className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Active Influence</span>
                                        <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                                <span className="text-[10px] font-black text-white/70">Taqwa Boost</span>
                                            </div>
                                            <span className="text-[9px] font-bold text-primary">+15% Focus</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Center Column: Spiritual Heart */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-12 lg:col-span-5 flex flex-col gap-8 lg:gap-12 items-center justify-start pt-2 relative"
                        >
                            {/* Center plateau effect */}
                            <div className="absolute inset-x-0 top-0 bottom-[-20px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-[3rem] blur-sm -z-10 border border-white/[0.05]" />

                            {/* Quick Controls Island */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={cycleTheme}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-primary transition-colors skeuo-glass shadow-lg group relative"
                                    title="Change Theme"
                                >
                                    <Palette className="w-4 h-4" />
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary/40 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={cycleShape}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-primary transition-colors skeuo-glass shadow-lg group relative"
                                    title="Change Shape"
                                >
                                    <Shapes className="w-4 h-4" />
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary/40 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            </div>

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
                    </motion.div>
                ) : (
                    <motion.div
                        key="community"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 w-full flex flex-col items-center p-4 lg:px-8 pb-8 relative z-10"
                    >
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            {/* Live Peers & Challenges Integration */}
                            <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.08] rounded-[3rem] p-4 lg:p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none" />
                                <SidebarChallenges />
                            </div>

                            {/* Global Context & Challenges */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-white/[0.03] border border-white/[0.06] rounded-[2.5rem] p-8 flex flex-col items-center shadow-inner relative overflow-hidden group transition-all hover:bg-white/[0.05] hover:border-primary/20">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <VisitorCounter />
                                    <span className="text-[12px] font-black text-primary/40 uppercase mt-4 tracking-[0.3em]">Total Global Dhikrs</span>
                                    <GlobalStats />
                                </div>

                                <div className="bg-black/20 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">Active Global Missions</h3>
                                    <GlobalChallenges />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
