import { memo, forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Minus, Play, Pause } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { SettingsView } from '../SettingsView';
import { UndoButton } from '../UndoButton';


const GlassButton = forwardRef<HTMLButtonElement, {
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  children: React.ReactNode;
}>(({ onClick, disabled, title, className = "", children }, ref) => (
  <motion.button
    ref={ref}
    whileTap={{ scale: 0.92 }}
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center disabled:opacity-30 transition-all ${className}`}
    style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid hsl(var(--primary) / 0.25)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.06)',
    }}
  >
    {children}
  </motion.button>
));
GlassButton.displayName = 'GlassButton';

export const CounterActions = memo(function CounterActions() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const zenMode = useTasbeehStore(state => state.zenMode);
  const decrement = useTasbeehStore(state => state.decrement);
  const reset = useTasbeehStore(state => state.reset);

  const autoCountActive = useTasbeehStore(state => state.autoCountActive);
  const autoCountInterval = useTasbeehStore(state => state.autoCountInterval);
  const startAutoCount = useTasbeehStore(state => state.startAutoCount);
  const stopAutoCount = useTasbeehStore(state => state.stopAutoCount);
  const setAutoCountInterval = useTasbeehStore(state => state.setAutoCountInterval);

  const speeds = [100, 200, 300, 400, 500, 1000, 1500, 2000, 3000];
  const currentSpeedLabel = `${(autoCountInterval / 1000).toFixed(1)}s`;

  const toggleAutoCount = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (autoCountActive) {
      stopAutoCount();
    } else {
      startAutoCount();
    }
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = speeds.indexOf(autoCountInterval);
    const nextIdx = idx === -1 ? 1 : (idx + 1) % speeds.length;
    setAutoCountInterval(speeds[nextIdx]);
  };

  // Clean up auto-count on component unmount
  useEffect(() => {
    return () => {
      stopAutoCount();
    };
  }, [stopAutoCount]);

  if (zenMode) return null;

  return (
    <div className="flex flex-row sm:flex-col items-center justify-center gap-3.5 sm:gap-3 shrink-0">
      {/* Auto-Tapper Play/Pause */}
      <GlassButton
        onClick={toggleAutoCount}
        title={autoCountActive ? "Pause Auto-Count" : "Start Auto-Count"}
        className={autoCountActive ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]" : ""}
      >
        {autoCountActive ? (
          <Pause className="w-4 h-4 text-amber-500 fill-current" />
        ) : (
          <Play className="w-4 h-4 text-primary/75 fill-current ml-0.5" />
        )}
      </GlassButton>

      {/* Auto-Tapper Speed Selector */}
      <GlassButton
        onClick={cycleSpeed}
        title={`Auto-Count Speed (Current: ${currentSpeedLabel})`}
      >
        <span className="text-[10px] font-bold tracking-tighter text-primary/75">
          {currentSpeedLabel}
        </span>
      </GlassButton>

      <GlassButton
        onClick={(e) => { e.stopPropagation(); decrement(); }}
        disabled={currentCount === 0}
        title="Decrement"
      >
        <Minus className="w-4 h-4 text-primary/75" />
      </GlassButton>

      <GlassButton
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Reset counter?')) reset();
        }}
        disabled={currentCount === 0}
        title="Reset"
      >
        <RotateCcw className="w-4 h-4 text-primary/75" />
      </GlassButton>

      <SettingsView defaultTab="appearance">
        <GlassButton title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/75">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </GlassButton>
      </SettingsView>

      <UndoButton />
    </div>
  );
});
