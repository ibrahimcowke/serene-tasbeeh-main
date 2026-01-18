import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Minus, BookOpen, Target, History, Settings, BarChart3, Trophy, Bell, LayoutGrid } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { DhikrSelector } from './DhikrSelector';
import { TargetSelector } from './TargetSelector';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { StatsView } from './StatsView';
import { AchievementsView } from './AchievementsView';
import { RemindersView } from './RemindersView';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ActionBar() {
  const { currentCount, decrement, reset } = useTasbeehStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 md:px-8 pb-3 sm:pb-4 safe-area-bottom w-full max-w-4xl mx-auto"
      >
        {/* Primary actions row - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center justify-center gap-4 mb-4">
          {/* Undo button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={decrement}
            disabled={currentCount === 0}
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-card flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-card/80"
            aria-label="Undo last count"
          >
            <Minus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-muted-foreground" />
          </motion.button>

          {/* Reset button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResetConfirm(true)}
            disabled={currentCount === 0}
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-card flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-card/80"
            aria-label="Reset counter"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Mobile Navigation (Grid) */}
        <div className="flex sm:hidden items-center justify-between gap-1 bg-card rounded-2xl p-2 px-4">
          <DhikrSelector>
            <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">Dhikr</span>
            </motion.button>
          </DhikrSelector>

          <TargetSelector>
            <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
              <Target className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">Target</span>
            </motion.button>
          </TargetSelector>

          <Drawer>
            <DrawerTrigger asChild>
              <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
                <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium">Menu</span>
              </motion.button>
            </DrawerTrigger>
            <DrawerContent className="bg-background/95 backdrop-blur-xl">
              <div className="w-full max-w-sm mx-auto p-6">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <StatsView>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary/30 hover:bg-secondary active:scale-95 transition-all">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-xs font-medium">Stats</span>
                    </button>
                  </StatsView>

                  <AchievementsView>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary/30 hover:bg-secondary active:scale-95 transition-all">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                      <span className="text-xs font-medium">Awards</span>
                    </button>
                  </AchievementsView>

                  <RemindersView>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary/30 hover:bg-secondary active:scale-95 transition-all">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-xs font-medium">Alerts</span>
                    </button>
                  </RemindersView>

                  <HistoryView>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary/30 hover:bg-secondary active:scale-95 transition-all">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <History className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-xs font-medium">History</span>
                    </button>
                  </HistoryView>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground/50">More features coming soon</p>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <SettingsView>
            <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">Settings</span>
            </motion.button>
          </SettingsView>
        </div>

        {/* Desktop Actions (Scrollable List) */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto bg-card rounded-2xl p-2 scrollbar-hide snap-x justify-center">
          <DhikrSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <BookOpen className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Dhikr</span>
            </motion.button>
          </DhikrSelector>

          <TargetSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <Target className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Target</span>
            </motion.button>
          </TargetSelector>

          <StatsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <BarChart3 className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Stats</span>
            </motion.button>
          </StatsView>

          <AchievementsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <Trophy className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Awards</span>
            </motion.button>
          </AchievementsView>

          <RemindersView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <Bell className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Alerts</span>
            </motion.button>
          </RemindersView>

          <HistoryView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <History className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">History</span>
            </motion.button>
          </HistoryView>

          <SettingsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center hover:scale-105"
            >
              <Settings className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Settings</span>
            </motion.button>
          </SettingsView>
        </div>
      </motion.div>

      {/* Reset confirmation dialog */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset counter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset your current count to zero. Your history will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              className="rounded-xl"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
