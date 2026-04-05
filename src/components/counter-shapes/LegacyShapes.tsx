import { motion } from 'framer-motion';
import { memo } from 'react';

export const ClassicVisuals = memo(({ progress }: { progress: number }) => (
  <svg width="100%" height="100%" viewBox="0 0 256 256" className="-rotate-90">
      <rect x="10" y="10" width="236" height="236" rx="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-original-muted/30" />
      <motion.rect
          x="10" y="10" width="236" height="236" rx="24"
          fill="none" stroke="currentColor" strokeWidth="4"
          className="text-current drop-shadow-[0_0_10px_currentColor]"
          pathLength="1" strokeDasharray="1"
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 1 - progress }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
      />
  </svg>
));

export const CircularProgress = memo(({ progress }: { progress: number }) => (
  <svg width="100%" height="100%" viewBox="0 0 256 256" className="-rotate-90">
      <circle cx="128" cy="128" r="123" fill="none" stroke="currentColor" strokeWidth="4" className="text-original-muted/30" />
      <motion.circle
          cx="128" cy="128" r="123"
          fill="none" stroke="currentColor" strokeWidth="4"
          className="text-current drop-shadow-[0_0_10px_currentColor]"
          strokeDasharray="772"
          initial={{ strokeDashoffset: 772 }}
          animate={{ strokeDashoffset: 772 - (772 * progress) }}
          strokeLinecap="round"
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
      />
  </svg>
));

export const FlowerVisuals = memo(({ currentCount }: { currentCount: number }) => (
  <div className="absolute inset-0 flex items-center justify-center -z-10">
      <motion.div animate={{ rotate: currentCount * 10 }} className="w-[280px] h-[280px] relative opacity-20">
          {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute top-1/2 left-1/2 w-24 h-24 bg-current rounded-full origin-bottom-right" style={{ transform: `rotate(${i * 45}deg) translate(-50%, -100%)` }} />
          ))}
      </motion.div>
  </div>
));

export const WaveformVisuals = memo(({ progress }: { progress: number }) => (
  <div className="absolute inset-0 rounded-full overflow-hidden -z-10 border-4 border-original-muted/50">
      <div className="absolute inset-0 bg-original-secondary/30" />
      <div className="absolute bottom-0 left-0 right-0 h-full bg-original-muted/20" />
      <motion.div className="absolute bottom-0 left-0 right-0 bg-current/40 text-current" initial={{ height: 0 }} animate={{ height: `${Math.max(progress * 100, 5)}%` }} transition={{ type: 'spring', bounce: 0, duration: 0.5 }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-current shadow-[0_0_15px_currentColor]" />
          <div className="absolute top-0 left-0 right-0 h-6 bg-current/40 blur-md transform -translate-y-1/2" />
      </motion.div>
      <div className="absolute inset-0 rounded-full border-2 border-current/30 pointer-events-none" />
  </div>
));

export const RingLightVisuals = memo(({ currentCount }: { currentCount: number }) => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 scale-[0.85]">
      <div className="w-[256px] h-[256px] relative flex items-center justify-center">
          <motion.div
              className="absolute inset-[8px] rounded-full border-[18px] border-white bg-white/20 shadow-[0_0_50px_rgba(255,255,255,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]"
              animate={{
                  boxShadow: currentCount % 2 === 0
                      ? ['0 0 50px rgba(255,255,255,0.8), inset 0 0 30px rgba(255,255,255,1)', '0 0 80px rgba(255,255,255,0.9), inset 0 0 40px rgba(255,255,255,1)']
                      : ['0 0 50px rgba(255,255,255,0.8), inset 0 0 30px rgba(255,255,255,1)', '0 0 80px rgba(255,255,255,0.9), inset 0 0 40px rgba(255,255,255,1)']
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          >
              <div className="absolute inset-0 rounded-full border-[1px] border-gray-300/30 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          </motion.div>
          <div className="absolute inset-[26px] rounded-full bg-black/90 shadow-[inset_0_0_20px_rgba(0,0,0,1),0_0_20px_rgba(255,255,255,0.5)] border-4 border-gray-800" />
      </div>
  </div>
));

export const ModernRingVisuals = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-[280px] h-[280px] rounded-full border border-current/10 border-t-current/50 border-r-transparent" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-[250px] h-[250px] rounded-full border border-original-secondary/20 border-b-original-secondary/50 border-l-transparent dashed-circle" />
  </div>
));

export const VintageWoodVisuals = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 w-full h-full">
      <div className="w-[260px] h-[300px] bg-[#3e2723] rounded-[40px] border-[6px] border-[#5d4037] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.1)] flex flex-col items-center relative overflow-hidden scale-75 sm:scale-90">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />
          <div className="absolute top-4 w-4 h-4 rounded-full bg-[#8d6e63] shadow-inner flex items-center justify-center">
              <div className="w-1 h-0.5 bg-[#5d4037] rotate-45" />
          </div>
          <div className="absolute bottom-4 w-16 h-1 bg-[#5d4037] rounded-full opacity-50" />
      </div>
  </div>
));

export const AnimatedRippleVisuals = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center -z-10">
      <div className="w-64 h-64 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
          {[...Array(3)].map((_, i) => (
              <motion.div key={i} className="absolute inset-0 rounded-full border border-blue-400/50" animate={{ scale: [1, 1.5], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }} />
          ))}
      </div>
  </div>
));

export const BeadsDecorator = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
    <svg className="w-[300px] h-[300px] -rotate-90">
      <circle cx="150" cy="150" r="140" stroke="currentColor" fill="none" strokeWidth="2" className="text-original-muted/10" strokeDasharray="1 30" />
    </svg>
  </div>
));

export const MinimalBorder = memo(() => (
  <div className="absolute inset-4 rounded-full border border-border/50" />
));

export const ClassicBody = memo(() => (
  <div className="absolute inset-x-0 -top-4 bottom-0 bg-original-secondary/30 rounded-3xl border-4 border-original-muted flex items-center justify-center -z-10 flex-col">
    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-original-muted/30" />
    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-original-muted/30" />
    <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-original-muted/30" />
    <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-original-muted/30" />
  </div>
));

export const BeadsButtonInterior = memo(() => (
  <div className="absolute inset-0 rounded-full">
    <svg className="w-full h-full -rotate-90">
      <circle cx="50%" cy="50%" r="48%" stroke="currentColor" fill="none" strokeWidth="1" className="text-muted/20" />
      <circle
        cx="50%" cy="50%" r="48%"
        stroke="currentColor"
        fill="none"
        strokeWidth="12"
        className="text-primary/10"
        strokeDasharray="1 15"
      />
    </svg>
  </div>
));
