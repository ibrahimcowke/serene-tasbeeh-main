import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';

export function BreathingGuide() {
    const { breathingGuideEnabled, breathingGuideSpeed } = useTasbeehStore();

    if (!breathingGuideEnabled) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden">
            {/* Subtle expanding/contracting glow */}
            <motion.div
                className="absolute inset-[10%] rounded-full bg-primary/5 blur-[120px]"
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                    duration: breathingGuideSpeed,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Secondary outer pulse */}
            <motion.div
                className="absolute inset-[5%] rounded-full border border-primary/10"
                animate={{
                    scale: [0.9, 1.1, 0.9],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: breathingGuideSpeed,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            />
        </div>
    );
}
