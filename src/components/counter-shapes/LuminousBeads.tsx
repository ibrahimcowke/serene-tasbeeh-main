import { motion } from 'framer-motion';

interface LuminousBeadsProps {
    progress: number;
}

export function LuminousBeads({ progress }: LuminousBeadsProps) {
    const NUM_BEADS = 33;

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <svg className="w-[300px] h-[300px] -rotate-90">
                {/* Main connected "String" (faint glow) */}
                <circle cx="150" cy="150" r="140" stroke="currentColor" fill="none" strokeWidth="2" className="text-primary/10" />

                {/* Beads */}
                {Array.from({ length: NUM_BEADS }).map((_, i) => {
                    const angle = (i * 360) / NUM_BEADS;
                    const radius = 140;
                    const x = 150 + radius * Math.cos((angle * Math.PI) / 180);
                    const y = 150 + radius * Math.sin((angle * Math.PI) / 180);

                    // Calculate if this bead is active based on progress
                    // Assuming progress 0-1 maps to 0-33 beads
                    const isActive = i < Math.floor(progress * NUM_BEADS);
                    const isCurrent = i === Math.floor(progress * NUM_BEADS) - 1;

                    return (
                        <g key={i}>
                            <motion.circle
                                cx={x}
                                cy={y}
                                r={isActive ? 8 : 4}
                                fill={isActive ? "var(--primary)" : "currentColor"}
                                className={isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "text-muted/20"}
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
                                    className="text-primary/50"
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
