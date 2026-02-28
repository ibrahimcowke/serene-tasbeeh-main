import { motion } from 'framer-motion';

export function CrystalPrism({ currentCount }: { currentCount: number }) {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center -z-10">
            <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                <motion.div
                    className="absolute w-[180px] h-[220px]"
                    animate={{ rotateY: [0, 360], rotateZ: [0, 10, 0] }}
                    transition={{ rotateY: { duration: 15, repeat: Infinity, ease: "linear" }, rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="absolute inset-0 bg-primary/30 backdrop-blur-md shadow-[0_0_30px_hsl(var(--primary)/0.5)] border border-primary/50"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', transform: 'translateZ(40px)' }} />

                    <div className="absolute inset-0 bg-primary/10 border border-primary/20"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', transform: 'translateZ(-40px)' }} />
                </motion.div>

                <motion.div
                    className="absolute w-[80px] h-[100px] bg-primary/80 blur-sm"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
        </div>
    );
}
