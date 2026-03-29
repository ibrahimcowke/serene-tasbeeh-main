import { useEffect, memo } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { SoundManager } from '@/lib/sound';
import { initShakeDetection, isShakeDetectionSupported } from '@/lib/shakeDetection';
import { requestWakeLock, releaseWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { initVolumeButtonListener } from '@/lib/volumeButtons';
import { DhikrHeader } from './counter/DhikrHeader';
import { CounterDisplay } from './counter/CounterDisplay';
import { CounterActions } from './counter/CounterActions';
import { CounterFooter } from './counter/CounterFooter';

export const Counter = memo(function Counter() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const reset = useTasbeehStore(state => state.reset);
  const increment = useTasbeehStore(state => state.increment);
  const decrement = useTasbeehStore(state => state.decrement);
  const shakeToReset = useTasbeehStore(state => state.shakeToReset);
  const wakeLockEnabled = useTasbeehStore(state => state.wakeLockEnabled);
  const volumeButtonCounting = useTasbeehStore(state => state.volumeButtonCounting);
  const sessionModeType = useTasbeehStore(state => state.sessionMode.type);
  const theme = useTasbeehStore(state => state.theme);
  const currentSettings = useTasbeehStore(state => state.themeSettings[theme]);

  // Handle Side Effects (Sound, Milestones)
  useEffect(() => {
    if (currentCount > 0 && currentSettings?.soundEnabled) {
      SoundManager.playClick(currentSettings.soundType as any);
    }
  }, [currentCount, currentSettings?.soundEnabled, currentSettings?.soundType]);

  // Shake to reset functionality
  useEffect(() => {
    if (!shakeToReset || !isShakeDetectionSupported()) return;
    const cleanup = initShakeDetection(() => {
      if (currentCount > 0) {
        if (window.confirm('Reset counter by shaking?')) {
          reset();
        }
      }
    });
    return cleanup;
  }, [shakeToReset, currentCount, reset]);

  // Screen Wake Lock
  useEffect(() => {
    if (!wakeLockEnabled || !isWakeLockSupported()) {
      releaseWakeLock();
      return;
    }
    const shouldHaveWakeLock = currentCount > 0 || sessionModeType !== 'free';
    if (shouldHaveWakeLock) requestWakeLock();
    else releaseWakeLock();
    return () => { releaseWakeLock(); };
  }, [wakeLockEnabled, currentCount, sessionModeType]);

  // Volume Button Counting
  useEffect(() => {
    if (!volumeButtonCounting) return;
    const cleanup = initVolumeButtonListener((direction) => {
      if (direction === 'up') increment();
      else if (direction === 'down') decrement();
    });
    return cleanup;
  }, [volumeButtonCounting, increment, decrement]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden py-4 sm:py-8 safe-area-top safe-area-bottom gap-4 xs:gap-8">
      {/* Top Section: Dhikr and Progress */}
      <div className="w-full flex flex-col items-center justify-center z-10 animate-fade-in-down">
        <DhikrHeader />
      </div>

      {/* Center Section: Main Interactive Counter */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto z-20">
        <div className="flex flex-col items-center w-full space-y-4 xs:space-y-6">
          <CounterDisplay />
          <CounterActions />
        </div>
      </div>

      {/* Bottom Section: Insights and History */}
      <div className="w-full flex flex-col items-center justify-center z-10 animate-fade-in-up mt-4 sm:mt-8">
        <CounterFooter />
      </div>
    </div>
  );
});
