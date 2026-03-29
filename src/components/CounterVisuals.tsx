import { memo } from 'react';
import { motion } from 'framer-motion';
import { ThemeSettings, CounterShape } from '@/store/tasbeehStore';
import { HaloRing } from './counter-shapes/HaloRing';
import { BeadRing } from './counter-shapes/BeadRing';
import { counterShapes } from '@/lib/constants';

import { VerticalCapsules } from './counter-shapes/VerticalCapsules';
import { LuminousBeads } from './counter-shapes/LuminousBeads';
import { HelixStrand } from './counter-shapes/HelixStrand';
import { CyberHexagon } from './counter-shapes/CyberHexagon';
import { GlassPill } from './counter-shapes/GlassPill';
import { SmartRing } from './counter-shapes/SmartRing';
import { MoonPhase } from './counter-shapes/MoonPhase';
import { WaterRipple } from './counter-shapes/WaterRipple';
import { SandHourglass } from './counter-shapes/SandHourglass';
import { LanternFanous } from './counter-shapes/LanternFanous';
import { DigitalWatch } from './counter-shapes/DigitalWatch';
import { StarBurst } from './counter-shapes/StarBurst';
import { CrystalPrism } from './counter-shapes/CrystalPrism';
import { TallyClicker } from './counter-shapes/TallyClicker';
import { Cyber3D } from './counter-shapes/Cyber3D';
import { CrystalISO } from './counter-shapes/CrystalISO';
import { Neumorph } from './counter-shapes/Neumorph';
import { SunsetHorizon } from './counter-shapes/SunsetHorizon';
import { RetroLCD } from './counter-shapes/RetroLCD';


interface CounterVisualsProps {
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
    hideNumber?: boolean;
}

export const CounterNumber = memo(({
    currentCount,
    counterShape,
    currentSettings,
    countFontSize
}: {
    currentCount: number;
    counterShape: string;
    currentSettings: ThemeSettings;
    countFontSize: number;
}) => {
    const shapeData = counterShapes.find(s => s.id === counterShape);
    const shapeColor = shapeData?.color || 'currentColor';

    return (
        <motion.span
            key={currentCount}
            initial={{ scale: 1.5, opacity: 0.5 }}
            animate={{
                scale: 1,
                opacity: 1,
                x: 0
            }}
            transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className={`
  counter-number text-counter-text
  ${['digital', 'vertical-capsules', 'tally-clicker', 'cyber-3d', 'crystal-iso', 'neumorph', 'digital-watch', 'retro-lcd'].includes(counterShape) ? 'hidden' : ''}
  ${counterShape === 'classic' ? 'font-mono text-5xl sm:text-6xl md:text-7xl tracking-widest bg-black/10 px-4 sm:px-6 py-2 rounded-lg inset-shadow mb-4' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'}
  ${counterShape === 'waveform' ? 'drop-shadow-md z-10' : ''}
  ${counterShape === 'modern-ring' ? 'font-sans font-light tracking-tighter drop-shadow-[0_0_15px_currentColor]' : ''}
  ${counterShape === 'vintage-wood' ? 'font-serif text-[#d7ccc8] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' : ''}
  ${counterShape === 'luminous-ring' ? 'text-current drop-shadow-[0_0_15px_currentColor] font-light' : ''}
  ${counterShape === 'ring-light' ? 'text-white/90 font-thin tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]' : ''}
  ${counterShape === 'halo-ring' ? 'text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : ''}
  
  ${counterShape === 'animated-ripple' ? 'text-blue-200 font-light text-7xl tracking-widest drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]' : ''}
  ${counterShape === 'bead-ring' ? 'text-amber-500 font-mono text-7xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]' : ''}
  ${counterShape === 'helix-strand' ? 'text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}
  ${counterShape === 'cyber-hexagon' ? 'font-mono text-current font-bold tracking-widest drop-shadow-[0_0_10px_currentColor]' : ''}
  ${counterShape === 'glass-pill' ? 'font-sans font-medium text-white tracking-widest text-6xl drop-shadow-md' : ''}
  ${counterShape === 'emerald-loop' ? 'font-serif text-emerald-100 font-bold tracking-widest text-5xl drop-shadow-md' : ''}
  ${counterShape === 'smart-ring' ? 'font-sans font-light text-white tracking-tighter text-6xl drop-shadow-none' : ''}
  ${['moon-phase'].includes(counterShape) ? 'font-sans font-light text-white text-5xl drop-shadow-lg' : ''}
`}
            style={{
                fontSize: counterShape === 'digital' ? '0px' : `${(counterShape === 'classic' ? 4.5 : 4.5) * currentSettings.fontScale * countFontSize}rem`,
                color: shapeColor
            }}
        >
            {currentCount}
        </motion.span>
    );
});

export const CounterVisuals = memo(({
    counterShape,
    counterVerticalOffset,
    counterScale,
    progress,
    currentCount,
    currentSettings,
    countFontSize,
    handleTap,
    showCompletion,
    disabled,
    hideNumber
}: CounterVisualsProps) => {
    const shapeData = counterShapes.find(s => s.id === counterShape);
    const shapeColor = shapeData?.color || 'hsl(var(--original-primary))';

    return (
        <motion.div
            className="relative flex items-center justify-center w-[min(80vw,50vh)] h-[min(80vw,50vh)] sm:w-[300px] sm:h-[300px] max-w-[320px] max-h-[320px]"
            style={{
                transform: `translateY(${counterVerticalOffset}px) scale(${counterScale})`,
                color: shapeColor
            }}
        >
            {/* Unified Visual Layers Wrapper - Prevents flex-shift by isolating all absolute elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden sm:overflow-visible">
                {/* Encircled BrogressBar - Wraps the counter button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    {counterShape === 'classic' && (
                        <svg width="100%" height="100%" viewBox="0 0 256 256" className="-rotate-90">
                            <rect
                                x="10" y="10" width="236" height="236" rx="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-original-muted/30"
                            />
                            <motion.rect
                                x="10" y="10" width="236" height="236" rx="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-current drop-shadow-[0_0_10px_currentColor]"
                                pathLength="1"
                                strokeDasharray="1"
                                initial={{ strokeDashoffset: 1 }}
                                animate={{ strokeDashoffset: 1 - progress }}
                                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                            />
                        </svg>
                    )}



                    {['minimal', 'beads', 'flower', 'waveform', 'modern-ring', 'ring-light'].includes(counterShape) && (
                        <svg width="100%" height="100%" viewBox="0 0 256 256" className="-rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="123"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-original-muted/30"
                            />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="123"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-current drop-shadow-[0_0_10px_currentColor]"
                                strokeDasharray="772"
                                initial={{ strokeDashoffset: 772 }}
                                animate={{ strokeDashoffset: 772 - (772 * progress) }}
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
                    <div className="absolute inset-0 flex items-center justify-center -z-10 scale-[0.85]">
                        <div className="w-[256px] h-[256px] relative flex items-center justify-center">
                            {/* Main Light Ring */}
                            <motion.div
                                className="absolute inset-[8px] rounded-full border-[18px] border-white bg-white/20 shadow-[0_0_50px_rgba(255,255,255,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]"
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

                            {/* Center hole */}
                            <div className="absolute inset-[26px] rounded-full bg-black/90 shadow-[inset_0_0_20px_rgba(0,0,0,1),0_0_20px_rgba(255,255,255,0.5)] border-4 border-gray-800" />
                        </div>
                    </div>
                )}



                {counterShape === 'classic' && (
                    <div className="absolute inset-x-0 -top-4 bottom-0 bg-original-secondary/30 rounded-3xl border-4 border-original-muted flex items-center justify-center -z-10 flex-col">
                        {/* Decorative screws */}
                        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-original-muted/30" />
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-original-muted/30" />
                        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-original-muted/30" />
                        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-original-muted/30" />
                    </div>
                )}



                {counterShape === 'beads' && (
                    <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                        <svg className="w-[300px] h-[300px] -rotate-90">
                            {/* Track Dots - subtle guide only */}
                            <circle cx="150" cy="150" r="140" stroke="currentColor" fill="none" strokeWidth="2" className="text-original-muted/10" strokeDasharray="1 30" />
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
                                    className="absolute top-1/2 left-1/2 w-24 h-24 bg-current rounded-full origin-bottom-right"
                                    style={{ transform: `rotate(${i * 45}deg) translate(-50%, -100%)` }}
                                />
                            ))}
                        </motion.div>
                    </div>
                )}

                {counterShape === 'waveform' && (
                    <div className="absolute inset-0 rounded-full overflow-hidden -z-10 border-4 border-original-muted/50">
                        <div className="absolute inset-0 bg-original-secondary/30" />
                        {/* Distinct Background Level */}
                        <div className="absolute bottom-0 left-0 right-0 h-full bg-original-muted/20" />

                        <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-current/40 text-current"
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(progress * 100, 5)}%` }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        >
                            {/* Glowing Top Edge */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-current shadow-[0_0_15px_currentColor]" />
                            <div className="absolute top-0 left-0 right-0 h-6 bg-current/40 blur-md transform -translate-y-1/2" />
                        </motion.div>
                        {/* Crisp outline */}
                        <div className="absolute inset-0 rounded-full border-2 border-current/30 pointer-events-none" />
                    </div>
                )}



                {counterShape === 'digital' && (
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
                )}

                {
                    counterShape === 'modern-ring' && (
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[280px] h-[280px] rounded-full border border-current/10 border-t-current/50 border-r-transparent"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[250px] h-[250px] rounded-full border border-original-secondary/20 border-b-original-secondary/50 border-l-transparent dashed-circle"
                            />
                        </div>
                    )
                }

                {
                    counterShape === 'vintage-wood' && (
                        <div className="absolute inset-0 flex items-center justify-center -z-10 w-full h-full">
                            <div className="w-[260px] h-[300px] bg-[#3e2723] rounded-[40px] border-[6px] border-[#5d4037] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.1)] flex flex-col items-center relative overflow-hidden scale-75 sm:scale-90">
                                {/* Decorative background pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

                                {/* Top Screw */}
                                <div className="absolute top-4 w-4 h-4 rounded-full bg-[#8d6e63] shadow-inner flex items-center justify-center">
                                    <div className="w-1 h-0.5 bg-[#5d4037] rotate-45" />
                                </div>
                                {/* Bottom Decoration */}
                                <div className="absolute bottom-4 w-16 h-1 bg-[#5d4037] rounded-full opacity-50" />
                            </div>
                        </div>
                    )
                }



















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

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 scale-90">
                        {counterShape === 'halo-ring' && <HaloRing progress={progress} currentCount={currentCount} />}
                        {counterShape === 'bead-ring' && <BeadRing currentCount={currentCount} />}
                        {counterShape === 'helix-strand' && <HelixStrand currentCount={currentCount} />}
                        {counterShape === 'cyber-hexagon' && <CyberHexagon currentCount={currentCount} />}
                        {counterShape === 'glass-pill' && <GlassPill currentCount={currentCount} />}
                        {counterShape === 'smart-ring' && <SmartRing currentCount={currentCount} />}
                        {counterShape === 'moon-phase' && <MoonPhase currentCount={currentCount} />}
                        {counterShape === 'water-ripple' && <WaterRipple currentCount={currentCount} />}
                        {counterShape === 'sand-hourglass' && <SandHourglass currentCount={currentCount} />}
                        {counterShape === 'lantern-fanous' && <LanternFanous currentCount={currentCount} />}
                        {counterShape === 'digital-watch' && <DigitalWatch currentCount={currentCount} />}
                        {counterShape === 'star-burst' && <StarBurst currentCount={currentCount} />}
                        {counterShape === 'crystal-prism' && <CrystalPrism currentCount={currentCount} />}
                        {counterShape === 'tally-clicker' && <TallyClicker currentCount={currentCount} />}
                        {counterShape === 'cyber-3d' && <Cyber3D currentCount={currentCount} />}
                        {counterShape === 'crystal-iso' && <CrystalISO currentCount={currentCount} />}
                        {counterShape === 'neumorph' && <Neumorph currentCount={currentCount} />}
                        {counterShape === 'vertical-capsules' && <VerticalCapsules currentCount={currentCount} />}
                        {counterShape === 'luminous-beads' && <LuminousBeads progress={progress} />}
                </div>


                {/* Global Aura Pulse Effekt - triggers on count change */}
                <motion.div
                    key={`aura-${currentCount}`}
                    className="absolute inset-0 rounded-full border border-white/20 pointer-events-none -z-20 scale-150"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>

            <motion.button
                onClick={handleTap}
                disabled={disabled}
                className={`
        ${counterShape === 'plain' ? 'w-64 h-64 bg-transparent' : ''}
        ${counterShape === 'minimal' ? 'rounded-full bg-counter-bg w-64 h-64' : ''}
        ${counterShape === 'ring-light' ? 'w-64 h-64 rounded-full bg-transparent flex items-center justify-center' : ''}
        ${counterShape === 'classic' ? 'w-64 h-64 rounded-2xl bg-gradient-to-br from-card to-background shadow-inner flex flex-col items-center justify-center border-2 border-border/50' : ''}
        ${counterShape === 'beads' ? 'w-64 h-64 rounded-full bg-transparent flex items-center justify-center' : ''}
        ${counterShape === 'flower' ? 'w-64 h-64 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg' : ''}
        ${counterShape === 'waveform' ? 'w-64 h-64 rounded-full flex items-center justify-center backdrop-blur-sm' : ''}
        ${counterShape === 'digital' ? 'w-64 h-64 flex items-center justify-center bg-transparent z-10' : ''}
        ${counterShape === 'modern-ring' ? 'w-64 h-64 rounded-full bg-background/80 backdrop-blur-xl border border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.2)]' : ''}
        ${counterShape === 'vintage-wood' ? 'w-64 h-64 bg-transparent shadow-none border-0 flex items-center justify-center' : ''}
        ${counterShape === 'halo-ring' ? 'w-64 h-64 rounded-full flex items-center justify-center bg-transparent z-10' : ''}

        ${counterShape === 'vertical-capsules' ? 'w-64 h-64 flex items-center justify-center bg-transparent z-10' : ''}
        ${counterShape === 'luminous-beads' ? 'w-64 h-64 rounded-full flex items-center justify-center bg-transparent z-10' : ''}
        

        ${counterShape === 'animated-ripple' ? 'w-64 h-64 flex items-center justify-center bg-transparent z-10' : ''}
        ${counterShape === 'bead-ring' ? 'w-64 h-64 flex items-center justify-center bg-transparent z-10' : ''}
        ${['helix-strand', 'cyber-hexagon', 'glass-pill', 'emerald-loop', 'smart-ring', 'moon-phase', 'water-ripple', 'sand-hourglass', 'lantern-fanous', 'star-burst', 'crystal-prism', 'tally-clicker', 'cyber-3d', 'crystal-iso', 'neumorph'].includes(counterShape) ? 'w-64 h-64 flex items-center justify-center bg-transparent z-10' : ''}

        flex items-center justify-center
        cursor-pointer
        select-none
        touch-manipulation
        transition-shadow duration-300
        disabled:opacity-50
        ${showCompletion && (counterShape === 'minimal' || counterShape === 'plain') ? 'animate-completion' : ''}
        ${!showCompletion && (counterShape === 'minimal' || counterShape === 'plain') ? 'counter-glow' : ''}
        ${counterShape === 'beads' ? 'hover:scale-105 active:scale-95' : ''}
        ${counterShape === 'vintage-wood' ? 'active:scale-[0.98] transition-transform' : ''}
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

                {!hideNumber && (
                    <CounterNumber
                        currentCount={currentCount}
                        counterShape={counterShape}
                        currentSettings={currentSettings}
                        countFontSize={countFontSize}
                    />
                )}
            </motion.button>
        </motion.div >
    );
});


