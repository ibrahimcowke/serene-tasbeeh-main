import { motion } from 'framer-motion';
import { Counter } from './Counter';
import { StatsWidget } from './StatsWidget';
import { GlobalStats } from './GlobalStats';
import { GlobalChallenges } from './GlobalChallenges';
import { HadithSlider } from './HadithSlider';
import { VisitorCounter } from './VisitorCounter';
import { useTasbeehStore } from '@/store/tasbeehStore';
import {
    BarChart3,
    Users,
    Trophy,
    Sparkles,
    TrendingUp,
    Heart,
    LayoutDashboard
} from 'lucide-react';

export const PremiumHub = () => {
    const { currentDhikr, totalAllTime } = useTasbeehStore();

    return (
        <div className="w-full pt-16 lg:pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Personal Journey (3/12) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="lg:col-span-3 space-y-6 lg:sticky lg:top-24"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-card/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-primary/10 rounded-2xl">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80">Spiritual Progress</h2>
                                    <p className="text-[10px] text-muted-foreground font-medium">YOUR PERSONAL JOURNEY</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <StatsWidget />

                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-3.5 h-3.5 text-primary/60" />
                                            <span className="text-xs font-semibold text-muted-foreground">Total Salawat</span>
                                        </div>
                                        <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                                            {totalAllTime?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-primary/5 border border-primary/10 rounded-3xl p-6 overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Daily Tip</span>
                            </div>
                            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                                Consistency is key. Even 5 minutes of focused Dhikr a day can transform your spiritual state.
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <LayoutDashboard className="w-24 h-24 text-primary" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Center Column: The Heart (5/12) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="lg:col-span-6 flex flex-col gap-8"
                >
                    {/* Hero Counter Section */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-3xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-10 px-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-[.3em] uppercase text-primary/60 mb-1">Active Dhikr</span>
                                    <h3 className="text-xl font-bold text-foreground line-clamp-1">{currentDhikr.transliteration}</h3>
                                </div>
                                <div className="p-3 bg-white/5 rounded-full border border-white/5">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                            </div>

                            <div className="py-4 w-full flex justify-center">
                                <Counter />
                            </div>
                        </div>
                    </div>

                    {/* Wisdom Slider */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Trophy className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Spiritual Wisdom</h2>
                        </div>
                        <HadithSlider dhikr={currentDhikr} />
                    </motion.div>
                </motion.div>

                {/* Right Column: Community & Global (4/12) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-3 space-y-6 lg:sticky lg:top-24"
                >
                    {/* Live Hub */}
                    <div className="bg-card/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-green-500/10 rounded-2xl">
                                    <Users className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80">Live Hub</h2>
                                    <p className="text-[10px] text-muted-foreground font-medium">GLOBAL COMMUNITY</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500 font-black uppercase">Live</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col items-center">
                                <VisitorCounter />
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <GlobalStats />
                            </div>
                        </div>
                    </div>

                    {/* Community Challenges */}
                    <div className="bg-card/20 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">Unity Challenges</h2>
                        </div>
                        <GlobalChallenges />
                    </div>

                    {/* Support / Quick Links */}
                    <div className="bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-3xl p-6 text-center">
                        <h4 className="text-xs font-bold text-foreground mb-2">Join the Movement</h4>
                        <p className="text-[10px] text-muted-foreground mb-4">Share with friends and family to grow our collective spiritual impact.</p>
                        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            Share App
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
