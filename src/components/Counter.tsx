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
    <div className="flex flex-col items-center justify-between min-h-full w-full px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden py-4 sm:py-8">
      {/* Top Section: Dhikr */}
      <div className="w-full flex justify-center items-end py-4">
        <DhikrHeader />
      </div>

      {/* Center Section: Counter */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto z-10 flex-1 py-4">
        <div className="flex flex-col items-center w-full">
          <CounterDisplay />
          <CounterActions />
        </div>
      </div>

      {/* Bottom Section: Hadith & Stats */}
      <div className="w-full flex flex-col items-center justify-start py-4">
        <CounterFooter />
      </div>
    </div>
  );
});
