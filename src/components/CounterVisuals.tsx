import { motion } from 'framer-motion';
import { ThemeSettings, CounterShape } from '@/store/tasbeehStore';
import { HaloRing } from './counter-shapes/HaloRing';
import { BeadRing } from './counter-shapes/BeadRing';
import { ZenStones } from './counter-shapes/ZenStones';
import { VerticalCapsules } from './counter-shapes/VerticalCapsules';
import { LuminousBeads } from './counter-shapes/LuminousBeads';


interface CounterVisualsProps {
    layout: 'default' | 'focus' | 'ergonomic';
    counterShape: CounterShape;
    counterVerticalOffset: number;
    counterScale: number;
    progress: number;
    currentCount: number;
    currentSettings: ThemeSettings;
    countFontSize: number;
    handleTap: () => void;
    showCompletion: boolean;
    disabled: boolean;
}

export function CounterVisuals({
    layout,
    counterShape,
    counterVerticalOffset,
    counterScale,
    progress,
    currentCount,
    currentSettings,
    countFontSize,
    handleTap,
    showCompletion,
    disabled
}: CounterVisualsProps) {
    return (
        <motion.div
            layout
            className={`relative flex items-center justify-center
      ${layout === 'focus' ? 'scale-100 sm:scale-110' : ''}
      ${layout === 'ergonomic' ? 'scale-90 sm:scale-100 translate-y-2 sm:translate-y-4' : ''}
      w-[min(80vw,60vh)] h-[min(80vw,60vh)] sm:w-[300px] sm:h-[300px] max-w-[320px] max-h-[320px]
    `}
            style={{
                transform: `translateY(${counterVerticalOffset}px) scale(${counterScale})`
            }}
        >
            {/* Encircled BrogressBar - Wraps the counter button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                {counterShape === 'classic' && (
                    <svg width="100%" height="100%" viewBox="0 0 280 280" className="-rotate-90">
                        <rect
                            x="10" y="10" width="260" height="260" rx="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/30"
                        />
                        <motion.rect
                            x="10" y="10" width="260" height="260" rx="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            pathLength="1"
                            strokeDasharray="1"
                            initial={{ strokeDashoffset: 1 }}
                            animate={{ strokeDashoffset: 1 - progress }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        />
                    </svg>
                )}



                {['minimal', 'beads', 'flower', 'waveform', 'digital', 'modern-ring', 'ring-light'].includes(counterShape) && (
                    <svg width="100%" height="100%" viewBox="0 0 290 290" className="-rotate-90">
                        <circle
                            cx="145"
                            cy="145"
                            r="140"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/30"
                        />
                        <motion.circle
                            cx="145"
                            cy="145"
                            r="140"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            strokeDasharray="880"
                            initial={{ strokeDashoffset: 880 }}
                            animate={{ strokeDashoffset: 880 - (880 * progress) }}
                            strokeLinecap="round"
                            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        />
                    </svg>
                )}
            </div>

            {counterShape === 'minimal' && (
                <div className="absolute inset-4 rounded-full border border-border/50" />
            )}

            {counterShape === 'ring-light' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-[300px] h-[300px] relative flex items-center justify-center">
                        {/* Main Light Ring */}
                        <motion.div
                            className="absolute inset-[10px] rounded-full border-[20px] border-white bg-white/20 shadow-[0_0_50px_rgba(255,255,255,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]"
                            animate={{
                                boxShadow: currentCount % 2 === 0
                                    ? ['0 0 50px rgba(255,255,255,0.8), inset 0 0 30px rgba(255,255,255,1)', '0 0 80px rgba(255,255,255,0.9), inset 0 0 40px rgba(255,255,255,1)']
                                    : ['0 0 50px rgba(255,255,255,0.8), inset 0 0 30px rgba(255,255,255,1)', '0 0 80px rgba(255,255,255,0.9), inset 0 0 40px rgba(255,255,255,1)']
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                            {/* LED Beads simulation (subtle dots inside the ring) */}
                            <div className="absolute inset-0 rounded-full border-[1px] border-gray-300/30 opacity-50"
                                style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                            />
                        </motion.div>

                        {/* Dark center hole - where the phone usually goes */}
                        <div className="absolute inset-[30px] rounded-full bg-black/90 shadow-[inset_0_0_20px_rgba(0,0,0,1),0_0_20px_rgba(255,255,255,0.5)] border-4 border-gray-800" />
                    </div>
                </div>
            )}



            {counterShape === 'classic' && (
                <div className="absolute inset-x-0 -top-4 bottom-0 bg-secondary/30 rounded-3xl border-4 border-muted flex items-center justify-center -z-10 flex-col">
                    {/* Decorative screws */}
                    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
            )}



            {counterShape === 'beads' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                    <svg className="w-[300px] h-[300px] -rotate-90">
                        {/* Track Dots - subtle guide only */}
                        <circle cx="150" cy="150" r="140" stroke="currentColor" fill="none" strokeWidth="2" className="text-muted/10" strokeDasharray="1 30" />
                    </svg>
                </div>
            )}

            {counterShape === 'flower' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    {/* Flower petals rotating */}
                    <motion.div
                        animate={{ rotate: currentCount * 10 }}
                        className="w-[280px] h-[280px] relative opacity-20"
                    >
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-24 h-24 bg-primary rounded-full origin-bottom-right"
                                style={{ transform: `rotate(${i * 45}deg) translate(-50%, -100%)` }}
                            />
                        ))}
                    </motion.div>
                </div>
            )}

            {counterShape === 'waveform' && (
                <div className="absolute inset-0 rounded-full overflow-hidden -z-10 border-4 border-muted/50">
                    <div className="absolute inset-0 bg-secondary/30" />
                    {/* Distinct Background Level */}
                    <div className="absolute bottom-0 left-0 right-0 h-full bg-muted/20" />

                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-primary/40 text-primary"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(progress * 100, 5)}%` }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                    >
                        {/* Glowing Top Edge */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_15px_currentColor]" />
                        <div className="absolute top-0 left-0 right-0 h-6 bg-primary/40 blur-md transform -translate-y-1/2" />
                    </motion.div>
                    {/* Crisp outline */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none" />
                </div>
            )}



            {counterShape === 'digital' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                    {/* Ring of 33 beads */}
                    <svg className="absolute w-[400px] h-[400px] -rotate-90 scale-[1.2] sm:scale-[1.4] opacity-80">
                        {Array.from({ length: 33 }).map((_, i) => {
                            const angle = (i * 360) / 33;
                            const radius = 145;
                            const x = 200 + radius * Math.cos((angle * Math.PI) / 180);
                            const y = 200 + radius * Math.sin((angle * Math.PI) / 180);
                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="5.5"
                                    fill={i < (progress * 33) ? "var(--primary)" : "rgba(255,255,255,0.15)"}
                                    style={{
                                        filter: i < (progress * 33) ? 'drop-shadow(0 0 6px var(--primary))' : 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                />
                            );
                        })}
                    </svg>

                    {/* Golden Device Body */}
                    <div className="relative w-[210px] h-[260px] bg-gradient-to-b from-[#f3d692] via-[#d4af37] to-[#8b6508] rounded-[50px] shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),0_20px_40px_rgba(0,0,0,0.5)] border-b-[6px] border-[#5c4305] flex flex-col items-center pt-5">
                        {/* Screen Area */}
                        <div className="w-[88%] h-[90px] bg-[#050505] rounded-2xl border-[3px] border-[#a07d2a] shadow-[inset_0_5px_15px_rgba(0,0,0,1)] flex flex-col items-center justify-center relative overflow-hidden mb-4">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
                            <span className="text-[#d4af37] font-arabic text-lg mb-0.5 tracking-wider drop-shadow-sm font-medium">تسبيح</span>
                            <div className="bg-[#142016] px-3 py-1 rounded-sm border border-[#222] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] min-w-[110px] text-center">
                                <span className="font-mono text-[#7ea37e] text-3xl tracking-[0.25em] drop-shadow-[0_0_3px_rgba(126,163,126,0.4)]">
                                    {currentCount.toString().padStart(4, '0')}
                                </span>
                            </div>
                        </div>

                        {/* Static Reset Button Decoration */}
                        <div className="absolute right-7 bottom-[85px] w-6 h-6 rounded-full bg-gradient-to-b from-[#e6c17a] to-[#8b6508] border-2 border-[#5c4305] shadow-md" />
                    </div>
                </div>
            )}

            {
                counterShape === 'modern-ring' && (
                    <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[280px] h-[280px] rounded-full border border-primary/10 border-t-primary/50 border-r-transparent"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[250px] h-[250px] rounded-full border border-secondary/20 border-b-secondary/50 border-l-transparent dashed-circle"
                        />
                    </div>
                )
            }

            {
                counterShape === 'vintage-wood' && (
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                        <div className="w-[260px] h-[300px] bg-[#3e2723] rounded-[40px] border-[6px] border-[#5d4037] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.1)] flex flex-col items-center relative overflow-hidden">
                            {/* Decorative background pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

                            {/* Top Screw */}
                            <div className="absolute top-4 w-4 h-4 rounded-full bg-[#8d6e63] shadow-inner flex items-center justify-center">
                                <div className="w-full h-0.5 bg-[#5d4037] rotate-45" />
                            </div>
                            {/* Bottom Decoration */}
                            <div className="absolute bottom-4 w-16 h-1 bg-[#5d4037] rounded-full opacity-50" />
                        </div>
                    </div>
                )
            }

            {counterShape === 'geometric-star' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <svg width="100%" height="100%" viewBox="0 0 300 300" className="animate-[spin_60s_linear_infinite]">
                        {/* Outer Ring */}
                        <circle cx="150" cy="150" r="145" stroke="currentColor" strokeWidth="1" className="text-primary/30" />

                        {/* 8-pointed Islamic Star */}
                        <path
                            d="M150 10 L180 100 L290 100 L210 170 L240 280 L150 220 L60 280 L90 170 L10 100 L120 100 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/20"
                        />
                        {/* Inner dashed circle */}
                        <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="1" className="text-muted/10" strokeDasharray="4 4" />

                        {/* Central Ring */}
                        <circle cx="150" cy="150" r="40" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
                    </svg>
                </div>
            )}

            {counterShape === 'fluid' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-primary/5 opacity-50 blur-3xl" />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30"
                        animate={{
                            borderRadius: [
                                "60% 40% 30% 70% / 60% 30% 70% 40%",
                                "30% 60% 70% 40% / 50% 60% 30% 60%",
                                "60% 40% 30% 70% / 60% 30% 70% 40%"
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-4 border-2 border-white/20"
                        animate={{
                            borderRadius: [
                                "50% 50% 50% 50% / 50% 50% 50% 50%",
                                "60% 40% 30% 70% / 60% 30% 70% 40%",
                                "50% 50% 50% 50% / 50% 50% 50% 50%"
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>
            )}



            {counterShape === 'real-beads' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <motion.div
                        className="w-[calc(100%+60px)] h-[calc(100%+60px)] relative"
                        animate={{ rotate: (currentCount % 33) * (360 / 33) }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <svg width="100%" height="100%" viewBox="0 0 300 300" className="overflow-visible">
                            {/* String */}
                            <circle cx="150" cy="150" r="140" fill="none" stroke="#8d6e63" strokeWidth="2" />
                            {/* Beads */}
                            {Array.from({ length: 33 }).map((_, i) => {
                                const angle = (i * 360) / 33 - 90;
                                const radius = 140;
                                const x = 150 + radius * Math.cos((angle * Math.PI) / 180);
                                const y = 150 + radius * Math.sin((angle * Math.PI) / 180);
                                return (
                                    <g key={i}>
                                        <circle cx={x} cy={y} r="12" fill="url(#beadGradient)" stroke="#5d4037" strokeWidth="1" />
                                        <circle cx={x - 3} cy={y - 3} r="4" fill="white" opacity="0.3" />
                                    </g>
                                );
                            })}
                            <defs>
                                <radialGradient id="beadGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                                    <stop offset="0%" stopColor="#d7ccc8" />
                                    <stop offset="100%" stopColor="#5d4037" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-8 h-16 bg-[#5d4037] rounded-full z-10 shadow-lg flex items-center justify-center border-2 border-[#8d6e63]">
                        {/* Tassel Head */}
                        <div className="w-1 h-8 bg-[#a1887f]" />
                    </div>
                </div>
            )}



            {counterShape === 'radar' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10 bg-black/80 rounded-full border-2 border-primary/30 overflow-hidden">
                    {/* Grid */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="absolute inset-0 border border-primary/20 rounded-full scale-50" />
                    <div className="absolute inset-0 border border-primary/20 rounded-full scale-75" />

                    {/* Scanner */}
                    <motion.div
                        className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--primary)/0.5)_360deg)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}
                    />
                </div>
            )}

            {counterShape === 'glass-orb' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent backdrop-blur-sm border-2 border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_10px_10px_40px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden">
                        <div className="absolute top-10 left-10 w-32 h-20 bg-white/60 blur-[30px] rounded-full transform -rotate-45" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/20 blur-[40px] rounded-full" />
                    </div>
                </div>
            )}



            {counterShape === 'portal-depth' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden rounded-full bg-black">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border-2 border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                            initial={{ scale: 0.1, opacity: 0 }}
                            animate={{ scale: 2, opacity: [0, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
                </div>
            )}

            {counterShape === 'luminous-ring' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-[280px] h-[280px] rounded-full bg-black flex items-center justify-center shadow-[0_0_60px_hsl(var(--primary)/0.3)] border border-primary/20">
                        <div className="w-[90%] h-[90%] rounded-full border-[6px] border-primary shadow-[0_0_20px_hsl(var(--primary)/0.8),inset_0_0_20px_hsl(var(--primary)/0.5)]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-full mix-blend-overlay" />
                    </div>
                </div>
            )}

            {counterShape === 'biolum-organic' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-[320px] h-[320px] relative flex items-center justify-center">
                        {/* Organic Bone Spiral Structure */}
                        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl animate-spin-slow-super">
                            <defs>
                                <filter id="bone-relief">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                                    <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="1">
                                        <feDistantLight azimuth="45" elevation="60" />
                                    </feDiffuseLighting>
                                    <feComposite operator="in" in2="SourceGraphic" result="textured" />
                                    <feMerge>
                                        <feMergeNode in="SourceGraphic" />
                                        <feMergeNode in="textured" mode="multiply" />
                                    </feMerge>
                                </filter>
                                <radialGradient id="bio-pool-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                                    <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                                </radialGradient>
                                <filter id="glow-cells">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <g transform="translate(200,200)">
                                {/* Spiral Arms Construction */}
                                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                    <g key={i} transform={`rotate(${deg})`}>
                                        {/* Bone Segment */}
                                        <path
                                            d="M0,0 Q40,-60 10,-140 Q-50,-180 -100,-120 Q-60,-50 0,0 Z"
                                            fill="#e8e4dc"
                                            stroke="#dcd8d0"
                                            strokeWidth="1"
                                            filter="url(#bone-relief)"
                                            className="drop-shadow-lg"
                                        />
                                        {/* Deep Recess for "Pools" */}
                                        <path
                                            d="M-20,-60 Q-10,-100 -40,-130 Q-70,-110 -50,-60 Z"
                                            fill="#1a2530"
                                            opacity="0.8"
                                        />
                                        {/* Glowing Cellular Orbs within Recess */}
                                        <g filter="url(#glow-cells)">
                                            <circle cx="-35" cy="-90" r="8" fill="url(#bio-pool-grad)" opacity="0.8">
                                                <animate attributeName="opacity" values="0.4;1;0.4" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                                                <animate attributeName="r" values="7;9;7" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="-50" cy="-110" r="5" fill="url(#bio-pool-grad)" opacity="0.6">
                                                <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="-25" cy="-75" r="4" fill="url(#bio-pool-grad)" opacity="0.6">
                                                <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
                                            </circle>
                                        </g>
                                    </g>
                                ))}
                            </g>
                        </svg>

                        {/* Central Cellular Display Pool */}
                        <div className="absolute w-[140px] h-[140px] rounded-full bg-[#050a0a] shadow-[inset_0_0_30px_hsl(var(--primary)/0.4)] flex items-center justify-center overflow-hidden border-4 border-[#dcd8d0] z-20">
                            {/* Moving Cells Background */}
                            <div className="absolute inset-[-50%]"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.15) 2px, transparent 3px)',
                                    backgroundSize: '20px 20px',
                                }}
                            >
                                <motion.div
                                    className="w-full h-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* Main Glow Source behind numbers */}
                            <div className="absolute w-[80%] h-[80%] bg-primary opacity-10 blur-xl rounded-full animate-pulse-slow" />
                        </div>
                    </div>
                </div>
            )}

            {counterShape === 'steampunk-nixie' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    {/* Main Brass Container */}
                    <div className="w-[280px] h-[280px] rounded-full bg-[#2b1d0e] border-[8px] border-[#c5a059] shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,0.9)] flex items-center justify-center relative overflow-hidden">
                        {/* Brass Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,transparent_20%,#000_120%)] pointer-events-none" />

                        {/* Decorative Bolts */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                            <div
                                key={deg}
                                className="absolute w-3 h-3 rounded-full bg-[#8a6a36] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),1px_1px_2px_rgba(0,0,0,0.8)] border border-[#5c4018]"
                                style={{
                                    transform: `rotate(${deg}deg) translateY(-128px)`
                                }}
                            >
                                <div className="w-full h-[1px] bg-[#3e2b14] absolute top-1/2 -translate-y-1/2 rotate-45" />
                            </div>
                        ))}

                        {/* Animated Gears Layer 1 (Background) */}
                        <motion.div
                            className="absolute inset-[30px] opacity-40"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#8a6a36]">
                                <path d="M50 25 L55 25 L55 35 L62 38 L68 30 L72 33 L68 40 L74 45 L84 45 L84 50 L84 55 L74 55 L68 60 L72 67 L68 70 L62 62 L55 65 L55 75 L45 75 L45 65 L38 62 L32 70 L28 67 L32 60 L26 55 L16 55 L16 45 L26 45 L32 40 L28 33 L32 30 L38 38 L45 35 L45 25 Z" />
                            </svg>
                        </motion.div>

                        {/* Animated Clocks/Gears Layer 2 */}
                        <motion.div
                            className="absolute top-10 right-10 w-24 h-24 opacity-30"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#b8860b]">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" strokeDasharray="10 4" fill="none" />
                                <circle cx="50" cy="50" r="15" fill="currentColor" />
                                <rect x="45" y="10" width="10" height="40" fill="currentColor" />
                            </svg>
                        </motion.div>


                        {/* Inner Display Window (Glass Tube Look) */}
                        <div className="absolute w-[200px] h-[100px] bg-black/80 rounded-xl border-4 border-[#5c4018] shadow-[inset_0_0_20px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden z-10">
                            {/* Glass Reflection */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20" />

                            {/* Mesh Grid Background for Tubes */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#c5a059 1px, transparent 1px), linear-gradient(90deg, #c5a059 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

                            {/* Tube Highlights */}
                            <div className="absolute inset-0 flex justify-center items-center gap-1 z-0 opacity-30">
                                <div className="w-12 h-20 rounded-full bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent blur-sm" />
                                <div className="w-12 h-20 rounded-full bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent blur-sm" />
                                <div className="w-12 h-20 rounded-full bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent blur-sm" />
                            </div>
                        </div>

                        {/* Bottom Brass Plate */}
                        <div className="absolute bottom-[40px] w-32 h-6 bg-gradient-to-b from-[#8a6a36] to-[#3e2b14] rounded-sm shadow-md border border-[#c5a059]/50" />
                    </div>
                </div>
            )}



            {counterShape === 'solar-flare' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                            className="w-40 h-40 rounded-full bg-gradient-to-r from-orange-400 to-yellow-600 blur-sm shadow-[0_0_40px_rgba(251,146,60,0.8)]"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            {[...Array(6)].map((_, i) => (
                                <motion.path
                                    key={i}
                                    d="M 150 150 Q 180 100 220 150"
                                    fill="none"
                                    stroke="rgba(251,146,60,0.6)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    style={{ transformOrigin: '150px 150px', rotate: i * 60 }}
                                    animate={{
                                        d: [
                                            "M 150 150 Q 180 100 220 150",
                                            "M 150 150 Q 200 50 250 150",
                                            "M 150 150 Q 180 100 220 150"
                                        ],
                                        opacity: [0.3, 0.8, 0.3]
                                    }}
                                    transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            ))}
                        </svg>
                    </div>
                </div>
            )}



            {counterShape === 'nebula-cloud' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <motion.div
                        className="w-full h-full rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-2xl"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-24 h-24 bg-primary/10 rounded-full blur-xl"
                            animate={{
                                x: [0, Math.cos(i) * 100, 0],
                                y: [0, Math.sin(i) * 100, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}
                </div>
            )}

            {counterShape === 'infinite-knot' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                        <motion.path
                            d="M 50 20 C 70 20 80 50 50 80 C 20 50 30 20 50 20 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1, rotate: [0, 360] }}
                            transition={{
                                pathLength: { duration: 2 },
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                            }}
                        />
                        <motion.path
                            d="M 20 50 C 20 70 50 80 80 50 C 50 20 20 30 20 50 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/50"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1, rotate: [0, -360] }}
                            transition={{
                                pathLength: { duration: 2, delay: 0.5 },
                                rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                            }}
                        />
                    </svg>
                </div>
            )}

            {counterShape === 'holo-fan' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    {[0, 120, 240].map((deg) => (
                        <motion.div
                            key={deg}
                            className="absolute w-1 h-32 bg-gradient-to-t from-primary/80 to-transparent"
                            style={{ transformOrigin: 'bottom center', rotate: deg }}
                            animate={{ rotate: [deg, deg + 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    ))}
                    <div className="w-4 h-4 rounded-full bg-primary/50 blur-sm" />
                </div>
            )}







            {counterShape === 'nano-pulse' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                            className="absolute w-64 h-64 border-2 border-primary/50 rounded-full"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute w-56 h-56 border border-primary/30 rounded-full dashed-circle"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute w-48 h-48 bg-primary/10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                            <div className="w-40 h-40 bg-black/80 rounded-full flex items-center justify-center border border-primary/50">
                                <div className="text-primary text-4xl animate-pulse">⚡</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {counterShape === 'banana-slide' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <motion.div
                        className="w-64 h-64 bg-yellow-100 rounded-3xl border-4 border-yellow-400 shadow-xl flex items-center justify-center relative overflow-hidden"
                        whileTap={{ scale: 0.9, rotate: -5 }}
                    >
                        <div className="absolute top-2 right-2 text-2xl">🍌</div>
                        <div className="absolute bottom-2 left-2 text-2xl transform rotate-180">🍌</div>
                    </motion.div>
                </div>
            )}

            {counterShape === 'bro-counter' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-64 h-64 bg-slate-800 rounded-full border-8 border-slate-600 shadow-2xl flex items-center justify-center">
                        <div className="w-56 h-56 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-700 inset-shadow">
                            <div className="text-slate-400 text-6xl opacity-20">👊</div>
                        </div>
                    </div>
                </div>
            )}

            {counterShape === 'isometric-stack' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-40 h-40 bg-indigo-500 transform rotate-45 skew-x-12 border-4 border-indigo-300 shadow-2xl">
                        <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-400 border-4 border-indigo-200" />
                        <div className="absolute -top-8 -left-8 w-full h-full bg-indigo-600 border-4 border-indigo-400" />
                    </div>
                </div>
            )}

            {counterShape === 'animated-ripple' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-64 h-64 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 rounded-full border border-blue-400/50"
                                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {counterShape === 'halo-ring' && <HaloRing progress={progress} currentCount={currentCount} />}
            {counterShape === 'bead-ring' && <BeadRing currentCount={currentCount} />}
            {counterShape === 'zen-stones' && <ZenStones currentCount={currentCount} />}
            {counterShape === 'vertical-capsules' && <VerticalCapsules currentCount={currentCount} />}
            {counterShape === 'luminous-beads' && <LuminousBeads progress={progress} />}


            {/* Global Aura Pulse Effekt - triggers on count change */}
            <motion.div
                key={`aura-${currentCount}`}
                className="absolute inset-[-100px] rounded-full border border-primary/20 pointer-events-none -z-20"
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            <motion.button
                onClick={handleTap}
                disabled={disabled}
                className={`
        ${counterShape === 'minimal' ? 'absolute inset-4 rounded-full bg-counter-bg' : ''}
        ${counterShape === 'ring-light' ? 'w-64 h-64 rounded-full bg-transparent flex items-center justify-center' : ''}
        ${counterShape === 'classic' ? 'w-64 h-64 rounded-2xl bg-gradient-to-br from-card to-background shadow-inner flex flex-col items-center justify-center border-2 border-border/50' : ''}
        ${counterShape === 'beads' ? 'w-64 h-64 rounded-full bg-transparent flex items-center justify-center' : ''}
        ${counterShape === 'flower' ? 'w-64 h-64 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg' : ''}
        ${counterShape === 'waveform' ? 'w-72 h-72 rounded-full flex items-center justify-center backdrop-blur-sm' : ''}
        ${counterShape === 'digital' ? 'w-24 h-24 rounded-full bg-gradient-to-b from-[#f3d692] to-[#8b6508] border-[3px] border-[#5c4305] shadow-[0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] mt-24 mb-2' : ''}
        ${counterShape === 'modern-ring' ? 'w-64 h-64 rounded-full bg-background/80 backdrop-blur-xl border border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.2)]' : ''}
        ${counterShape === 'vintage-wood' ? 'w-60 h-60 rounded-3xl bg-[#5d4037] border-2 border-[#8d6e63] shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)] mt-2' : ''}
        ${counterShape === 'geometric-star' ? 'w-64 h-64 flex items-center justify-center bg-background/10 backdrop-blur-sm' : ''}
        ${counterShape === 'fluid' ? 'w-64 h-64 flex items-center justify-center backdrop-blur-sm' : ''}
        ${counterShape === 'real-beads' ? 'w-full h-full rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'glass-orb' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'portal-depth' ? 'w-64 h-64 rounded-full flex items-center justify-center text-primary-foreground' : ''}
        ${counterShape === 'luminous-ring' ? 'w-64 h-64 rounded-full flex items-center justify-center text-primary' : ''}
        ${counterShape === 'steampunk-nixie' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'biolum-organic' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'solar-flare' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'nebula-cloud' ? 'w-64 h-64 rounded-full flex items-center justify-center bg-transparent backdrop-blur-sm' : ''}
        ${counterShape === 'infinite-knot' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'holo-fan' ? 'w-64 h-64 rounded-full flex items-center justify-center bg-secondary/10' : ''}
        ${counterShape === 'halo-ring' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'zen-stones' ? 'w-full h-full flex items-center justify-center' : ''}
        ${counterShape === 'vertical-capsules' ? 'w-64 h-[300px] flex items-center justify-center' : ''}
        ${counterShape === 'luminous-beads' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        
        ${counterShape === 'nano-pulse' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'banana-slide' ? 'w-64 h-64 flex items-center justify-center' : ''}
        ${counterShape === 'bro-counter' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        ${counterShape === 'isometric-stack' ? 'w-64 h-64 flex items-center justify-center perspective-[1000px]' : ''}
        ${counterShape === 'animated-ripple' ? 'w-64 h-64 flex items-center justify-center' : ''}
        ${counterShape === 'bead-ring' ? 'w-64 h-64 flex items-center justify-center' : ''}

        flex items-center justify-center
        cursor-pointer
        select-none
        touch-manipulation
        transition-shadow duration-300
        disabled:opacity-50
        ${showCompletion && counterShape === 'minimal' ? 'animate-completion' : ''}
        ${!showCompletion && counterShape === 'minimal' ? 'counter-glow' : ''}
        ${counterShape === 'beads' ? 'hover:scale-105 active:scale-95' : ''}
        ${counterShape === 'vintage-wood' ? 'active:scale-[0.98] transition-transform' : ''}
        ${counterShape === 'banana-slide' ? 'active:rotate-12 transition-transform' : ''}
        ${counterShape === 'bro-counter' ? 'active:scale-95 transition-transform' : ''}
      `}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                aria-label="Increment counter"
            >
                {counterShape === 'minimal' && (
                    <div className="absolute inset-3 rounded-full border border-border/50" />
                )}

                {counterShape === 'beads' && (
                    // Visual beads ring - Static decoration only
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
                )}

                <motion.span
                    key={currentCount}
                    initial={{ scale: 1.5, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                    className={`
          counter-number text-counter-text
          ${counterShape === 'digital' ? 'hidden' : ''}
          ${counterShape === 'classic' ? 'font-mono text-5xl sm:text-6xl md:text-7xl tracking-widest bg-black/10 px-4 sm:px-6 py-2 rounded-lg inset-shadow mb-4' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'}
          ${counterShape === 'waveform' ? 'drop-shadow-md z-10' : ''}
          ${counterShape === 'modern-ring' ? 'font-sans font-light tracking-tighter drop-shadow-[0_0_15px_rgba(var(--primary),0.6)]' : ''}
          ${counterShape === 'vintage-wood' ? 'font-serif text-[#d7ccc8] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' : ''}
          ${counterShape === 'radar' ? 'font-mono text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]' : ''}
          ${counterShape === 'real-beads' ? 'font-serif text-[#5d4037] text-6xl font-bold drop-shadow-md bg-white/80 w-32 h-32 rounded-full flex items-center justify-center border-4 border-[#8d6e63]' : ''}
          ${counterShape === 'glass-orb' ? 'text-white/90 drop-shadow-lg font-light' : ''}
          ${counterShape === 'portal-depth' ? 'text-primary-foreground drop-shadow-[0_0_20px_hsl(var(--primary)/0.8)]' : ''}
          ${counterShape === 'luminous-ring' ? 'text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.8)] font-light' : ''}
          ${counterShape === 'ring-light' ? 'text-white/90 font-thin tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]' : ''}
          ${counterShape === 'steampunk-nixie' ? 'font-mono text-orange-500 font-bold tracking-widest drop-shadow-[0_0_10px_orange] text-6xl' : ''}
          ${counterShape === 'biolum-organic' ? 'font-mono text-primary font-bold tracking-widest drop-shadow-[0_0_15px_hsl(var(--primary))] text-6xl' : ''}
          ${counterShape === 'solar-flare' ? 'text-white drop-shadow-[0_0_20px_orange] font-bold' : ''}
          ${['nebula-cloud', 'infinite-knot', 'holo-fan', 'luminous-beads'].includes(counterShape) ? 'text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.6)] font-bold' : ''}
          ${counterShape === 'halo-ring' ? 'text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : ''}
          
          ${counterShape === 'nano-pulse' ? 'text-primary font-mono text-6xl font-bold tracking-widest drop-shadow-[0_0_15px_hsl(var(--primary))]' : ''}
          ${counterShape === 'banana-slide' ? 'text-yellow-600 font-sans text-7xl font-bold drop-shadow-md' : ''}
          ${counterShape === 'bro-counter' ? 'text-slate-200 font-black text-7xl uppercase tracking-tighter drop-shadow-2xl' : ''}
          ${counterShape === 'isometric-stack' ? 'text-white font-bold text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]' : ''}
          ${counterShape === 'animated-ripple' ? 'text-blue-200 font-light text-7xl tracking-widest drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]' : ''}
          ${counterShape === 'bead-ring' ? 'text-amber-500 font-mono text-7xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]' : ''}

          ${counterShape === 'vertical-capsules' ? 'hidden' : ''}
          ${counterShape === 'zen-stones' ? 'hidden' : ''}
        `}
                    style={{
                        fontSize: counterShape === 'digital' ? '0px' : `${(counterShape === 'classic' ? 4.5 : 4.5) * currentSettings.fontScale * countFontSize}rem`
                    }}
                >
                    {currentCount}
                </motion.span>
            </motion.button>
        </motion.div >
    );
}
