import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';

// Convert number to Arabic-Indic numerals
const toArabicNumerals = (n: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(d => arabicDigits[parseInt(d)] ?? d).join('');
};

// Bead display: 33 beads in a ring, filled based on current round position
const TasbeehBeadRing = memo(({ beadPosition, roundCount, progress }: {
  beadPosition: number;
  roundCount: number;
  progress: number;
}) => {
  const total = 33;
  const cx = 150;
  const cy = 150;
  const r = 112;
  const beadR = 9;

  const beads = useMemo(() => Array.from({ length: total }, (_, i) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      filled: i < beadPosition,
      current: i === beadPosition && beadPosition < total,
    };
  }), [beadPosition]);

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="beadFilled" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <radialGradient id="beadEmpty" cx="35%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
        </radialGradient>
        <radialGradient id="beadCurrent" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Tasbih string */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(180,140,60,0.25)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />

      {/* Beads */}
      {beads.map((bead, i) => (
        <g key={i}>
          {bead.current && (
            <circle
              cx={bead.x} cy={bead.y} r={beadR + 5}
              fill="rgba(251,191,36,0.15)"
              filter="url(#softglow)"
            />
          )}
          <circle
            cx={bead.x}
            cy={bead.y}
            r={bead.current ? beadR + 1.5 : beadR}
            fill={
              bead.filled
                ? 'url(#beadFilled)'
                : bead.current
                ? 'url(#beadCurrent)'
                : 'url(#beadEmpty)'
            }
            stroke={bead.filled ? 'rgba(180,120,30,0.6)' : bead.current ? 'rgba(251,191,36,0.8)' : 'rgba(255,255,255,0.08)'}
            strokeWidth={bead.current ? 1.5 : 0.8}
            filter={bead.current ? 'url(#glow)' : undefined}
          />
          {/* Bead shine */}
          {(bead.filled || bead.current) && (
            <circle
              cx={bead.x - (bead.current ? 4 : 3)}
              cy={bead.y - (bead.current ? 4 : 3)}
              r={bead.current ? 2.5 : 2}
              fill="rgba(255,255,255,0.55)"
            />
          )}
        </g>
      ))}

      {/* Center Imam bead marker (top position divider) */}
      <circle cx={cx} cy={cy - r - 0} r={4} fill="#d97706" stroke="#92400e" strokeWidth={1} />
    </svg>
  );
});
TasbeehBeadRing.displayName = 'TasbeehBeadRing';

export const CounterDisplay = memo(function CounterDisplay() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const increment = useTasbeehStore(state => state.increment);
  const theme = useTasbeehStore(state => state.theme);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const sessionMode = useTasbeehStore(state => state.sessionMode);

  // Tasbeeh logic: each round is 33. beadPosition = currentCount % 33
  const ROUND_SIZE = 33;
  const beadPosition = currentCount % ROUND_SIZE;
  const roundCount = Math.floor(currentCount / ROUND_SIZE); // completed full rounds
  const progress = targetCount > 0 ? Math.min(currentCount / targetCount, 1) : 0;

  const handleTap = () => increment();

  // For display in center: show round # if completed rounds > 0, else show bead position
  const centerDisplay = currentCount;
  const roundLabel = roundCount > 0 ? `× ${roundCount}` : '';

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={handleTap}
        className="relative cursor-pointer select-none"
        style={{ width: 'min(78vw, 40vh, 320px)', height: 'min(78vw, 40vh, 320px)' }}
      >
        {/* Outer ambient glow */}
        <motion.div
          key={currentCount}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Bead ring */}
        <div className="absolute inset-0">
          <TasbeehBeadRing
            beadPosition={beadPosition}
            roundCount={roundCount}
            progress={progress}
          />
        </div>

        {/* Center button area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative flex flex-col items-center justify-center rounded-full"
            style={{
              width: '54%',
              height: '54%',
              background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid rgba(217,119,6,0.3)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.04),
                inset 0 1px 1px rgba(255,255,255,0.08),
                0 8px 32px rgba(0,0,0,0.5),
                0 0 40px rgba(217,119,6,0.08)
              `,
            }}
          >
            {/* Main count number */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentCount}
                initial={{ scale: 1.4, opacity: 0, y: -4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-col items-center"
              >
                <span
                  className="font-arabic leading-none text-amber-200 select-none"
                  style={{
                    fontSize: currentCount >= 1000 ? '1.8rem' : '2.6rem',
                    fontWeight: 700,
                    textShadow: '0 0 20px rgba(251,191,36,0.5), 0 2px 8px rgba(0,0,0,0.4)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {toArabicNumerals(currentCount)}
                </span>

                {/* Round counter badge */}
                {roundCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-0.5 text-amber-400/70 font-arabic"
                    style={{ fontSize: '0.85rem', letterSpacing: '0.02em' }}
                  >
                    {toArabicNumerals(roundCount)} × ٣٣
                  </motion.span>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Tap ripple effect */}
        <motion.div
          key={`ripple-${currentCount}`}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(251,191,36,0.4)' }}
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Progress indicator below the ring - redesigned for premium look on desktop and mobile */}
      {targetCount > 0 && (
        <div className="mt-3 sm:mt-6 flex items-center justify-center gap-3 w-full max-w-[240px] sm:max-w-[280px]">
          {/* Glassmorphic track with premium gradient fill */}
          <div className="h-1.5 flex-1 rounded-full bg-amber-950/40 border border-amber-500/10 backdrop-blur-sm overflow-hidden relative shadow-inner">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: 'linear-gradient(90deg, #d97706, #fbbf24, #fef08a)',
                boxShadow: '0 0 8px rgba(251,191,36,0.6), inset 0 0.5px 0.5px rgba(255,255,255,0.4)',
              }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          {/* Premium Arabic numerals text */}
          <span
            className="font-arabic text-amber-400/80 text-xs sm:text-sm font-medium tracking-wider select-none shrink-0"
            style={{ textShadow: '0 0 10px rgba(251,191,36,0.3)' }}
          >
            {toArabicNumerals(currentCount)}/{toArabicNumerals(targetCount)}
          </span>
        </div>
      )}
    </div>
  );
});
