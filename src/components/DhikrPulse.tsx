import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '@/lib/firebase';
import { ref, onValue, serverTimestamp } from 'firebase/database';
import { Heart } from 'lucide-react';

export function DhikrPulse() {
    const [pulses, setPulses] = useState<{ id: string; type: string }[]>([]);

    useEffect(() => {
        const pulseRef = ref(database, 'events/global/pulse');

        // Listen for new pulses
        const unsubscribe = onValue(pulseRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                // Each time the value changes, we trigger a new local pulse animation
                const pulseId = Math.random().toString(36).substring(2, 9);
                setPulses(prev => [...prev, { id: pulseId, type: val.type || 'salam' }]);

                // Remove pulse after animation duration
                setTimeout(() => {
                    setPulses(prev => prev.filter(p => p.id !== pulseId));
                }, 4000);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            <AnimatePresence>
                {pulses.map((pulse) => (
                    <motion.div
                        key={pulse.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scale: [1, 1.5, 2],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* Global Radial Glow overlay */}
                        <div className="w-[100vmax] h-[100vmax] rounded-full bg-primary/5 blur-[100px]" />

                        {/* Floating Icon Indication */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: -100, opacity: [0, 1, 0] }}
                            transition={{ duration: 4 }}
                            className="absolute flex flex-col items-center gap-2"
                        >
                            <div className="bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30 shadow-2xl flex items-center gap-2">
                                <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
                                <span className="text-xs font-bold text-primary whitespace-nowrap uppercase tracking-widest">
                                    {pulse.type === 'salam' ? 'Someone sent Salams!' : 'Community Pulse'}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
