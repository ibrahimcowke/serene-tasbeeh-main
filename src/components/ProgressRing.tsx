import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 4,
  className = ''
}: ProgressRingProps) {
  const safeSize = isNaN(size) || size <= 0 ? 280 : size;
  const safeStrokeWidth = isNaN(strokeWidth) ? 4 : strokeWidth;
  const radius = (safeSize - safeStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeProgress = isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
  const offset = circumference - (safeProgress * circumference);

  const cx = safeSize / 2;
  const cy = safeSize / 2;
  const safeRadius = isNaN(radius) || radius < 0 ? 0 : radius;

  return (
    <svg
      width={safeSize}
      height={safeSize}
      className={`-rotate-90 ${className}`}
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={safeRadius}
        fill="none"
        stroke="hsl(var(--progress-track))"
        strokeWidth={safeStrokeWidth}
      />
      {/* Progress fill */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={safeRadius}
        fill="none"
        stroke="hsl(var(--progress-fill))"
        strokeWidth={safeStrokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </svg>
  );
}
