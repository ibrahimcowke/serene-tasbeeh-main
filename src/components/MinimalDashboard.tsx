import { motion } from 'framer-motion';
import { Counter } from './Counter';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { HadithSlider } from './HadithSlider';
import { VisitorCounter } from './VisitorCounter';

export const MinimalDashboard = () => {
    const { currentDhikr } = useTasbeehStore();

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Floating Date */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 hover:opacity-100 transition-opacity duration-500"
            >
                <VisitorCounter />
            </motion.div>

            {/* Centered Counter */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full max-w-lg mb-12"
            >
                <Counter />
            </motion.div>

            {/* Floating Bottom Wisdom */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.3 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-10 w-full max-w-sm px-4"
            >
                <HadithSlider dhikr={currentDhikr} />
                <p className="text-[10px] text-center mt-2 text-muted-foreground uppercase tracking-widest pointer-events-none">Hover to reveal wisdom</p>
            </motion.div>
        </div>
    );
};
