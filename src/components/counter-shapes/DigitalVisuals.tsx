import { motion } from 'framer-motion';
import { memo } from 'react';

interface DigitalVisualsProps {
  currentCount: number;
  progress: number;
}

export const DigitalVisuals = memo(({ currentCount, progress }: DigitalVisualsProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none scale-[0.9]">
      {/* Ring of 33 beads */}
      <div className="absolute inset-0 flex items-center justify-center scale-[0.85] sm:scale-100">
        <svg className="w-[256px] h-[256px] -rotate-90 opacity-80" viewBox="0 0 256 256">
          {Array.from({ length: 33 }).map((_, i) => {
            const safeProgress = isNaN(progress) ? 0 : progress;
            const angle = (i * 360) / 33;
            const radius = 115;
            const x = 128 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 128 + radius * Math.sin((angle * Math.PI) / 180);
            return (
              <circle
                key={i}
                cx={Number.isFinite(x) ? x : 128}
                cy={Number.isFinite(y) ? y : 128}
                r="4.5"
                fill={i < (safeProgress * 33) ? "var(--primary)" : "rgba(255,255,255,0.15)"}
                style={{
                  filter: i < (safeProgress * 33) ? 'drop-shadow(0 0 6px var(--primary))' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Golden Device Body */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-[180px] h-[220px] bg-gradient-to-b from-[#f3d692] via-[#d4af37] to-[#8b6508] rounded-[50px] shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),0_20px_40px_rgba(0,0,0,0.5)] border-b-[6px] border-[#5c4305] flex flex-col items-center pt-5">
          {/* Screen Area */}
          <div className="w-[88%] h-[80px] bg-[#050505] rounded-2xl border-[3px] border-[#a07d2a] shadow-[inset_0_5px_15px_rgba(0,0,0,1)] flex flex-col items-center justify-center relative overflow-hidden mb-4">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
            <span className="text-[#d4af37] font-arabic text-md mb-0.5 tracking-wider drop-shadow-sm font-medium">تسبِيح</span>
            <div className="bg-[#142016] px-3 py-1 rounded-sm border border-[#222] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] min-w-[100px] text-center">
              <span className="font-mono text-[#7ea37e] text-3xl tracking-[0.25em] drop-shadow-[0_0_5px_rgba(126,163,126,0.6)]">
                {currentCount.toString().padStart(4, '0')}
              </span>
            </div>
          </div>

          {/* Main Thumb Button */}
          <motion.div 
            className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#dfb958] via-[#d4af37] to-[#8b6508] border-2 border-[#a07d2a] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center z-10"
            whileTap={{ scale: 0.95, boxShadow: "0 5px 10px rgba(0,0,0,0.6), inset 0 2px 8px rgba(0,0,0,0.8)" }}
          />

          {/* Static Reset Button Decoration */}
          <div className="absolute right-7 bottom-[65px] w-6 h-6 rounded-full bg-gradient-to-b from-[#e6c17a] to-[#8b6508] border-[1.5px] border-[#5c4305] shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#5c4305]/50" />
          </div>
        </div>
      </div>
    </div>
  );
});
