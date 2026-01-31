import { motion } from 'framer-motion';

interface SandHourglassProps {
    currentCount: number;
}

export function SandHourglass({ currentCount }: SandHourglassProps) {
    const progress = (currentCount % 33) / 33;
    // progress fills the bottom chamber

    return (
        <div className="relative w-40 h-64 flex flex-col items-center justify-center">
            {/* Glass Container Shape - SVG */}
            <svg viewBox="0 0 100 160" className="w-full h-full drop-shadow-xl">
                <defs>
                    <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                    </linearGradient>
                    <mask id="bottomChamberMask">
                        <path d="M10,80 Q50,90 90,80 L90,150 Q50,160 10,150 Z" fill="white" />
                        {/* Simplified bottom chamber area shape for masking the sand height */}
                    </mask>
                </defs>

                {/* Hourglass Frame/Glass */}
                <path
                    d="M10,10 L90,10 L90,20 Q50,20 50,80 Q50,140 90,140 L90,150 L10,150 L10,140 Q50,140 50,80 Q50,20 10,20 Z"
                    fill="url(#glassGradient)"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1"
                />

                {/* Top Sand (Drains out) */}
                <motion.path
                    d="M15,20 L85,20 L50,80 Z"
                    fill="#eab308"
                    opacity="0.8"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 1 - progress }}
                    style={{ originX: "50%", originY: "100%" }}
                />

                {/* Falling Stream */}
                <motion.line
                    x1="50" y1="80" x2="50" y2="150"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    animate={{ strokeDashoffset: [0, -10] }}
                    transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                    opacity={progress < 1 ? 1 : 0}
                />

                {/* Bottom Sand (Fills up) */}
                {/* Simple rect fill masked by the glass shape would be cleaner */}
                <mask id="bottomSandMask">
                    <rect x="0" y="80" width="100" height="80" fill="white" />
                </mask>

                <motion.rect
                    x="10"
                    y={150 - (70 * progress)} // Rise up
                    width="80"
                    height={70 * progress}
                    fill="#eab308"
                    opacity="0.9"
                    mask="url(#bottomChamberMask)" // Needs a proper path mask in real SVG
                />

                {/* Simplified Bottom Sand visual for this component */}
                <path
                    d={`M10,150 L90,150 L50,${150 - (60 * progress)} Z`} // Triangle piling up approach simpler
                    fill="#eab308"
                    opacity="0.9"
                />

            </svg>
        </div>
    );
}
