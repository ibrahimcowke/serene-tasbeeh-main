import { useTasbeehStore } from '@/store/tasbeehStore';
import { achievements, getNextLevel } from '@/data/achievements';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { useState } from 'react';

interface AchievementsViewProps {
    children: React.ReactNode;
}

export function AchievementsContent() {
    const { totalAllTime, unlockedAchievements } = useTasbeehStore();

    // Ensure totalAllTime is a number
    const currentTotal = totalAllTime || 0;
    const currentLevel = getNextLevel(currentTotal);
    const unlockedIds = unlockedAchievements || [];

    const sortedAchievements = [...achievements].sort((a, b) => {
        const aUnlocked = unlockedIds.includes(a.id);
        const bUnlocked = unlockedIds.includes(b.id);
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });

    return (
        <ScrollArea className="h-full pb-20">
            <div className="space-y-6 px-1">
                {/* Level Progress */}
                <div className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Current Rank</p>
                                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
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

                {/* Achievements Grid */}
                <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Badges ({unlockedIds.length}/{achievements.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {sortedAchievements.map((achievement, index) => {
                            const isUnlocked = unlockedIds.includes(achievement.id);
                            const Icon = achievement.icon;

                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                                        relative p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all
                                        ${isUnlocked
                                            ? 'bg-card border-border shadow-sm'
                                            : 'bg-secondary/20 border-border/50 opacity-60 grayscale'}
                                    `}
                                >
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center
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

                                    {isUnlocked && (
                                        <div className="absolute top-2 right-2">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ScrollArea>
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
