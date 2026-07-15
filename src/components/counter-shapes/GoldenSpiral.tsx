import { memo } from 'react';
import { motion } from 'framer-motion';

export const GoldenSpiral = memo(({ progress, currentCount }: { progress: number; currentCount: number }) => {
  // Generate coordinates for a golden spiral
  const dotsCount = 33;
  const spiralDots = Array.from({ length: dotsCount }).map((_, i) => {
    // Logarithmic spiral math
    const theta = (i / dotsCount) * Math.PI * 4; // 2 full rotations
    const r = 20 + 70 * (i / dotsCount); // growing radius
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    return { x, y, index: i };
  });

  // Calculate active index based on progress
  const activeDotIndex = Math.min(Math.floor(progress * dotsCount), dotsCount - 1);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Background soft golden glow */}
      <div className="absolute w-40 h-40 rounded-full blur-[35px] opacity-25 bg-amber-400" />

      {/* Spiral dots */}
      <div className="absolute w-64 h-64 flex items-center justify-center">
        {spiralDots.map((dot) => {
          const isActive = dot.index <= activeDotIndex;
          const isCurrent = dot.index === activeDotIndex;

          return (
            <motion.div
              key={dot.index}
              className="absolute rounded-full"
              style={{
                x: dot.x,
                y: dot.y,
                width: isCurrent ? '10px' : isActive ? '6px' : '4px',
                height: isCurrent ? '10px' : isActive ? '6px' : '4px',
                backgroundColor: isCurrent 
                  ? '#fbbf24' 
                  : isActive 
                    ? '#f59e0b' 
                    : 'rgba(251, 191, 36, 0.15)',
                boxShadow: isCurrent 
                  ? '0 0 12px #fbbf24, 0 0 4px #f59e0b' 
                  : isActive 
                    ? '0 0 4px rgba(245, 158, 11, 0.5)' 
                    : 'none',
              }}
              animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          );
        })}
      </div>

      {/* Centered text display */}
      <div className="relative flex flex-col items-center justify-center">
        <span className="text-[9px] font-bold tracking-widest text-amber-500/50 mb-0.5">SPIRAL</span>
        <motion.span
          key={`num-${currentCount}`}
          initial={{ scale: 0.9, y: 3 }}
          animate={{ scale: 1, y: 0 }}
          className="text-4xl font-extrabold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
        >
          {currentCount}
        </motion.span>
      </div>
    </div>
  );
});
