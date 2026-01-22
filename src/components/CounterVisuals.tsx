import { motion } from 'framer-motion';
import { ThemeSettings } from '@/store/tasbeehStore';

interface CounterVisualsProps {
    layout: 'default' | 'focus' | 'ergonomic';
    counterShape: 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'hexagon' | 'orb';
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

                {counterShape === 'hexagon' && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                        <path
                            d="M50 2 L95 28 V72 L50 98 L5 72 V28 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-muted/30"
                        />
                        <motion.path
                            d="M50 2 L95 28 V72 L50 98 L5 72 V28 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            pathLength="1"
                            strokeDasharray="1"
                            initial={{ strokeDashoffset: 1 }}
                            animate={{ strokeDashoffset: 1 - progress }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        />
                    </svg>
                )}

                {['minimal', 'beads', 'flower', 'waveform', 'orb'].includes(counterShape) && (
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

            {counterShape === 'hexagon' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    {/* Distinct Inner Hexagon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-48 h-48 bg-card/50 border-2 border-primary/20 clip-path-hexagon"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                        >
                            <motion.div
                                className="w-full h-full bg-primary/10"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {counterShape === 'orb' && (
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-[260px] h-[260px] rounded-full bg-secondary/60 relative overflow-hidden shadow-2xl border-2 border-white/10">
                        {/* Liquid Fill - Explicit height calculation */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-primary shadow-[0_0_30px_inset_rgba(0,0,0,0.3)]"
                            initial={{ height: '0%' }}
                            animate={{ height: `${progress * 100}%` }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        >
                            {/* Surface tension line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/50 shadow-[0_0_10px_white]" />
                        </motion.div>

                        {/* Glass Glare */}
                        <div className="absolute top-6 left-10 right-10 h-32 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-xl pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Counter button */}
            <motion.button
                onClick={handleTap}
                disabled={disabled}
                className={`
        ${counterShape === 'minimal' ? 'absolute inset-4 rounded-full bg-counter-bg' : ''}
        ${counterShape === 'classic' ? 'w-64 h-64 rounded-2xl bg-gradient-to-br from-card to-background shadow-inner flex flex-col items-center justify-center border-2 border-border/50' : ''}
        ${counterShape === 'beads' ? 'w-64 h-64 rounded-full bg-transparent flex items-center justify-center' : ''}
        ${counterShape === 'flower' ? 'w-64 h-64 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg' : ''}
        ${counterShape === 'waveform' ? 'w-72 h-72 rounded-full flex items-center justify-center backdrop-blur-sm' : ''}
        ${counterShape === 'hexagon' ? 'w-64 h-64 flex items-center justify-center bg-card/10 backdrop-blur-sm' : ''}
        ${counterShape === 'orb' ? 'w-64 h-64 rounded-full flex items-center justify-center' : ''}
        
        flex items-center justify-center
        cursor-pointer
        select-none
        touch-manipulation
        transition-shadow duration-300
        disabled:opacity-50
        ${showCompletion && counterShape === 'minimal' ? 'animate-completion' : ''}
        ${!showCompletion && counterShape === 'minimal' ? 'counter-glow' : ''}
        ${counterShape === 'beads' ? 'hover:scale-105 active:scale-95' : ''}
        ${counterShape === 'orb' ? 'shadow-2xl shadow-primary/20' : ''}
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
          ${counterShape === 'classic' ? 'font-mono text-5xl sm:text-6xl md:text-7xl tracking-widest bg-black/10 px-4 sm:px-6 py-2 rounded-lg inset-shadow mb-4' : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'}
          ${counterShape === 'waveform' ? 'drop-shadow-md z-10' : ''}
          ${counterShape === 'orb' ? 'text-white mix-blend-overlay' : ''}
        `}
                    style={{
                        fontSize: `${(counterShape === 'classic' ? 4.5 : 4.5) * currentSettings.fontScale * countFontSize}rem`
                    }}
                >
                    {currentCount}
                </motion.span>
            </motion.button>
        </motion.div>
    );
}
