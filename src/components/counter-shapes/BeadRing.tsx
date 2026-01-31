import { motion, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface BeadRingProps {
    currentCount: number;
}

export function BeadRing({ currentCount }: BeadRingProps) {
    const totalBeads = 33;
    const radius = 130;
    const beadSize = 22; // Larger, more tactile beads

    // Physics for rotation
    const rotation = useMotionValue(0);
    const targetRotation = useRef(0);

    // Smooth, heavy spring physics for a premium feel
    const smoothRotation = useSpring(rotation, {
        stiffness: 40,
        damping: 15,
        mass: 1.5 // Adds "weight"
    });

    // Calculate rotation velocity for dynamic effects (swaying tassel)
    const rotationVelocity = useVelocity(smoothRotation);
    const tasselSway = useTransform(rotationVelocity, [-500, 500], [25, -25]);
    const stringTension = useTransform(rotationVelocity, [-1000, 1000], [0.95, 0.95]); // String tightens on fast spins

    useEffect(() => {
        // Calculate target rotation: move 1 bead per count
        // -90 deg offset to start at top
        const anglePerBead = 360 / totalBeads;
        targetRotation.current = -currentCount * anglePerBead;
        rotation.set(targetRotation.current);
    }, [currentCount, rotation]);

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 perspective-[1000px]">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full" />

            <motion.div
                className="relative w-[340px] h-[340px] flex items-center justify-center preserve-3d"
                style={{
                    rotateZ: smoothRotation,
                    rotateX: 10, // Slight 3D tilt
                    scale: stringTension
                }}
            >
                {/* The String */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
                    <circle
                        cx="170" cy="170" r={radius}
                        fill="none"
                        stroke="#78350f"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        className="opacity-60"
                    />
                    {/* Inner highlight string */}
                    <circle
                        cx="170" cy="170" r={radius}
                        fill="none"
                        stroke="#b45309"
                        strokeWidth="1"
                        className="opacity-40"
                    />
                </svg>

                {/* Tassel Decorations (Attached to the "end" of the loop visually, or just hanging) */}
                {/* Since it's a ring, maybe a decorative tassel that spins with it? 
                    Let's attach a tassel to the "start" (bead 0) or just have it hang from the bottom of the device context?
                    Actually, for a ring, a tassel usually marks the end/start. Let's attach it between bead 0 and 32.
                */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-8 h-24 origin-top flex flex-col items-center"
                    style={{
                        x: 120, // Push out to radius approx
                        y: 0,
                        rotate: -90, // Point outward
                        rotateZ: tasselSway // Reacts to physics
                    }}
                >
                    {/* This would rotate WITH the ring, which might look dizzying if it's large. 
                         Let's keep the tassel subtle or remove it if it clashes with the "Bead Ring" concept which is often handheld.
                         Better idea: The "Tassel" is the counter indicator at the TOP, swaying slightly.
                     */}
                </motion.div>


                {/* The Beads */}
                {Array.from({ length: totalBeads }).map((_, i) => {
                    const angle = (i * 360) / totalBeads;
                    const radian = (angle - 90) * (Math.PI / 180);
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    // Determine if this is the "active" bead (closest to top)
                    // Since the ring rotates, the visual top is stationary at -90deg.
                    // But we index them 0..32.
                    // We need to calculate which bead is currently at the top based on currentCount.
                    const normalizedCount = currentCount % totalBeads;
                    const isActive = normalizedCount === i;

                    // Previous bead styling
                    const isPassed = i < normalizedCount;

                    return (
                        <motion.div
                            key={i}
                            className="absolute flex items-center justify-center"
                            style={{
                                x: x,
                                y: y,
                                width: beadSize,
                                height: beadSize,
                            }}
                        >
                            <motion.div
                                className={`
                                    w-full h-full rounded-full shadow-lg
                                    ${isActive ? 'z-20' : 'z-10'}
                                `}
                                style={{
                                    background: isActive
                                        ? 'radial-gradient(circle at 30% 30%, #fcd34d, #b45309)'
                                        : 'radial-gradient(circle at 30% 30%, #d6d3d1, #78716c)', // Stone/wood look for inactive
                                    boxShadow: isActive
                                        ? '0 0 15px 2px rgba(245, 158, 11, 0.6), inset 2px 2px 5px rgba(255,255,255,0.4)'
                                        : 'inset 2px 2px 5px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                                    scale: isActive ? 1.4 : 1
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Bead Texture/Detail */}
                                <div className="absolute inset-0 rounded-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

                                {/* Specular Highlight */}
                                <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Static Indicator / Finger Position at Top */}
            <div className="absolute top-2 z-30 pointer-events-none">
                {/* A subtle guide mark where the bead snaps */}
                <div className="w-1 h-4 bg-amber-500/50 rounded-full blur-sm" />
            </div>

            {/* Dynamic central aura */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.9, 1.1, 0.9]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-40 h-40 rounded-full border border-amber-500/10" />
                <div className="w-32 h-32 rounded-full border border-amber-500/5" />
            </motion.div>
        </div>
    );
}
