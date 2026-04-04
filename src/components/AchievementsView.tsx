import { useTasbeehStore } from '@/store/tasbeehStore';
import { achievements, getNextLevel, Achievement } from '@/data/achievements';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Share2, X, Sparkles, ChevronRight } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface AchievementsViewProps {
    children: React.ReactNode;
}

// Confetti particle component
function ConfettiBurst({ active }: { active: boolean }) {
    if (!active) return null;

    const particles = Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * 360;
        const distance = 40 + Math.random() * 60;
        const colors = ['#FFD700', '#FF6B35', '#4ADE80', '#60A5FA', '#F472B6', '#A78BFA'];
        const color = colors[i % colors.length];
        const size = 4 + Math.random() * 4;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        return (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    top: '50%',
                    left: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x, y, opacity: 0, scale: 0 }}
                transition={{ duration: 0.8 + Math.random() * 0.4, ease: 'easeOut' }}
            />
        );
    });

    return <div className="absolute inset-0 pointer-events-none z-20">{particles}</div>;
}

// Badge Detail Overlay
function BadgeDetailCard({
    achievement,
    isUnlocked,
    progress,
    progressPercent,
    onClose,
    onShare,
}: {
    achievement: Achievement;
    isUnlocked: boolean;
    progress: number;
    progressPercent: number;
    onClose: () => void;
    onShare: () => void;
}) {
    const Icon = achievement.icon;
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isUnlocked) {
            const timer = setTimeout(() => setShowConfetti(true), 200);
            return () => clearTimeout(timer);
        }
    }, [isUnlocked]);

    const getProgressLabel = () => {
        if (achievement.type === 'count') {
            return `${progress.toLocaleString()} / ${achievement.target.toLocaleString()} dhikr`;
        }
        if (achievement.type === 'streak') {
            return `${progress} / ${achievement.target} day${achievement.target > 1 ? 's' : ''}`;
        }
        return achievement.type === 'time' ? (isUnlocked ? 'Completed!' : 'Not yet') : '';
    };

    // SVG ring progress
    const ringRadius = 52;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="relative w-full max-w-sm rounded-3xl border border-border/60 bg-card p-6 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background glow */}
                {isUnlocked && (
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-[60px] pointer-events-none" />
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground transition-colors z-30"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Icon with ring progress */}
                <div className="flex flex-col items-center gap-4 relative">
                    <ConfettiBurst active={showConfetti && isUnlocked} />

                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* SVG Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r={ringRadius}
                                fill="transparent"
                                stroke="currentColor"
                                className="text-secondary/40"
                                strokeWidth="6"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r={ringRadius}
                                fill="transparent"
                                stroke="url(#detail-gradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={ringCircumference}
                                initial={{ strokeDashoffset: ringCircumference }}
                                animate={{ strokeDashoffset: ringOffset }}
                                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                            />
                            <defs>
                                <linearGradient id="detail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={isUnlocked ? '#4ade80' : '#6b7280'} />
                                    <stop offset="100%" stopColor={isUnlocked ? '#22c55e' : '#9ca3af'} />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Icon */}
                        <motion.div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isUnlocked
                                    ? 'bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10'
                                    : 'bg-secondary/30'
                                }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                        >
                            {isUnlocked ? (
                                <Icon className={`w-8 h-8 ${achievement.color}`} />
                            ) : (
                                <Lock className="w-7 h-7 text-muted-foreground" />
                            )}
                        </motion.div>
                    </div>

                    {/* Title */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {isUnlocked ? achievement.description : 'Keep going to unlock this badge!'}
                        </p>
                    </motion.div>

                    {/* Progress info */}
                    <motion.div
                        className="w-full space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {/* Progress bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Progress</span>
                                <span className={isUnlocked ? 'text-green-500' : 'text-foreground'}>
                                    {Math.round(progressPercent)}%
                                </span>
                            </div>
                            <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${isUnlocked
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                            : 'bg-gradient-to-r from-primary/60 to-primary/40'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                {getProgressLabel()}
                            </p>
                        </div>

                        {/* Unlocked badge */}
                        {isUnlocked && (
                            <motion.div
                                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-green-500/10 border border-green-500/20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
                                    ✨ Unlocked!
                                </span>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Share button */}
                    {isUnlocked && (
                        <motion.button
                            onClick={onShare}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-semibold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 className="w-4 h-4" />
                            Share Achievement
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export function AchievementsContent() {
    const { totalAllTime, unlockedAchievements, streakDays, currentCount } = useTasbeehStore();
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    const currentTotal = totalAllTime || 0;
    const currentLevel = getNextLevel(currentTotal);
    const unlockedIds = unlockedAchievements || [];

    // State proxy for getProgress calls
    const stateProxy = {
        totalCount: currentTotal,
        streakDays: streakDays || 0,
        currentCount: currentCount || 0,
    };

    const recentlyUnlocked = achievements.filter((a) => unlockedIds.includes(a.id)).slice(-2);

    const sortedAchievements = [...achievements].sort((a, b) => {
        const aUnlocked = unlockedIds.includes(a.id);
        const bUnlocked = unlockedIds.includes(b.id);
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    const getProgressForAchievement = (achievement: Achievement) => {
        return achievement.getProgress(stateProxy);
    };

    const getProgressPercent = (achievement: Achievement) => {
        if (unlockedIds.includes(achievement.id)) return 100;
        const progress = getProgressForAchievement(achievement);
        return Math.min(100, (progress / achievement.target) * 100);
    };

    const handleShare = useCallback((achievement: Achievement) => {
        const text = `I earned the '${achievement.title}' badge on Tasbeehly! 🏆\n${achievement.description}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                toast.success('Copied to clipboard!', {
                    description: 'Share your achievement with friends',
                    icon: '📋',
                });
            });
        } else {
            toast.info(text);
        }
    }, []);

    return (
        <>
            <ScrollArea className="h-full pb-20">
                <div className="space-y-6 px-1">
                    {/* Level Progress */}
                    <div className="bg-card/40 border border-border/60 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden group shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
                        
                        {/* Sync Indicator */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">Cloud Synced</span>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Current Spiritual Rank</p>
                                    <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/40 leading-none">
                                        {currentLevel.name}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-mono font-medium">{currentTotal.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Total Dhikr</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${currentLevel.progress * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                {Math.floor(currentLevel.next - currentTotal).toLocaleString()} to next rank
                            </p>
                        </div>
                    </div>

                    {/* Recently Unlocked Highlight */}
                    {recentlyUnlocked.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 px-1">
                                <Sparkles className="w-3 h-3" />
                                Recently Earned
                            </h4>
                            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                {recentlyUnlocked.map((achievement, idx) => {
                                    const Icon = achievement.icon;
                                    return (
                                        <motion.button
                                            key={achievement.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => setSelectedAchievement(achievement)}
                                            className="flex-shrink-0 relative flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
                                        >
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Icon className={`w-5 h-5 ${achievement.color}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold">{achievement.title}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tap to view</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Achievements Grid */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Badges ({unlockedIds.length}/{achievements.length})</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {sortedAchievements.map((achievement, index) => {
                                const isUnlocked = unlockedIds.includes(achievement.id);
                                const Icon = achievement.icon;
                                const progress = getProgressForAchievement(achievement);
                                const progressPercent = getProgressPercent(achievement);

                                return (
                                    <motion.button
                                        key={achievement.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ y: -2 }}
                                        onClick={() => setSelectedAchievement(achievement)}
                                        className={`
                                            relative p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all cursor-pointer group
                                            ${isUnlocked
                                                ? 'bg-card border-border shadow-sm hover:shadow-md hover:border-primary/30'
                                                : 'bg-secondary/20 border-border/50 opacity-70 hover:opacity-90'}
                                        `}
                                    >
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                                            ${isUnlocked ? 'bg-secondary/50' : 'bg-secondary/30'}
                                        `}>
                                            {isUnlocked ? (
                                                <Icon className={`w-6 h-6 ${achievement.color}`} />
                                            ) : (
                                                <Lock className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div>
                                            <h5 className="font-semibold text-sm mb-1">{achievement.title}</h5>
                                            <p className="text-xs text-muted-foreground leading-snug">
                                                {isUnlocked ? achievement.description : '???'}
                                            </p>
                                        </div>

                                        {/* Progress bar for locked badges */}
                                        {!isUnlocked && achievement.type !== 'time' && (
                                            <div className="w-full space-y-1">
                                                <div className="h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-primary/40 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progressPercent}%` }}
                                                        transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 + 0.3 }}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-muted-foreground font-medium">
                                                    {progress.toLocaleString()}/{achievement.target.toLocaleString()}
                                                    {achievement.type === 'streak' ? ' days' : ''}
                                                </p>
                                            </div>
                                        )}

                                        {isUnlocked && (
                                            <div className="absolute top-2 right-2">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            </div>
                                        )}

                                        {/* Tap hint */}
                                        <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedAchievement && (
                    <BadgeDetailCard
                        achievement={selectedAchievement}
                        isUnlocked={unlockedIds.includes(selectedAchievement.id)}
                        progress={getProgressForAchievement(selectedAchievement)}
                        progressPercent={getProgressPercent(selectedAchievement)}
                        onClose={() => setSelectedAchievement(null)}
                        onShare={() => handleShare(selectedAchievement)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export function AchievementsView({ children }: AchievementsViewProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <SheetDescription className="sr-only">
                    View your earned achievements and current rank.
                </SheetDescription>
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Achievements & Rank
                    </SheetTitle>
                </SheetHeader>

                <AchievementsContent />
            </SheetContent>
        </Sheet>
    );
}
