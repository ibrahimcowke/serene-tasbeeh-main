import { useEffect, memo } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { SoundManager } from '@/lib/sound';
import { initShakeDetection, isShakeDetectionSupported } from '@/lib/shakeDetection';
import { requestWakeLock, releaseWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { initVolumeButtonListener } from '@/lib/volumeButtons';
import { DhikrHeader } from './counter/DhikrHeader';
import { CounterDisplay } from './counter/CounterDisplay';
import { CounterActions } from './counter/CounterActions';
import { CounterFooter } from './counter/CounterFooter';
import { DateBanner } from './DateBanner';


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
  const currentSettings = useTasbeehStore(state => state.themeSettings[theme] || defaultThemeSettings);

  // Sound
  useEffect(() => {
    if (currentCount > 0 && currentSettings?.soundEnabled) {
      SoundManager.playClick(currentSettings.soundType as any);
    }
  }, [currentCount, currentSettings?.soundEnabled, currentSettings?.soundType]);

  // Shake to reset
  useEffect(() => {
    if (!shakeToReset || !isShakeDetectionSupported()) return;
    const cleanup = initShakeDetection(() => {
      if (currentCount > 0 && window.confirm('Reset counter by shaking?')) reset();
    });
    return cleanup;
  }, [shakeToReset, currentCount, reset]);

  // Wake lock
  useEffect(() => {
    if (!wakeLockEnabled || !isWakeLockSupported()) { releaseWakeLock(); return; }
    const shouldHaveWakeLock = currentCount > 0 || sessionModeType !== 'free';
    if (shouldHaveWakeLock) requestWakeLock();
    else releaseWakeLock();
    return () => { releaseWakeLock(); };
  }, [wakeLockEnabled, currentCount, sessionModeType]);

  // Volume buttons
  useEffect(() => {
    if (!volumeButtonCounting) return;
    const cleanup = initVolumeButtonListener((direction) => {
      if (direction === 'up') increment();
      else if (direction === 'down') decrement();
    });
    return cleanup;
  }, [volumeButtonCounting, increment, decrement]);

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full overflow-hidden">

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--primary) / 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--primary) / 0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Subtle geometric pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${(currentSettings.primary || '#d97706').replace('#', '%23')}' fill-opacity='1'%3E%3Cpath d='M30 0l30 17.32v34.64L30 60 0 51.96V17.32L30 0zm0 4L4 19.2v26.4L30 56l26-10.4V19.2L30 4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top section: Hijri date banner + Dhikr label */}
      <div className="w-full flex flex-col items-center justify-center z-10 pt-2 sm:pt-4 animate-fade-in-down">
        <DateBanner />
        <DhikrHeader />
      </div>

      {/* Center: Bead ring + action buttons side by side on desktop, stacked and centered on mobile */}
      <div className="relative flex flex-col sm:flex-row items-center justify-center w-full z-20 flex-1 gap-2 sm:gap-6 px-2">
        <CounterDisplay />
        <CounterActions />
      </div>

      {/* Bottom: Footer stats */}
      <div className="w-full flex flex-col items-center justify-center z-10 pb-2 animate-fade-in-up">
        <CounterFooter />
      </div>
    </div>
  );
});
