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
import { DigitalVisuals } from './counter-shapes/DigitalVisuals';
import { 
    ClassicVisuals, 
    CircularProgress, 
    FlowerVisuals, 
    WaveformVisuals, 
    RingLightVisuals, 
    ModernRingVisuals, 
    VintageWoodVisuals, 
    AnimatedRippleVisuals,
    BeadsDecorator,
    MinimalBorder,
    ClassicBody,
    BeadsButtonInterior
} from './counter-shapes/LegacyShapes';


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
                fontSize: counterShape === 'digital' ? '0px' : `${(counterShape === 'classic' ? 4.5 : 4.5) * (currentSettings?.fontScale ?? 1) * countFontSize}rem`,
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
                    {counterShape === 'classic' && <ClassicVisuals progress={progress} />}



                    {['minimal', 'beads', 'flower', 'waveform', 'modern-ring', 'ring-light'].includes(counterShape) && (
                        <CircularProgress progress={progress} />
                    )}
                </div>

                {counterShape === 'minimal' && <MinimalBorder />}

                {counterShape === 'ring-light' && <RingLightVisuals currentCount={currentCount} />}



                {counterShape === 'classic' && <ClassicBody />}



                {counterShape === 'beads' && <BeadsDecorator />}

                {counterShape === 'flower' && <FlowerVisuals currentCount={currentCount} />}

                {counterShape === 'waveform' && <WaveformVisuals progress={progress} />}



                {counterShape === 'digital' && <DigitalVisuals currentCount={currentCount} progress={progress} />}

                {counterShape === 'modern-ring' && <ModernRingVisuals />}

                {counterShape === 'vintage-wood' && <VintageWoodVisuals />}



















                {counterShape === 'animated-ripple' && <AnimatedRippleVisuals />}

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
                {counterShape === 'minimal' && <MinimalBorder />}

                {counterShape === 'beads' && <BeadsButtonInterior />}

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


