import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';

// Convert number to Arabic-Indic numerals for Arabic locale
const toArabicNumerals = (n: number | string, isRTL: boolean): string => {
  if (!isRTL) return n.toString();
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(d => arabicDigits[parseInt(d)] ?? d).join('');
};

interface CrystalOrbitProps {
  progress: number;
  currentCount: number;
}

export const CrystalOrbit = memo(function CrystalOrbit({ progress, currentCount }: CrystalOrbitProps) {
  const { isRTL } = useTranslation();
  const language = useTasbeehStore(state => state.language);
  
  const ROUND_SIZE = 33;
  const beadPosition = currentCount % ROUND_SIZE;
  const roundCount = Math.floor(currentCount / ROUND_SIZE);

  const cx = 150;
  const cy = 150;
  const r = 112;
  const beadR = 9.5;

  const beads = useMemo(() => {
    return Array.from({ length: ROUND_SIZE }, (_, i) => {
      const angle = (i / ROUND_SIZE) * 2 * Math.PI - Math.PI / 2;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        isCompleted: i < beadPosition,
        isActive: i === beadPosition,
        isRemaining: i > beadPosition,
      };
    });
  }, [beadPosition]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* SVG Container for Orbit and Beads */}
      <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
        <defs>
          {/* Glass Gradients */}
          {/* 1. Completed Bead: Glossy Sapphire Blue */}
          <radialGradient id="sapphireBlue" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#bfdbfe" />      {/* Bright glass highlight */}
            <stop offset="30%" stopColor="#60a5fa" />     {/* Translucent blue body */}
            <stop offset="70%" stopColor="#2563eb" />     {/* Rich sapphire body */}
            <stop offset="100%" stopColor="#1e3a8a" />    {/* Dark deep blue refraction */}
          </radialGradient>

          {/* 2. Active Bead: Luminous Amber-Gold */}
          <radialGradient id="amberGold" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fffbeb" />      {/* Intense center highlight */}
            <stop offset="25%" stopColor="#fef08a" />     {/* Bright yellow bloom */}
            <stop offset="60%" stopColor="#fbbf24" />     {/* Pure gold body */}
            <stop offset="85%" stopColor="#d97706" />     {/* Deep amber border */}
            <stop offset="100%" stopColor="#78350f" />    {/* Warm brown refraction */}
          </radialGradient>

          {/* 3. Remaining Bead: Smoked Transparent Black */}
          <radialGradient id="smokedBlack" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.45" />   {/* Soft light gray highlight */}
            <stop offset="40%" stopColor="#475569" stopOpacity="0.3" />    {/* Translucent smoked body */}
            <stop offset="85%" stopColor="#1e293b" stopOpacity="0.5" />    {/* Smoked black contour */}
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.75" />  {/* Dark border shadow */}
          </radialGradient>

          {/* Glow Filters */}
          {/* Sapphire Deep Blue Glow */}
          <filter id="sapphireGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feFlood floodColor="#2563eb" floodOpacity="0.7" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gold Luminous Bloom */}
          <filter id="goldBloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feFlood floodColor="#fbbf24" floodOpacity="0.9" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1.5"
          filter="drop-shadow(0 0 2px rgba(255,255,255,0.05))"
        />

        {/* Beads */}
        {beads.map((bead, i) => {
          if (bead.isActive) {
            return (
              <g key={i}>
                {/* Luminous soft bloom background glow */}
                <motion.circle
                  cx={bead.x}
                  cy={bead.y}
                  r={beadR + 8}
                  fill="rgba(251,191,36,0.12)"
                  filter="url(#goldBloom)"
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Active Bead Body */}
                <motion.circle
                  cx={bead.x}
                  cy={bead.y}
                  r={beadR + 2.5}
                  fill="url(#amberGold)"
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                  filter="url(#goldBloom)"
                  style={{ cursor: 'pointer' }}
                  animate={{
                    scale: [1, 1.06, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Realistic active bead reflection */}
                <circle
                  cx={bead.x - 3.5}
                  cy={bead.y - 3.5}
                  r="3.2"
                  fill="white"
                  opacity="0.85"
                  className="pointer-events-none"
                />
              </g>
            );
          }

          if (bead.isCompleted) {
            return (
              <g key={i}>
                {/* Completed Bead Body */}
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r={beadR}
                  fill="url(#sapphireBlue)"
                  stroke="#3b82f6"
                  strokeWidth="0.5"
                  filter="url(#sapphireGlow)"
                />
                {/* Realistic glass reflection */}
                <circle
                  cx={bead.x - 2.8}
                  cy={bead.y - 2.8}
                  r="2.4"
                  fill="white"
                  opacity="0.7"
                  className="pointer-events-none"
                />
              </g>
            );
          }

          // Remaining Bead
          return (
            <g key={i}>
              <circle
                cx={bead.x}
                cy={bead.y}
                r={beadR - 0.5}
                fill="url(#smokedBlack)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
              {/* Glass reflection (faint) */}
              <circle
                cx={bead.x - 2.2}
                cy={bead.y - 2.2}
                r="1.8"
                fill="white"
                opacity="0.25"
                className="pointer-events-none"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Frosted-Glass Circular Center Counter */}
      <div 
        className="absolute w-[53%] h-[53%] rounded-full flex flex-col items-center justify-center pointer-events-none select-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(16px) saturate(120%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `
            0 12px 32px 0 rgba(0, 0, 0, 0.35),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.25)
          `
        }}
      >
        <span
          className={`${isRTL ? 'font-arabic' : 'counter-number'} leading-none`}
          style={{
            fontSize: currentCount >= 1000 ? '2rem' : '2.8rem',
            fontWeight: 800,
            color: '#f8fafc',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.25), 0 2px 10px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-0.02em',
          }}
        >
          {toArabicNumerals(currentCount, isRTL)}
        </span>

        {roundCount > 0 && (
          <span
            className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wide font-medium backdrop-blur-sm bg-white/5 border border-white/10`}
            style={{ 
              color: 'rgba(255, 255, 255, 0.65)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)' 
            }}
          >
            {toArabicNumerals(roundCount, isRTL)} {isRTL ? '× ٣٣' : '× 33'}
          </span>
        )}
      </div>
    </div>
  );
});

CrystalOrbit.displayName = 'CrystalOrbit';
