import { memo } from 'react';
import { motion } from 'framer-motion';

export const DiamondPrism = memo(({ progress, currentCount }: { progress: number; currentCount: number }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Glow */}
      <div className="absolute w-44 h-44 rounded-full blur-[40px] opacity-35 bg-cyan-500" />

      {/* Hexagonal container */}
      <div 
        className="w-48 h-48 flex flex-col items-center justify-center relative border border-cyan-500/30 bg-card/60 backdrop-blur-xl shadow-2xl"
        style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
      >
        {/* Rotating inner diamond shard */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 border border-cyan-400/20"
          style={{ clipPath: 'polygon(50% 10%, 85% 35%, 85% 65%, 50% 90%, 15% 65%, 15% 35%)' }}
        />

        {/* Dynamic scale shard on count change */}
        <motion.div
          key={`shard-${currentCount}`}
          initial={{ scale: 0.7, opacity: 0.8 }}
          animate={{ scale: 1.1, opacity: 0 }}
          className="absolute inset-4 border-2 border-cyan-400"
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
        />

        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400/60 mb-0.5">PRISM</span>
        <motion.span
          key={`num-${currentCount}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-5xl font-mono font-black text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
        >
          {currentCount}
        </motion.span>
        <span className="text-[9px] font-semibold text-muted-foreground mt-1">Progress: {Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
});
