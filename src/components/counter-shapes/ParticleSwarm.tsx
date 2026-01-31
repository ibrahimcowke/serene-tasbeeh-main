import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ParticleSwarmProps {
    currentCount: number;
}

export function ParticleSwarm({ currentCount }: ParticleSwarmProps) {
    // Generate particles that orbit
    const [particles, setParticles] = useState<{ id: number, r: number, delay: number, speed: number }[]>([]);

    useEffect(() => {
        setParticles(Array.from({ length: 33 }).map((_, i) => ({
            id: i,
            r: 100 + Math.random() * 20,
            delay: Math.random() * 2,
            speed: 5 + Math.random() * 10
        })));
    }, []);

    const activeIndex = currentCount % 33;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {particles.map((p, i) => {
                const isActive = i <= activeIndex;
                return (
                    <motion.div
                        key={p.id}
                        className={`absolute w-3 h-3 rounded-full blur-[1px] ${isActive ? 'bg-amber-300 shadow-[0_0_10px_#fcd34d]' : 'bg-slate-700/30'}`}
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: p.speed,
                            repeat: Infinity,
                            ease: "linear",
                            delay: -p.delay
                        }}
                        style={{
                            transformOrigin: "center center",
                            // Use offset to place particle on orbit
                            top: '50%',
                            left: '50%',
                            marginTop: -1.5,
                            marginLeft: -1.5,
                            // Framer motion rotate rotates the element itself, we need it to orbit
                            // A common trick is wrapping it in a parent that rotates, or using basic CSS calc for initial position
                        }}
                    >
                        {/* The actual dot that stays at a distance R from center */}
                        <div
                            style={{ transform: `translate(${p.r}px, 0)` }}
                            className={`w-full h-full rounded-full ${isActive ? 'bg-amber-300' : 'bg-slate-700/30'}`}
                        />
                    </motion.div>
                )
            })}

            <div className="absolute w-20 h-20 rounded-full bg-amber-500/10 blur-xl" />
        </div>
    );
}
