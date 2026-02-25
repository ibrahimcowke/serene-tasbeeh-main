import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '@/lib/firebase';
import { ref, onValue, serverTimestamp } from 'firebase/database';
import { Heart, Users, Swords, Trophy } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

export function DhikrPulse() {
    const [pulses, setPulses] = useState<{ id: string; type: string; count?: number }[]>([]);
    const { addNotification } = useNotificationStore();
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const pulseRef = ref(database, 'events/global/pulse');

        // Timer to skip initial batch of old pulses
        const timer = setTimeout(() => {
            isFirstLoad.current = false;
        }, 2000);

        // Listen for new pulses
        const unsubscribe = onValue(pulseRef, (snapshot) => {
            if (isFirstLoad.current) return;
            const val = snapshot.val();
            if (val) {
                // Each time the value changes, we trigger a new local pulse animation
                const pulseId = Math.random().toString(36).substring(2, 9);
                const pulseType = val.type || 'salam';
                setPulses(prev => [...prev, { id: pulseId, type: pulseType, count: val.count }]);

                // Record in Notification Center History (excluding joins which are handled locally)
                if (pulseType === 'salam') {
                    addNotification({
                        type: 'salam',
                        title: 'Community Salam',
                        message: 'A brother/sister sent Salams to everyone online.'
                    });
                } else if (pulseType === 'milestone') {
                    addNotification({
                        type: 'milestone',
                        title: 'Community Milestone',
                        message: `Someone just reached their ${val.count} dhikr milestone! Mashallah.`
                    });
                } else if (pulseType === 'challenge_accepted') {
                    addNotification({
                        type: 'challenge_accepted',
                        title: 'Challenge Accepted!',
                        message: 'Two community members started a 100-dhikr sprint. Join them!'
                    });
                }

                // Remove pulse after animation duration
                setTimeout(() => {
                    setPulses(prev => prev.filter(p => p.id !== pulseId));
                }, 4000);
            }
        });

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
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
                            <div className={`
                                backdrop-blur-md px-4 py-2 rounded-full border shadow-2xl flex items-center gap-2
                                ${pulse.type === 'salam' ? 'bg-primary/20 border-primary/30 text-primary' :
                                    pulse.type === 'user_joined' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                                        pulse.type === 'challenge_accepted' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                                            pulse.type === 'milestone' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' :
                                                'bg-primary/20 border-primary/30 text-primary'}
                            `}>
                                {pulse.type === 'salam' && <Heart className="w-4 h-4 fill-primary" />}
                                {pulse.type === 'user_joined' && <Users className="w-4 h-4" />}
                                {pulse.type === 'challenge_accepted' && <Swords className="w-4 h-4" />}
                                {pulse.type === 'milestone' && <Trophy className="w-4 h-4" />}
                                <span className="text-xs font-bold whitespace-nowrap uppercase tracking-widest">
                                    {pulse.type === 'salam' ? 'Someone sent Salams!' :
                                        pulse.type === 'user_joined' ? 'A new brother/sister joined!' :
                                            pulse.type === 'challenge_accepted' ? 'A new challenge was accepted!' :
                                                pulse.type === 'milestone' ? `Someone reached ${pulse.count} dhikrs!` :
                                                    'Community Pulse'}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
