import { motion } from 'framer-motion';

interface SmartRingProps {
    currentCount: number;
}

export function SmartRing({ currentCount }: SmartRingProps) {
    const totalTicks = 33;
    const radius = 130;
    const centerX = 150;
    const centerY = 150;
    const strokeWidth = 3;
    const activeStrokeWidth = 5;

    // Calculate progress for the main arc
    const progress = (currentCount % 33) / 33;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-black rounded-full overflow-hidden">
            {/* OLED Black Background with subtle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black_70%)]" />

            {/* Main Graphics Container */}
            <svg viewBox="0 0 300 300" className="w-full h-full relative z-10">
                {/* Background Track Ring */}
                <circle
                    cx={centerX} cy={centerY} r={radius}
                    fill="none" stroke="#333" strokeWidth={strokeWidth}
                    opacity="0.3"
                />

                {/* Progress Arc (Smooth) */}
                <motion.circle
                    cx={centerX} cy={centerY} r={radius}
                    fill="none"
                    stroke="url(#smartGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    transform={`rotate(-90 ${centerX} ${centerY})`}
                />

                {/* Precision Ticks */}
                {Array.from({ length: totalTicks }).map((_, i) => {
                    const angle = (i * 360) / totalTicks - 90;
                    const isActive = i <= (currentCount % 33) && i > 0;
                    const isCurrent = i === (currentCount % 33);

                    // Tick geometry
                    const tickInnerR = radius - 15;
                    const tickOuterR = radius - 5;
                    const x1 = centerX + tickInnerR * Math.cos((angle * Math.PI) / 180);
                    const y1 = centerY + tickInnerR * Math.sin((angle * Math.PI) / 180);
                    const x2 = centerX + tickOuterR * Math.cos((angle * Math.PI) / 180);
                    const y2 = centerY + tickOuterR * Math.sin((angle * Math.PI) / 180);

                    return (
                        <motion.line
                            key={i}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={isActive || isCurrent ? "#7dd3fc" : "#404040"}
                            strokeWidth={isCurrent ? 3 : (isActive ? 2 : 1.5)}
                            strokeLinecap="round"
                            animate={{
                                stroke: isActive || isCurrent ? "#38bdf8" : "#404040",
                                strokeWidth: isCurrent ? 3 : (isActive ? 2 : 1.5)
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    );
                })}

                {/* Active Indicator Dot (Follows tip) */}
                <motion.circle
                    r="4"
                    fill="white"
                    filter="url(#glow)"
                    animate={{
                        cx: centerX + radius * Math.cos(((currentCount % 33) * 360 / 33 - 90) * Math.PI / 180),
                        cy: centerY + radius * Math.sin(((currentCount % 33) * 360 / 33 - 90) * Math.PI / 180)
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                <defs>
                    <linearGradient id="smartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" /> {/* Sky 500 */}
                        <stop offset="100%" stopColor="#6366f1" /> {/* Indigo 500 */}
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>


        </div>
    );
}
