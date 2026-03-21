import { motion } from 'framer-motion';

interface LuminousBeadsProps {
    progress: number;
}

export function LuminousBeads({ progress }: LuminousBeadsProps) {
    const NUM_BEADS = 33;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center -z-10">
            <svg className="w-[256px] h-[256px] -rotate-90" viewBox="0 0 256 256">
                {/* Main connected "String" (faint glow) */}
                <circle cx="128" cy="128" r="110" stroke="currentColor" fill="none" strokeWidth="2" className="text-original-primary/10" />

                {/* Beads */}
                {Array.from({ length: NUM_BEADS }).map((_, i) => {
                    const angle = (i * 360) / NUM_BEADS;
                    const radius = 110;
                    const rawX = 128 + radius * Math.cos((angle * Math.PI) / 180);
                    const rawY = 128 + radius * Math.sin((angle * Math.PI) / 180);
                    const x = Number.isFinite(rawX) ? rawX : 128;
                    const y = Number.isFinite(rawY) ? rawY : 128;

                    // Calculate if this bead is active based on progress
                    // Assuming progress 0-1 maps to 0-33 beads
                    const safeProgress = isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
                    const isActive = i < Math.floor(safeProgress * NUM_BEADS);
                    const isCurrent = i === Math.floor(safeProgress * NUM_BEADS) - 1;

                    return (
                        <g key={i}>
                            <motion.circle
                                cx={x}
                                cy={y}
                                r={isActive ? 8 : 4}
                                fill={isActive ? "hsl(var(--original-primary))" : "currentColor"}
                                className={isActive ? "text-original-primary drop-shadow-[0_0_8px_hsl(var(--original-primary)/0.8)]" : "text-original-muted/20"}
                                animate={{
                                    scale: isCurrent ? [1, 1.4, 1] : 1,
                                    opacity: isActive ? 1 : 0.3
                                }}
                                transition={{
                                    scale: { duration: 0.3, type: "spring" }
                                }}
                            />
                            {/* Extra glow for current bead */}
                            {isCurrent && (
                                <motion.circle
                                    cx={x}
                                    cy={y}
                                    r={12}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-original-primary/50"
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
