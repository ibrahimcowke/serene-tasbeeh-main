import { motion } from 'framer-motion';
import { Counter } from '../Counter';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { VisitorCounter } from '../VisitorCounter';

const MinimalDashboard = () => {
    const { currentDhikr } = useTasbeehStore();
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-hidden pt-20">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 hover:opacity-100 transition-opacity duration-500"
            >
                <VisitorCounter />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg mb-12"
            >
                <Counter />
            </motion.div>
        </div>
    );
};

export default MinimalDashboard;
