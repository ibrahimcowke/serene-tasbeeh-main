import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Minus, BookOpen, Target, History, Settings, BarChart3, Trophy, Bell, LayoutGrid, ClipboardList, Power, AppWindow } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { DhikrSelector } from './DhikrSelector';
import { TargetSelector } from './TargetSelector';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { ProgressView } from './ProgressView';
import { RemindersView } from './RemindersView';
import { RoutinesView } from './RoutinesView';
import { AchievementsView } from './AchievementsView';
import { ChallengesView } from './ChallengesView';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { toast } from 'sonner';
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
        <div className="flex sm:hidden items-center justify-between gap-1 bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-2 px-4 shadow-lg shadow-black/5 mb-safe">
          <DhikrSelector>
            <motion.button whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-[11px] text-muted-foreground font-medium">Dhikr</span>
            </motion.button>
          </DhikrSelector>

          <TargetSelector>
            <motion.button whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
              <Target className="w-5 h-5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground font-medium">Target</span>
            </motion.button>
          </TargetSelector>

          <Drawer>
            <DrawerTrigger asChild>
              <motion.button whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
                <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground font-medium">Menu</span>
              </motion.button>
            </DrawerTrigger>
            <DrawerContent className="bg-background/95 backdrop-blur-2xl border-t border-border/50 pb-safe">
              <div className="w-full max-w-sm mx-auto p-6 pb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">App Menu</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <ProgressView>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary transition-all">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <span className="text-[10px] font-medium">Stats</span>
                    </button>
                  </ProgressView>

                  <RoutinesView>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary transition-all">
                      <BookOpen className="w-5 h-5 text-orange-500" />
                      <span className="text-[10px] font-medium">Routines</span>
                    </button>
                  </RoutinesView>

                  <HistoryView>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary transition-all">
                      <History className="w-5 h-5 text-green-500" />
                      <span className="text-[10px] font-medium">History</span>
                    </button>
                  </HistoryView>

                  <AchievementsView>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary transition-all">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="text-[10px] font-medium">Awards</span>
                    </button>
                  </AchievementsView>

                  <SettingsView>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary transition-all">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] font-medium">Settings</span>
                    </button>
                  </SettingsView>

                  <button
                    onClick={() => {
                      useTasbeehStore.getState().setZenMode(true);
                      toast.info("Zen Mode Active", { description: "Tap the button at the bottom to exit" });
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary transition-all"
                  >
                    <AppWindow className="w-5 h-5 text-purple-500" />
                    <span className="text-[10px] font-medium">Zen Mode</span>
                  </button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <HistoryView>
            <motion.button whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-secondary/50">
              <History className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">History</span>
            </motion.button>
          </HistoryView>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center justify-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-1.5 w-fit mx-auto px-4 shadow-lg shadow-black/5">
          <DhikrSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-secondary transition-colors group"
            >
              <BookOpen className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-foreground/80">Select Dhikr</span>
            </motion.button>
          </DhikrSelector>

          <div className="w-px h-4 bg-border/50 mx-1" />

          <TargetSelector>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground/80">Set Target</span>
            </motion.button>
          </TargetSelector>

          <RoutinesView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground/80">Routines</span>
            </motion.button>
          </RoutinesView>

          <SettingsView>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-secondary transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground/80">Settings</span>
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
