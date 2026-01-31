import { motion } from 'framer-motion';

interface GeometricFlowerProps {
    currentCount: number;
}

export function GeometricFlower({ currentCount }: GeometricFlowerProps) {
    // 8 Petals rosette that blooms/rotates
    const numPetals = 8;
    const activeIndex = currentCount % numPetals;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Central bloom */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: currentCount * (360 / 33) }} // Rotate slowly with count
                transition={{ type: "spring", stiffness: 50 }}
            >
                {Array.from({ length: numPetals }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-32 w-8 origin-bottom flex flex-col justify-start items-center pb-32"
                        style={{ rotate: i * (360 / numPetals) }}
                    >
                        <motion.div
                            className={`w-full h-24 rounded-full border border-rose-500/30 ${i === activeIndex % numPetals ? 'bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-transparent'}`}
                            animate={{
                                scale: i === activeIndex ? 1.1 : 1,
                                opacity: i === activeIndex ? 1 : 0.5
                            }}
                            style={{ borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%', borderTopLeftRadius: '50%', borderTopRightRadius: '50%' }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Core */}
            <motion.div
                className="absolute w-16 h-16 bg-rose-900 rounded-full border-4 border-rose-400 z-10 shadow-lg flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
            >
                <div className="w-2 h-2 bg-white rounded-full mx-0.5" />
                <div className="w-2 h-2 bg-white rounded-full mx-0.5" />
                <div className="w-2 h-2 bg-white rounded-full mx-0.5" />
            </motion.div>
        </div>
    );
}
