import { motion } from 'framer-motion';
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
    Moon,
    Undo2,
    RefreshCw,
    Layers,
    BadgeCheck,
    Flame
} from 'lucide-react';
import { SkeuoCounter } from './SkeuoCounter';
import { RadialAchievement } from './RadialAchievement';
import { FramedWisdom } from './FramedWisdom';
import { GlobalStats } from './GlobalStats';
import { GlobalChallenges } from './GlobalChallenges';
import { VisitorCounter } from './VisitorCounter';
import { CounterVisuals, CounterNumber } from './CounterVisuals';
import { HadithSlider } from './HadithSlider';

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
        dateContext,
        globalCount,
        fetchGlobalCount,
        streakDays,
        dailyRecords,
        unlockedAchievements
    } = useTasbeehStore();

    // Calculate Today's Count
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = dailyRecords.find(r => r.date === todayStr);
    const todayCount = (todayRecord?.totalCount || 0) + count;

    // Calculate Rank based on total All Time
    const getRankInfo = (total: number) => {
        if (total >= 10000) return { title: 'MASTER', next: 25000, prog: Math.min(100, (total / 25000) * 100) };
        if (total >= 5000) return { title: 'DEVOTED', next: 10000, prog: (total / 10000) * 100 };
        if (total >= 1000) return { title: 'APPRENTICE', next: 5000, prog: (total / 5000) * 100 };
        return { title: 'SEEKER', next: 1000, prog: (total / 1000) * 100 };
    };

    const rankInfo = getRankInfo(totalAllTime);

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

    return (
        <div className="w-full min-h-screen bg-transparent relative overflow-hidden flex flex-col">

            {/* Premium Background Ambient Glows */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Hub Content */}
            <div className="flex-1 w-full grid grid-cols-12 gap-4 lg:gap-8 p-4 lg:pt-2 lg:px-8 lg:pb-8 relative z-10">

                {/* Left Column: Achievement Hub */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-12 lg:col-span-3 flex flex-col gap-3 lg:gap-4"
                >
                    <div className="skeuo-glass rounded-[2.5rem] p-4 flex flex-col items-center border-foreground/[0.08] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 relative z-10">Achievement Hub</h2>
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Your Rank:</span>
                            <h3 className="text-3xl font-black text-foreground tracking-tighter text-glow-gold">{rankInfo.title}</h3>
                        </div>

                        <RadialAchievement progress={Math.round(rankInfo.prog)} title="Level Progress" />

                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
                            <div className="bg-foreground/5 border border-foreground/5 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-1">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-xl font-black text-foreground">{streakDays}</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Day Streak</span>
                            </div>
                            <div className="bg-foreground/5 border border-foreground/5 rounded-2xl p-3 flex flex-col items-center text-center shadow-inner">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                                    <div className="w-2 h-2 rounded-full border border-primary" />
                                </div>
                                <span className="text-xl font-black text-foreground">{todayCount}/{dailyGoal || 100}</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Daily Goal</span>
                            </div>
                        </div>

                        {/* Additional dynamic stats */}
                        <div className="mt-auto w-full pt-4 border-t border-foreground/5 space-y-2.5">
                            <div className="bg-card/80 rounded-full px-4 py-1.5 flex items-center justify-between border border-foreground/5">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-3 h-3 text-blue-500" />
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Total All-Time</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-500">{totalAllTime.toLocaleString()}</span>
                            </div>
                            <div className="bg-card/80 rounded-full px-4 py-1.5 flex items-center justify-between border border-foreground/5">
                                <div className="flex items-center gap-2">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Achievements</span>
                                </div>
                                <span className="text-[8px] font-black text-yellow-500">{unlockedAchievements.length} Unlocked</span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="skeuo-glass rounded-[2.5rem] p-4 border-foreground/[0.08] shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Current Status</span>
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
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active Occasion</span>
                                    <span className="text-xs font-black text-foreground/90">{dateContext?.specialDayName || 'Ramadan Kareem'}</span>
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Star className="w-4 h-4 text-primary" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active Influence</span>
                                <div className="p-2.5 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                        <span className="text-[10px] font-black text-foreground/70">Taqwa Boost</span>
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
                    className="col-span-12 lg:col-span-5 flex flex-col gap-4 lg:gap-6 items-center justify-start pt-2 relative"
                >
                    {/* Center plateau effect */}
                    <div className="absolute inset-x-0 top-0 bottom-[-20px] bg-gradient-to-b from-foreground/[0.03] to-transparent rounded-[3rem] blur-sm -z-10 border border-foreground/[0.05]" />

                    {/* Top Right Controls (Theme & Shape) */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={cycleTheme}
                            className="p-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-primary transition-colors skeuo-glass shadow-lg group relative"
                            title="Change Theme"
                        >
                            <Palette className="w-5 h-5" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary/40 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={cycleShape}
                            className="p-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-primary transition-colors skeuo-glass shadow-lg group relative"
                            title="Change Shape"
                        >
                            <Shapes className="w-5 h-5" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary/40 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </div>

                    {/* Vertical Custom Controls anchored to far left edge */}
                    <div className="absolute top-1/4 left-0 flex flex-col gap-2 bg-card/80 backdrop-blur-md p-2 rounded-r-[2rem] rounded-l-none border border-foreground/5 border-l-0 shadow-2xl z-20">
                        <button
                            onClick={(e) => { e.stopPropagation(); undo(); }}
                            className="p-3 hover:bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <div className="w-full h-px bg-foreground/5" />
                        <button
                            onClick={(e) => { e.stopPropagation(); reset(); }}
                            className="p-3 hover:bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground transition-colors relative"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <div className="w-full h-px bg-foreground/5" />
                        <button className="p-3 hover:bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <Layers className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center gap-3 relative z-10 w-full max-w-lg mx-auto mt-4">
                        <motion.h1
                            className="text-6xl font-arabic text-primary mb-1 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            سُبْحَانَ اللهِ
                        </motion.h1>
                        <span className="text-2xl font-black tracking-[0.4em] text-foreground/90 drop-shadow-sm">SUBHANALLAH</span>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Step 1 of 5</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                            <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Subhanallah x33</span>
                        </div>

                        {/* Hadith Slider restored below Adhkar */}
                        {/* This HadithSlider was moved below the CounterVisuals */}
                    </div>

                    <div className="relative z-10 w-full mb-8 flex flex-col justify-center items-center pb-4">
                        <CounterVisuals
                            layout="hub"
                            counterShape={counterShape}
                            counterVerticalOffset={0}
                            counterScale={1}
                            progress={total > 0 ? count / total : 0}
                            currentCount={count}
                            currentSettings={{ soundEnabled: true, hapticEnabled: true, vibrationIntensity: 'medium', fontScale: 1, soundType: 'click' }}
                            countFontSize={1}
                            handleTap={increment}
                            showCompletion={false}
                            disabled={false}
                        />

                        {/* Hadith Slider moved below Counter */}
                        <div className="w-full max-w-[606px] mt-8">
                            <HadithSlider dhikr={currentDhikr} />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Community */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6"
                >
                    <div className="bg-card/80 backdrop-blur-3xl border border-foreground/[0.08] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.03] to-transparent pointer-events-none" />
                        <div className="p-4 flex items-center justify-between border-b border-foreground/5 relative z-10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Community</h2>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Live</span>
                            </div>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-hide relative z-10 flex-1">
                            {/* Global Pulse Card - Refined */}
                            <div className="bg-foreground/[0.03] border border-foreground/[0.06] rounded-[2rem] p-4 flex flex-col items-center shadow-inner relative overflow-hidden group transition-all hover:bg-foreground/[0.05] hover:border-primary/20">
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
