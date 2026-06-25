import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Compass, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initPrayerTimeReminders } from '@/lib/prayerTimes';

export const PrayerTimesPermissionModal: React.FC = memo(() => {
  const { syncPrayerTimes, setSyncPrayerTimes } = useTasbeehStore();

  // Only show if the user has not made a decision yet (syncPrayerTimes is null)
  if (syncPrayerTimes !== null) return null;

  const handleEnable = async () => {
    setSyncPrayerTimes(true);
    // Trigger geolocation API which will request native prompt
    try {
      await initPrayerTimeReminders(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSkip = () => {
    setSyncPrayerTimes(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden bg-card/80 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl"
        >
          {/* Top Decorative Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="p-8 flex flex-col items-center text-center space-y-6">
            {/* Compass / Location Icon */}
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 12 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/20">
                <Compass className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Sync Prayer Times
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground px-2">
                Enable location services to calculate accurate Islamic prayer times (Fajr, Dhuhr, Maghrib, Isha) for your exact city and sync your dhikr reminders automatically.
              </p>
            </div>

            {/* Privacy Card */}
            <div className="w-full flex items-start gap-3 bg-primary/5 rounded-2xl p-3.5 border border-primary/10 text-left">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-primary/80">Privacy Guaranteed</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  Your coordinates are used strictly for local timings, processed in-memory, and never uploaded to any servers.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-2.5 pt-2">
              <Button
                onClick={handleEnable}
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary hover:bg-primary/90"
              >
                Enable Location
              </Button>

              <Button
                variant="outline"
                onClick={handleSkip}
                className="w-full h-11 rounded-xl text-sm font-medium border-primary/10 hover:bg-primary/5 active:scale-95 transition-all"
              >
                Skip for Now
              </Button>
            </div>
          </div>

          {/* Skip/Close Button top right */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

PrayerTimesPermissionModal.displayName = 'PrayerTimesPermissionModal';
