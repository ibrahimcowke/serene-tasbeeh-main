import React from 'react';
import { motion } from 'framer-motion';
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
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
        sessionMode
    } = useTasbeehStore();

    const progress = Math.min((currentCount / targetCount) * 100, 100);
    const dailyProgress = Math.min((totalAllTime % dailyGoal / dailyGoal) * 100, 100);

    return (
        <div className="w-full h-full min-h-[800px] choco-dashboard p-6 lg:p-10 flex flex-col lg:flex-row gap-8 font-outfit overflow-y-auto">

            {/* LEFT PANEL: MY PROGRESS */}
            <div className="flex-1 max-w-sm flex flex-col gap-6">
                <div className="choco-clay p-8 flex flex-col gap-6">
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

                {/* STATUS CARD (BOTTOM LEFT) */}
                <div className="choco-clay p-6 flex flex-col gap-4">
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
                            <button className="choco-button p-2"><Star className="w-3 h-3" /></button>
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
            <div className="flex-[1.5] flex flex-col items-center justify-center relative py-12">
                <div className="flex flex-col items-center gap-1 mb-8">
                    <span className="text-4xl arabic font-amiri text-[#c5a059]">{currentDhikr.arabic}</span>
                    <h1 className="text-2xl font-black tracking-[0.2em] opacity-80 uppercase">{currentDhikr.transliteration}</h1>
                    {sessionMode.type === 'tasbih100' && (
                        <span className="text-[10px] font-bold opacity-40 tracking-widest mt-2">• Phase {sessionMode.currentPhase + 1} of 4 •</span>
                    )}
                </div>

                {/* Floating Actions (Left of Counter) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    <button onClick={undo} className="choco-button w-12 h-12 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                        <Undo2 className="w-5 h-5 opacity-60" />
                        <span className="absolute -bottom-6 text-[8px] font-black opacity-30">UNDO</span>
                    </button>
                    <button onClick={reset} className="choco-button w-12 h-12 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                        <RotateCcw className="w-5 h-5 opacity-60" />
                        <span className="absolute -bottom-6 text-[8px] font-black opacity-30">RESET</span>
                    </button>
                    <button className="choco-button w-12 h-12 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                        <Palette className="w-5 h-5 opacity-60" />
                    </button>
                </div>

                {/* MAIN COUNTER RING */}
                <div className="relative w-80 h-80 rounded-full flex items-center justify-center p-2">
                    {/* Inner pit */}
                    <div className="absolute inset-0 choco-inner rounded-full" />

                    {/* Animated Glow Back */}
                    <div className="absolute inset-0 bg-primary/2 blur-3xl rounded-full" />

                    {/* Golden Rim */}
                    <div className="w-full h-full rounded-full choco-rim-3d p-6">
                        {/* Counter Display */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#50372b] to-[#31211b] flex items-center justify-center shadow-inner overflow-hidden relative">
                            <span className="text-[120px] font-black tracking-tighter tabular-nums opacity-60 select-none">
                                {currentCount}
                            </span>

                            {/* Progress Arc Overlay (Simulated with borders/gradients since we need complex SVG usually) */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="46%"
                                    fill="none"
                                    stroke="#1c130f"
                                    strokeWidth="4"
                                    strokeDasharray="1 4"
                                    className="opacity-20"
                                />
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    r="46%"
                                    fill="none"
                                    stroke="#c5a059"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0 1000" }}
                                    animate={{ strokeDasharray: `${progress * 8.8} 1000` }}
                                    transition={{ type: 'spring', damping: 20 }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Interaction Area */}
                    <div
                        onClick={increment}
                        className="absolute inset-0 z-10 cursor-pointer rounded-full active:bg-white/5 transition-colors"
                    />
                </div>

                {/* WISDOM CARD (BOTTOM CENTER) */}
                <div className="mt-12 w-full max-w-lg">
                    <div className="choco-clay p-8 relative overflow-hidden group">
                        <div className="absolute top-4 left-4 p-1.5 choco-inner rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-[#c5a059]" />
                        </div>
                        <span className="absolute top-4 right-8 font-amiri text-xs opacity-40">فضائل الذكر</span>

                        <div className="space-y-6 pt-2">
                            <p className="arabic text-xl leading-loose text-center opacity-90 px-4">
                                "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ"
                            </p>
                            <div className="space-y-4">
                                <p className="text-sm italic opacity-60 text-center leading-relaxed">
                                    A light word on the tongue, heavy on the scale, and beloved to the Merciful: SubhanAllah wa bi-Hamdihi, SubhanAllahil-Azim.
                                </p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">- Bukhari</span>
                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] items-center gap-2 opacity-40 hover:opacity-100">
                                        View Details <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: GLOBAL COMMUNITY */}
            <div className="flex-1 max-w-sm flex flex-col gap-6">
                <div className="choco-clay p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight opacity-70">GLOBAL COMMUNITY</h2>
                        <div className="flex items-center gap-2 bg-[#1c130f] px-3 py-1 rounded-full border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[8px] font-bold opacity-60">LIVE</span>
                        </div>
                    </div>

                    {/* 3D WORLD MAP PLACEHOLDER */}
                    <div className="choco-inner aspect-video flex items-center justify-center group overflow-hidden relative">
                        <Globe className="w-24 h-24 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c130f]/40" />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-[8px] font-bold opacity-50 underline uppercase tracking-tighter">View Active Regions</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-4">
                            {/* CHALLENGE 1 */}
                            <div className="choco-inner p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black tracking-tight leading-none">1 Million Salawat for the Prophet</h3>
                                        <div className="flex items-center gap-2">
                                            <Target className="w-3 h-3 opacity-30" />
                                            <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Community Goal</span>
                                        </div>
                                    </div>
                                    <Star className="w-4 h-4 text-[#c5a059] opacity-40" />
                                </div>
                                <p className="text-[9px] italic opacity-40 leading-relaxed">
                                    "Let us unite in an Ummah to send 1,000,000 Salawat upon our beloved Prophet..."
                                </p>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black">
                                        <span className="text-[#c5a059]">6,500</span>
                                        <span className="opacity-30">/ 1,000,000</span>
                                    </div>
                                    <div className="h-2 bg-[#1c130f] rounded-full overflow-hidden p-[1px]">
                                        <div className="h-full bg-gradient-to-r from-[#d97706] to-[#c5a059] w-[15%] rounded-full shadow-[0_0_10px_rgba(217,119,6,0.3)]" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 choco-button h-10 flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-50" />
                                        <span className="text-[8px] font-black tracking-widest opacity-60">CONTRIBUTION</span>
                                    </div>
                                    <button className="flex-[2] choco-button h-10 choco-text-gold font-black text-[9px] tracking-widest hover:brightness-110 active:scale-95 transition-all uppercase border border-[#c5a059]/10">
                                        Contribute Now →
                                    </button>
                                </div>
                            </div>

                            {/* CHALLENGE 2 */}
                            <div className="choco-inner p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black tracking-tight leading-none">500,000 Istighfar</h3>
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-3 h-3 opacity-30" />
                                            <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Community Goal</span>
                                        </div>
                                    </div>
                                    <Target className="w-4 h-4 text-[#c5a059] opacity-40" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black">
                                        <span className="text-[#c5a059]">0</span>
                                        <span className="opacity-30">/ 500,000</span>
                                    </div>
                                    <div className="h-2 bg-[#1c130f] rounded-full overflow-hidden" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 choco-button h-10 flex items-center justify-center gap-2">
                                        <X className="w-2.5 h-2.5 opacity-30" />
                                        <span className="text-[8px] font-black tracking-widest opacity-40">CONTRIBUTION</span>
                                    </div>
                                    <button className="flex-[2] choco-button h-10 choco-text-gold font-black text-[9px] tracking-widest opacity-40 hover:opacity-100 transition-all uppercase border border-white/5">
                                        Contribute Now →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
