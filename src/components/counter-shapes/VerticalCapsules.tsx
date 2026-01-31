import { motion, AnimatePresence } from 'framer-motion';

interface VerticalCapsulesProps {
    currentCount: number;
}

export function VerticalCapsules({ currentCount }: VerticalCapsulesProps) {
    // Generate a small history of numbers to show
    const getPrevCount = (offset: number) => {
        const num = currentCount - offset;
        return num > 0 ? num : null;
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-100/10 rounded-full border border-white/20 backdrop-blur-sm overflow-hidden">
            <div className="relative h-[300px] w-full flex flex-col items-center justify-center gap-2">

                {/* Gradient Overlays for depth */}
                <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-10" />
                <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10" />


                <AnimatePresence mode="popLayout">
                    {/* Current Active Capsule */}
                    <motion.div
                        key={currentCount}
                        initial={{ y: -50, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-24 h-12 rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)] flex items-center justify-center mb-2 z-20"
                    >
                        <span className="text-xl font-bold text-primary">{currentCount}</span>
                    </motion.div>

                    {/* Previous Capsules (Trailing) */}
                    {[1, 2, 3].map((offset) => {
                        const num = getPrevCount(offset);
                        if (num === null) return null;
                        return (
                            <motion.div
                                key={`${currentCount}-${offset}`}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 0.6 - (offset * 0.15) }}
                                className="w-16 h-8 rounded-full border border-muted-foreground/20 bg-muted/5 flex items-center justify-center"
                            >
                                <span className="text-xs font-medium text-muted-foreground">{num}</span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
