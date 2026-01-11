import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Minus, BookOpen, Target, History, Settings } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { DhikrSelector } from './DhikrSelector';
import { TargetSelector } from './TargetSelector';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
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
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleResetStart = useCallback(() => {
    const timer = setTimeout(() => {
      setShowResetConfirm(true);
    }, 500);
    setLongPressTimer(timer);
  }, []);

  const handleResetEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleConfirmReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pb-4 safe-area-bottom"
      >
        {/* Primary actions row */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Undo button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={decrement}
            disabled={currentCount === 0}
            className="w-12 h-12 rounded-full bg-card flex items-center justify-center disabled:opacity-30 transition-opacity"
            aria-label="Undo last count"
          >
            <Minus className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Reset button (long press) */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onMouseDown={handleResetStart}
            onMouseUp={handleResetEnd}
            onMouseLeave={handleResetEnd}
            onTouchStart={handleResetStart}
            onTouchEnd={handleResetEnd}
            disabled={currentCount === 0}
            className="w-12 h-12 rounded-full bg-card flex items-center justify-center disabled:opacity-30 transition-opacity"
            aria-label="Reset counter (hold)"
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Secondary actions row */}
        <div className="flex items-center justify-between bg-card rounded-2xl p-2">
          <DhikrSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <BookOpen className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Dhikr</span>
            </motion.button>
          </DhikrSelector>

          <TargetSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <Target className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Target</span>
            </motion.button>
          </TargetSelector>

          <HistoryView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <History className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">History</span>
            </motion.button>
          </HistoryView>

          <SettingsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Settings</span>
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
