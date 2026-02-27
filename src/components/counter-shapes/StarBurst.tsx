import { motion } from 'framer-motion';

export function StarBurst({ currentCount }: { currentCount: number }) {
    return (
        <div className="relative w-full h-full flex items-center justify-center -z-10 overflow-hidden rounded-full scale-[0.9]">
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(24)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 rounded-full bg-primary/60"
                        style={{
                            height: i % 2 === 0 ? '120px' : '80px',
                            transformOrigin: 'bottom center',
                            rotate: i * 15,
                            bottom: '50%'
                        }}
                        initial={{ scaleY: 0.5, opacity: 0 }}
                        animate={{
                            scaleY: [0.8, 1.2, 0.8],
                            opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                            duration: 2 + (i % 3) * 0.5,
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                    />
                ))}
            </motion.div>

            <motion.div
                className="absolute w-32 h-32 rounded-full bg-primary/20 backdrop-blur-md shadow-[0_0_40px_hsl(var(--primary)/0.6)] flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <div className="w-24 h-24 rounded-full bg-primary/40 blur-sm" />
            </motion.div>
        </div>
    );
}
