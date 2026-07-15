import { memo } from 'react';
import { motion } from 'framer-motion';

export const AuroraGlow = memo(({ progress, currentCount }: { progress: number; currentCount: number }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Background rotating glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-56 h-56 rounded-full blur-[35px] opacity-60 bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400"
      />

      {/* Pulsing inner ring */}
      <motion.div
        key={`aurora-${currentCount}`}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1.05, opacity: 0.15 }}
        transition={{ duration: 0.4 }}
        className="absolute w-52 h-52 rounded-full border-4 border-white/40 blur-[2px]"
      />

      {/* Main glass circle container */}
      <div className="relative w-48 h-48 rounded-full border border-white/20 bg-black/45 backdrop-blur-xl flex flex-col items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
        {/* Count Label inside */}
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">AURORA</span>
        <motion.span
          key={`num-${currentCount}`}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
        >
          {currentCount}
        </motion.span>
        <span className="text-[9px] font-bold text-cyan-300 mt-1.5">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
});
