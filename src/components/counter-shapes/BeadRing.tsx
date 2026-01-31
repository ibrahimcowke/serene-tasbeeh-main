import { motion } from 'framer-motion';

interface BeadRingProps {
    currentCount: number;
}

export function BeadRing({ currentCount }: BeadRingProps) {
    const totalBeads = 33;
    const radius = 120; // Radius of the ring
    const beadSize = 16;

    // Calculate the angle for each bead
    // We rotate the whole ring based on current count so the "active" bead is always at top (or a specific position)
    // -90 degrees puts 0 at the top.
    const rotationPerCount = 360 / totalBeads;
    const ringRotation = -rotationPerCount * currentCount; // Rotate counter-clockwise to move next bead into place

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <motion.div
                className="relative w-[300px] h-[300px] flex items-center justify-center"
                animate={{ rotate: ringRotation }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
            >
                {/* String path */}
                <div className="absolute inset-0 m-auto rounded-full border-2 border-stone-300 w-[240px] h-[240px]" />

                {Array.from({ length: totalBeads }).map((_, i) => {
                    const angle = (i * 360) / totalBeads; // Start at 0 (right), go clockwise
                    // Adjust angle to position correctly on the circle
                    // We want index 0 to be at -90deg (top) initially if rotation is 0.
                    // But actually, we are rotating the CONTAINER.
                    // So we just place them relative to the container 0.

                    // Convert degrees to radians
                    const radian = (angle - 90) * (Math.PI / 180);
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    const isCurrent = (currentCount % totalBeads) === i;

                    return (
                        <motion.div
                            key={i}
                            className={`absolute rounded-full shadow-sm ${isCurrent
                                    ? 'bg-amber-500 border-amber-200 z-10'
                                    : 'bg-stone-600 border-stone-500'
                                }`}
                            style={{
                                width: beadSize,
                                height: beadSize,
                                x: x,
                                y: y,
                                border: '2px solid',
                            }}
                        // Keep beads upright if they had content, but here they are circles so doesn't matter much.
                        // But we might want to scale the active one.
                        >
                            {isCurrent && (
                                <motion.div
                                    className="absolute inset-0 bg-amber-400 rounded-full blur-sm"
                                    layoutId="glow"
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Stationary Indicator at the Top (active position) */}
            <div className="absolute top-[8%] w-6 h-6 border-b-[12px] border-b-primary/50 border-x-[8px] border-x-transparent rotate-180 drop-shadow-md z-20" />

        </div>
    );
}
