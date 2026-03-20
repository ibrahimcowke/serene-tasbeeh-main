import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
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
    Layout,
    Moon,
    Undo2,
    RefreshCw,
    Layers,
    BadgeCheck,
    Flame,
    Palette
} from 'lucide-react';
import { SkeuoCounter } from './SkeuoCounter';
import { RadialAchievement } from './RadialAchievement';
import { FramedWisdom } from './FramedWisdom';

import { CounterVisuals, CounterNumber } from './CounterVisuals';
import { HadithSlider } from './HadithSlider';
import { StyleCenter } from './StyleCenter';

export const PremiumHub = () => {
    const [isStyleCenterOpen, setIsStyleCenterOpen] = useState(false);
    const {
        currentDhikr,
        currentCount: count, // Kept original alias for count
        targetCount: total,
        increment,
        reset,
        undo,
        totalAllTime,
        dailyGoal,
        counterShape,
        dateContext,
         streakDays,
        dailyRecords,
        unlockedAchievements,
        sessionMode,
    } = useTasbeehStore();

    // Calculate Today's Count
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = dailyRecords.find(r => r.date === todayStr);
    const todayCount = (todayRecord?.totalCount || 0) + count;

    // Calculate Rank based on total All Time
    const getRankInfo = (totalCount: number) => {
        const total = totalCount || 0;
        if (total >= 10000) return { title: 'MASTER', next: 25000, prog: Math.min(100, (total / 25000) * 100) };
        if (total >= 5000) return { title: 'DEVOTED', next: 10000, prog: (total / 10000) * 100 };
        if (total >= 1000) return { title: 'APPRENTICE', next: 5000, prog: (total / 5000) * 100 };
        return { title: 'SEEKER', next: 1000, prog: (total / 1000) * 100 };
    };

    const rankInfo = getRankInfo(totalAllTime);

    return (
        <div className="w-full h-full bg-transparent relative overflow-hidden flex flex-col">

            {/* Premium Background Ambient Glows */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Hub Content */}
            <div className="flex-1 w-full grid grid-cols-12 gap-4 lg:gap-6 p-4 lg:pt-0 lg:px-6 lg:pb-6 relative z-10 overflow-hidden">

                {/* Main Counter Area (Full Width) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-12 flex flex-col gap-3 lg:gap-4 items-center justify-start pt-0 relative h-full overflow-hidden"
                >
                    {/* Center plateau effect */}
                    <div className="absolute inset-x-0 top-0 bottom-[-20px] bg-gradient-to-b from-foreground/[0.03] to-transparent rounded-[3rem] blur-sm -z-10 border border-foreground/[0.05]" />

                    {/* Controls */}
                    <div className="absolute top-1/4 left-0 flex flex-col gap-2 bg-card/80 backdrop-blur-md p-2 rounded-r-[2rem] border border-foreground/5 border-l-0 shadow-2xl z-20">
                        <button onClick={(e) => { e.stopPropagation(); undo(); }} className="p-3 hover:bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground transition-colors"><Undo2 className="w-5 h-5" /></button>
                        <div className="w-full h-px bg-foreground/5" />
                        <button onClick={(e) => { e.stopPropagation(); reset(); }} className="p-3 hover:bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground transition-colors"><RefreshCw className="w-5 h-5" /></button>
                        <div className="w-full h-px bg-foreground/5" />
                        <button onClick={(e) => { e.stopPropagation(); setIsStyleCenterOpen(true); }} className="p-3 bg-primary/10 hover:bg-primary/20 rounded-full text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] group"><Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" /></button>
                    </div>

                    <div className="flex flex-col items-center text-center gap-3 relative z-10 w-full max-w-lg mx-auto mt-4">
                        <motion.h1 key={currentDhikr.id + '-arabic'} className="text-7xl font-arabic text-primary mb-1 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] leading-[1.15]" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>{currentDhikr.arabic}</motion.h1>
                        <motion.span key={currentDhikr.id + '-translit'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black tracking-[0.4em] text-foreground/90 uppercase">{currentDhikr.transliteration}</motion.span>
                    </div>

                    <div className="relative z-10 w-full mb-8 flex flex-col justify-center items-center pb-4">
                        <CounterVisuals
                            layout="hub"
                            counterShape={counterShape}
                            counterVerticalOffset={0}
                            counterScale={1.2}
                            progress={total > 0 ? count / total : 0}
                            currentCount={count}
                            currentSettings={{ soundEnabled: true, hapticEnabled: true, vibrationIntensity: 'medium', fontScale: 1, soundType: 'click' }}
                            handleTap={increment}
                            showCompletion={false}
                            countFontSize={1}
                            disabled={false}
                        />
                        <div className="w-full max-w-[606px] mt-8">
                            <HadithSlider dhikr={currentDhikr} />
                        </div>
                    </div>
                </motion.div>

            </div>

            <StyleCenter isOpen={isStyleCenterOpen} onClose={() => setIsStyleCenterOpen(false)} />
        </div>
    );
};
