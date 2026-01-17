import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Minus, BookOpen, Target, History, Settings, BarChart3, Trophy, Bell } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { DhikrSelector } from './DhikrSelector';
import { TargetSelector } from './TargetSelector';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { StatsView } from './StatsView';
import { AchievementsView } from './AchievementsView';
import { RemindersView } from './RemindersView';
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
        {/* Primary actions row */}
        <div className="flex items-center justify-center gap-4 mb-4">
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

        {/* Secondary actions row */}
        <div className="flex items-center gap-2 overflow-x-auto bg-card rounded-2xl p-2 scrollbar-hide snap-x">
          <DhikrSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">Dhikr</span>
            </motion.button>
          </DhikrSelector>

          <TargetSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">Target</span>
            </motion.button>
          </TargetSelector>

          <StatsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">Stats</span>
            </motion.button>
          </StatsView>

          <AchievementsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">Awards</span>
            </motion.button>
          </AchievementsView>

          <RemindersView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">Alerts</span>
            </motion.button>
          </RemindersView>

          <HistoryView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">History</span>
            </motion.button>
          </HistoryView>

          <SettingsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-2 sm:py-3 px-2 sm:px-4 rounded-xl hover:bg-secondary transition-colors min-w-[70px] snap-center"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full text-center">Settings</span>
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
